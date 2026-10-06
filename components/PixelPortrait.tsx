"use client";
// /about portrait: a small crew of pixel agents builds Mehek's portrait block
// by block, then walks off. Ported from samuelrizzon.dev's About card (Mehek,
// 2026-10-06, "close copy of his": coral crew, colour pixel avatar). This scene
// is a recorded AMENDMENT to laws 2 and 7 and to the 2026-07-16 photocopy ruling
// (docs/DECISIONS.md): it is canvas drawing on a rAF loop, not a GSAP
// transform/opacity tween, and the crew is decoration.
//
// The art is REAL ASSET, nothing generated: public/headshot.jpg, subject cut
// out on-device with Apple's Vision framework, box-averaged to a 96x112 grid
// and quantised to 40 colours with no dithering and no hand touch-ups (Mehek,
// 2026-10-06: the 52x60 cartoon pass "looks very bad", wanted it refined and
// realistic). Once the crew lays the last block the portrait DEVELOPS: two
// sharper pixel passes, then a fade into the real photo, which is what stays
// (Mehek, same day: "it's also still assembled in those little blocks"). The
// blocks are the build, not the result. Recipe: scripts/pixel-portrait/.
//
// Degrades per law 8: the real photo is server-rendered under the canvas, so no
// JS (or a failed load) still shows her. Reduced motion skips the build and
// shows the photo.
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const SRC = "/about/pixel-portrait.png";
const PHOTO = "/about/portrait-photo.webp";
const COLS = 96;
const ROWS = 112;
const HEAD = 8; // empty rows above the portrait for the crew to land in
const TOTAL_ROWS = ROWS + HEAD;
const CREW = 10;
const TICK = 50; // ms between placements per agent (jittered)
const FALL = 140; // ms for a placed block to drop into its slot
// Develop: each sharper pixel pass holds this long, then the photo fades in.
const PASSES = [192, 384];
const PASS_MS = 230;
const FADE_MS = 420;
const DEVELOP_MS = PASSES.length * PASS_MS + FADE_MS;

const BODY = "#d98a72";
const SHADE = "#a8634f";
const INK = "#1b1a17";
// 9 x 6 sprite. 1 body, 2 eye, 3 leg. Two leg frames for the walk cycle.
const SPRITE = [".1111111.", "111111111", "112111211", "112111211", "111111111"];
const LEGS = [".3.....3.", "..3...3.."];

const LINES = ["on it", "more hair", "left a bit", "looks like her?", "smile row next"];

type Cell = { r: number; c: number; color: string };
type Block = Cell & { t0: number; fromY: number };
type Agent = {
  queue: Cell[];
  x: number;
  y: number;
  tx: number;
  ty: number;
  start: number; // when it drops in; reused as its exit time once the build is done
  next: number;
  phase: "wait" | "work" | "idle" | "leave" | "gone";
  bubble: { text: string; until: number } | null;
};

export default function PixelPortrait() {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    const host = box.current;
    if (!el || !host) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let disposed = false;
    let cell = 1;
    const built = document.createElement("canvas");
    built.width = COLS;
    built.height = TOTAL_ROWS;
    const bctx = built.getContext("2d")!;
    let cells: Cell[] = [];
    let agents: Agent[] = [];
    let blocks: Block[] = [];
    let nextBubble = 0;
    let lineAt = Math.floor(Math.random() * LINES.length);
    const cleanups: Array<() => void> = [];
    let finishedAt = 0;
    let last = 0;
    const photo = new Image();
    let passes: HTMLCanvasElement[] = [];

    const resize = () => {
      const w = host.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cell = w / COLS;
      el.width = Math.round(w * dpr);
      el.height = Math.round(cell * TOTAL_ROWS * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      draw(performance.now());
    };

    const place = (b: Cell) => {
      bctx.fillStyle = b.color;
      bctx.fillRect(b.c, b.r + HEAD, 1, 1);
    };

    const drawAgent = (a: Agent, now: number) => {
      // Sized to the frame, not the grid, so the crew reads at any resolution.
      const px = Math.max(2, Math.round(host.clientWidth / 125));
      const w = 9 * px;
      const h = 6 * px;
      const moving = Math.abs(a.tx - a.x) > 0.15 || a.phase === "leave";
      const legs = LEGS[moving ? Math.floor(now / 110) % 2 : 0];
      const bob = moving ? (Math.floor(now / 110) % 2) * px * 0.5 : 0;
      const left = Math.round(a.x * cell - w / 2);
      const top = Math.round(a.y * cell - h - bob);
      const rows = [...SPRITE, legs];
      rows.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) {
          const k = row[rx];
          if (k === ".") continue;
          ctx.fillStyle = k === "1" ? BODY : k === "2" ? INK : SHADE;
          ctx.fillRect(left + rx * px, top + ry * px, px, px);
        }
      });
      if (a.bubble && now < a.bubble.until) {
        ctx.font = `600 ${Math.max(9, Math.round(host.clientWidth / 30))}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        const tw = ctx.measureText(a.bubble.text).width;
        const bw = tw + 12;
        const bh = Math.max(16, Math.round(host.clientWidth / 17));
        const maxX = host.clientWidth - bw - 2;
        const bx = Math.min(Math.max(2, left + w / 2 - bw / 2), maxX);
        const by = Math.max(2, top - bh - 6);
        ctx.fillStyle = "#fffefb";
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        ctx.fillStyle = INK;
        ctx.textBaseline = "middle";
        ctx.fillText(a.bubble.text, bx + 6, by + bh / 2 + 1);
      }
    };

    const drawPhoto = (src: CanvasImageSource, sw: number, sh: number, smooth: boolean, alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.imageSmoothingEnabled = smooth;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(src, 0, 0, sw, sh, 0, HEAD * cell, host.clientWidth, ROWS * cell);
      ctx.restore();
    };

    const draw = (now: number) => {
      const w = host.clientWidth;
      ctx.clearRect(0, 0, w, cell * TOTAL_ROWS);
      const t = finishedAt ? now - finishedAt : -1;
      if (t < 0) {
        ctx.drawImage(built, 0, 0, COLS, TOTAL_ROWS, 0, 0, w, cell * TOTAL_ROWS);
      } else {
        // Sharper and sharper pixel passes, then the real photo fades over.
        const i = Math.min(PASSES.length - 1, Math.floor(t / PASS_MS));
        const fade = Math.min(1, Math.max(0, (t - PASSES.length * PASS_MS) / FADE_MS));
        if (fade < 1) drawPhoto(passes[i], passes[i].width, passes[i].height, false);
        if (fade > 0) drawPhoto(photo, photo.naturalWidth, photo.naturalHeight, true, fade);
      }
      for (const b of blocks) {
        const k = Math.min(1, (now - b.t0) / FALL);
        const y = b.fromY + (b.r + HEAD - b.fromY) * k * k;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.c * cell, y * cell, Math.ceil(cell), Math.ceil(cell));
      }
      for (const a of agents) if (a.phase !== "gone") drawAgent(a, now);
    };

    // Split columns into lanes holding equal amounts of work, so the crew
    // finishes together instead of the shoulder lanes trailing alone.
    const crewUp = (now: number) => {
      const perCol = new Array(COLS).fill(0);
      for (const c of cells) perCol[c.c]++;
      const per = cells.length / CREW;
      const cuts = [0];
      let acc = 0;
      for (let c = 0; c < COLS && cuts.length < CREW; c++) {
        acc += perCol[c];
        if (acc >= per * cuts.length) cuts.push(c + 1);
      }
      cuts.push(COLS);
      agents = [];
      for (let i = 0; i < CREW; i++) {
        const lo = cuts[i];
        const hi = cuts[i + 1];
        // Bottom-up, serpentine across the lane so the agent paces back and forth.
        const queue = cells
          .filter((c) => c.c >= lo && c.c < hi)
          .sort((a, b) => (b.r - a.r) || ((ROWS - a.r) % 2 ? b.c - a.c : a.c - b.c));
        const mid = (lo + hi) / 2;
        agents.push({
          queue,
          x: mid,
          y: -2,
          tx: mid,
          ty: queue.length ? queue[0].r + HEAD - 1 : HEAD,
          start: now + i * 140,
          next: 0,
          phase: "wait",
          bubble: null,
        });
      }
      nextBubble = now + 900;
    };

    const frame = (now: number) => {
      if (disposed) return;
      // Real elapsed time, capped, so a throttled tab neither stalls nor teleports.
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      blocks = blocks.filter((b) => {
        if (now - b.t0 >= FALL) {
          place(b);
          return false;
        }
        return true;
      });

      let working = 0;
      for (const a of agents) {
        if (a.phase === "wait" && now >= a.start) {
          a.phase = "work";
          a.next = now + 260;
        }
        if (a.phase === "work") {
          working++;
          // Catch up on every placement that was due since the last frame, so
          // the build runs on the clock, not on the frame rate.
          while (a.phase === "work" && now >= a.next) {
            if (!a.queue.length) {
              a.phase = "idle";
            } else {
              // Place a short run (5-10 cells) along the current row.
              const row = a.queue[0].r;
              const run = 5 + Math.floor(Math.random() * 6);
              let sum = 0;
              let n = 0;
              while (n < run && a.queue.length && a.queue[0].r === row) {
                const c = a.queue.shift()!;
                blocks.push({ ...c, t0: a.next, fromY: row + HEAD - 5 });
                sum += c.c + 0.5;
                n++;
              }
              a.tx = sum / n;
              a.ty = row + HEAD - 1;
              a.next += TICK * (0.6 + Math.random() * 0.8);
            }
          }
        }
        if (a.phase === "idle" && finishedAt && now >= a.start) a.phase = "leave";
        if (a.phase === "leave") {
          a.y -= dt * 34;
          if (a.y < -8) a.phase = "gone";
        } else if (a.phase !== "gone") {
          // Fall in from above, then glide along the build frontier.
          const fall = a.phase === "wait" ? 0 : 1;
          a.x += (a.tx - a.x) * Math.min(1, dt * 12);
          a.y += (a.ty - a.y) * Math.min(1, dt * (fall ? 9 : 0));
        }
        if (a.bubble && now > a.bubble.until) a.bubble = null;
      }

      if (working && now > nextBubble) {
        const pool = agents.filter((a) => a.phase === "work" && !a.bubble);
        if (pool.length) {
          const a = pool[Math.floor(Math.random() * pool.length)];
          a.bubble = { text: LINES[lineAt++ % LINES.length], until: now + 1500 };
        }
        nextBubble = now + 1700 + Math.random() * 900;
      }

      // Everyone done and every block landed: one sign-off, then the crew leaves.
      if (!working && !blocks.length && agents.length && !finishedAt && agents.every((a) => a.phase === "idle")) {
        finishedAt = now;
        const lead = agents[Math.floor(CREW / 2)];
        lead.bubble = { text: "enhance", until: now + DEVELOP_MS };
        window.setTimeout(() => {
          if (!disposed) lead.bubble = { text: "ship it", until: performance.now() + 1000 };
        }, DEVELOP_MS);
        agents.forEach((a, i) => (a.start = now + DEVELOP_MS + 900 + i * 120));
      }

      draw(now);
      const developing = finishedAt > 0 && now - finishedAt < DEVELOP_MS;
      if (developing || agents.some((a) => a.phase !== "gone") || blocks.length) {
        raf = requestAnimationFrame(frame);
      }
    };

    const img = new Image();
    const start = () => {
      if (disposed) return;
      // Downscaled copies of the photo for the develop passes.
      passes = PASSES.map((pw) => {
        const c = document.createElement("canvas");
        c.width = pw;
        c.height = Math.round((pw * ROWS) / COLS);
        const cx = c.getContext("2d")!;
        cx.imageSmoothingQuality = "high";
        cx.drawImage(photo, 0, 0, c.width, c.height);
        return c;
      });
      const off = document.createElement("canvas");
      off.width = COLS;
      off.height = ROWS;
      const octx = off.getContext("2d")!;
      octx.drawImage(img, 0, 0);
      const data = octx.getImageData(0, 0, COLS, ROWS).data;
      cells = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = (r * COLS + c) * 4;
          if (data[i + 3] < 128) continue;
          cells.push({ r, c, color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})` });
        }
      }
      resize();
      setReady(true);

      if (prefersReducedMotion()) {
        finishedAt = -1e9; // straight to the developed photo
        draw(performance.now());
        return;
      }
      // Plays once, when the portrait is actually on screen.
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          last = performance.now();
          crewUp(last);
          raf = requestAnimationFrame(frame);
        },
        { threshold: 0.6 },
      );
      io.observe(host);
      cleanups.push(() => io.disconnect());
    };
    // Both images first: the build needs the grid, the develop needs the photo.
    let loaded = 0;
    const onLoad = () => ++loaded === 2 && start();
    img.onload = onLoad;
    photo.onload = onLoad;
    img.src = SRC;
    photo.src = PHOTO;

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="pixel-portrait" ref={box}>
      {/* Static twin: the finished portrait, server-rendered. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="pixel-portrait-static"
        src={PHOTO}
        alt="Mehek Mandal"
        style={{ visibility: ready ? "hidden" : "visible" }}
      />
      <canvas ref={canvas} className="pixel-portrait-canvas" role="img" aria-label="Portrait of Mehek Mandal, built block by block" />
    </div>
  );
}
