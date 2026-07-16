"use client";
// THE SKYLINE (Mehek ruling, 2026-07-16; Dubai direction same day): a
// code-driven, ink-on-paper skyline that continuously builds and then goes
// back, looping on the hero horizon. The gate was run before v1 — the
// cinematic version (Higgsfield clips, film grain, vignette) conflicts with
// the Higgsfield-hero NO, the real-assets rule, and the light-clean theme,
// and Mehek ruled "ink skyline, laws kept." Then she directed: more cinematic,
// more clean, emulate DUBAI (her city — the same DXB the origin globe flies).
//
// Still NOT decoration and NOT video. Each building IS one record item from
// items.ts: heavier items take the taller slots, interior detail appears only
// at weight >= 3, and every shape derives deterministically from its slug.
// The COMPOSITION is Dubai's massing: a sail standing offshore far left
// (Burj Al Arab), a marina cluster, open water, then downtown rising to one
// telescoping needle (Burj Khalifa = the record's heaviest item). A single
// horizon line draws first; the city rises out of it and sinks back into it.
// Zero video bytes, zero credits, ink only. The harmonograph + moonlight name
// treatment stays untouched above it. Reduced-motion: the finished skyline.
//
// PLACEMENT RULED (Mehek, 2026-07-16, from a 5-variant comparison): OVERSIZED
// 70% with SPLIT CLUSTERS. The two wings hug the edges and the sky behind the
// name stays empty — the city frames the name instead of competing with it —
// and the ink fades to 55% so scale never buys loudness. Centered massing at
// this size runs the Burj through the name (variant D) and is barred. On
// narrow screens the name spans nearly the full width, so the city scales
// down to keep the wings clear of it.
import { useEffect, useRef } from "react";
import { ITEMS } from "../content/items";

const INK = (a: number) => `rgba(24,20,12,${a.toFixed(3)})`;

// Atmospheric depth in ink weight: the tallest towers hold the darkest line,
// low ones sit back in haze. All well under the name's presence.
const ALPHA_MAX = 0.17;
const ALPHA_MIN = 0.09;
const HORIZON_ALPHA = 0.07;
const DETAIL_ALPHA = 0.045;

// The cycle: the horizon draws, the city builds west to east (the needle
// rises near the end — the climax), stands, then time rewinds. Seconds.
const T_BUILD = 24;
const T_HOLD = 6;
const T_UNBUILD = 14;
const T_GAP = 2.5;
const STAGGER = 0.6; // per-building offset, in building-units
const FULL = 1.25; // 0..1 outline, 1..FULL interior detail fade

// smooth pen: ease each building's draw instead of a constant crawl
const easeIO = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// How the skyline occupies the hero. hFrac = the needle's height as a
// fraction of the hero; alphaScale fades the ink so the name always wins;
// split keeps both clusters at the edges and the sky behind the name open.
interface SkyConfig {
  hFrac: number;
  alphaScale: number;
  split: boolean;
}

// The ruled placement (see header). Below 820px (the site's mobile breakpoint)
// the wings drop to 42% so the right cluster clears the name's tail.
function configFor(w: number): SkyConfig {
  return { hFrac: w < 820 ? 0.42 : 0.7, alphaScale: 0.55, split: true };
}

// Deterministic per-slug randomness: the skyline is her record, so the same
// building must look the same on every visit and every rebuild of the loop.
function rngFor(slugSeed: string) {
  let h = 1779033703 ^ slugSeed.length;
  for (let i = 0; i < slugSeed.length; i++) {
    h = Math.imul(h ^ slugSeed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Building {
  pts: [number, number][]; // the pen's continuous path
  cum: number[];
  total: number;
  details: [number, number, number, number][]; // interior segments [x1,y1,x2,y2]
  alpha: number;
}

// Dubai's massing as a height envelope over normalized x: the marina cluster
// peaks left, downtown peaks where the needle stands. In split composition
// both clusters hug the edges and the middle stays low (open sky = the name).
function envelope(u: number, split: boolean) {
  const dc = split ? 0.84 : 0.66;
  const mc = split ? 0.13 : 0.22;
  const downtown = Math.exp(-Math.pow((u - dc) / (split ? 0.11 : 0.15), 2));
  const marina = 0.55 * Math.exp(-Math.pow((u - mc) / (split ? 0.09 : 0.11), 2));
  return Math.max(downtown, marina, split ? 0.05 : 0.08);
}

// Normalized slot positions: the offshore sail, seven marina towers, a gap of
// open water, thirteen downtown towers. One slot per record item (21 today);
// extra items spill into downtown, fewer thins it — the map stays total.
function slotPositions(n: number, split: boolean): number[] {
  const u: number[] = [0.03];
  const marina = Math.min(7, Math.max(0, n - 1));
  const m0 = split ? 0.08 : 0.1;
  const mw = split ? 0.2 : 0.26;
  for (let i = 0; i < marina; i++) u.push(m0 + (mw * i) / Math.max(marina - 1, 1));
  const downtown = n - 1 - marina;
  const d0 = split ? 0.62 : 0.45;
  const dw = split ? 0.35 : 0.52;
  for (let i = 0; i < downtown; i++) u.push(d0 + (dw * i) / Math.max(downtown - 1, 1));
  return u.slice(0, n);
}

function buildSkyline(
  w: number,
  h: number,
  cfg: SkyConfig
): { buildings: Building[]; horizon: [number, number, number] } {
  const n = ITEMS.length;
  const base = h - Math.max(52, h * 0.075);
  const HSCALE = h * cfg.hFrac; // the needle's full height
  const left = w * 0.05;
  const usable = w * 0.9;
  const px = (u: number) => left + u * usable;

  const slots = slotPositions(n, cfg.split).map((u, si) => ({
    u,
    si,
    env: envelope(u, cfg.split),
  }));
  // Heaviest record items take the tallest slots (rank to rank), so the data
  // mapping survives the Dubai composition. Ties break by record order.
  const slotRank = [...slots].sort((a, b) => b.env - a.env);
  const itemRank = ITEMS.map((it, i) => ({ it, i })).sort(
    (a, b) => b.it.weight - a.it.weight || a.i - b.i
  );
  const itemForSlot = new Array<(typeof itemRank)[number]>(n);
  slotRank.forEach((s, k) => (itemForSlot[s.si] = itemRank[k]));
  const needleSlot = slotRank[0].si;

  // towers thicken a little as the city grows, but far slower than height,
  // so the oversized city reads slender, not blocky
  const girth = 1 + (HSCALE / h - 0.3) * 0.9;
  const unit = (usable / (n + 3)) * Math.min(Math.max(girth, 1), 1.5);

  const buildings = slots.map(({ u, si, env }) => {
    const { it } = itemForSlot[si];
    const r = rngFor(it.slug);
    const cx = px(u);

    if (si === needleSlot) {
      // BURJ KHALIFA — the record's heaviest item: three telescoping tiers
      // rising to a needle, distinctly ~2x its neighbors, ink at full weight.
      return burj(cx, base, HSCALE, Math.min(Math.max(unit * 1.1, 22), 34 * girth), it.weight >= 3);
    }
    if (si === 0) {
      // BURJ AL ARAB — the sail, standing alone offshore.
      return sail(cx, base, HSCALE * (0.32 + r() * 0.05), Math.min(Math.max(unit * 1.3, 20), 40 * girth));
    }

    const jitter = 0.88 + r() * 0.24;
    const bh = HSCALE * (0.12 + 0.5 * env) * jitter * (0.8 + 0.2 * (it.weight / 4));
    const bw = Math.min(Math.max(unit * (0.5 + r() * 0.3), 9), 30 * girth);
    return tower(cx, base, bh, bw, r, it.weight, HSCALE);
  });

  // the name always wins: fade the whole city by the scale's alpha budget
  for (const b of buildings) b.alpha *= cfg.alphaScale;

  return { buildings, horizon: [px(0) - w * 0.015, px(1) + w * 0.015, base] };
}

function pack(
  pts: [number, number][],
  details: [number, number, number, number][],
  alpha: number
): Building {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return { pts, cum, total: cum[cum.length - 1], details, alpha };
}

function depthAlpha(bh: number, hscale: number) {
  return ALPHA_MIN + (ALPHA_MAX - ALPHA_MIN) * Math.min(bh / hscale, 1);
}

function burj(cx: number, base: number, H: number, bw: number, detail: boolean): Building {
  const y1 = base - H * 0.42;
  const y2 = base - H * 0.66;
  const y3 = base - H * 0.84;
  const top = base - H;
  const w1 = bw / 2, w2 = bw * 0.32, w3 = bw * 0.16;
  const pts: [number, number][] = [
    [cx - w1, base], [cx - w1, y1], [cx - w2, y1], [cx - w2, y2],
    [cx - w3, y2], [cx - w3, y3],
    [cx, y3], [cx, top], [cx, y3], // the needle: up and retrace
    [cx + w3, y3], [cx + w3, y2], [cx + w2, y2], [cx + w2, y1],
    [cx + w1, y1], [cx + w1, base],
  ];
  const details: [number, number, number, number][] = detail
    ? [
        [cx - w2 * 0.9, y1, cx + w2 * 0.9, y1],
        [cx - w3 * 0.9, y2, cx + w3 * 0.9, y2],
      ]
    : [];
  return pack(pts, details, ALPHA_MAX);
}

function sail(cx: number, base: number, H: number, bw: number): Building {
  const top = base - H;
  const x0 = cx - bw * 0.45;
  // one vertical mast, then the sail's curve swept back down to the water
  const pts: [number, number][] = [[x0, base], [x0, top]];
  const steps = 22;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    // quadratic bulge toward open water (screen-right of the mast)
    const qx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + bw * 1.15) + t * t * (x0 + bw * 0.9);
    const qy = (1 - t) * (1 - t) * top + 2 * (1 - t) * t * (base - H * 0.5) + t * t * base;
    pts.push([qx, qy]);
  }
  return pack(pts, [], ALPHA_MIN + 0.02);
}

function tower(
  cx: number,
  base: number,
  bh: number,
  bw: number,
  r: () => number,
  weight: number,
  hscale: number
): Building {
  const x0 = cx - bw / 2, x1 = cx + bw / 2;
  const top = base - bh;
  const kind = r();
  const tall = bh > hscale * 0.3;
  const pts: [number, number][] = [[x0, base]];

  if (tall && kind < 0.35) {
    // tapered crown: sloped shoulders meeting a peak (Emirates Towers family)
    const sh = bh * (0.16 + r() * 0.1);
    const peak = cx + bw * (r() - 0.5) * 0.5;
    pts.push([x0, top + sh], [peak, top], [x1, top + sh]);
  } else if (tall && kind < 0.6) {
    // spire: flat crown with an off-center mast, drawn and retraced
    const mx = cx + bw * (r() - 0.5) * 0.6;
    const spike = bh * (0.12 + r() * 0.12);
    pts.push([x0, top], [mx, top], [mx, top - spike], [mx, top], [x1, top]);
  } else if (kind < 0.78) {
    // single-slope roof (the Almas-style diagonal)
    const drop = bh * (0.08 + r() * 0.12);
    const dir = r() < 0.5;
    pts.push([x0, dir ? top : top + drop], [x1, dir ? top + drop : top]);
  } else if (kind < 0.9 && bh > hscale * 0.18) {
    // setback tier
    const drop = bh * (0.18 + r() * 0.14);
    const at = 0.5 + r() * 0.18;
    pts.push([x0, top], [x0 + bw * at, top], [x0 + bw * at, top + drop], [x1, top + drop]);
  } else {
    pts.push([x0, top], [x1, top]); // flat
  }
  pts.push([x1, base]);

  // interior detail only where the record is heavy: two slim vertical
  // mullion lines, Dubai glass rather than v1's horizontal floor ticks
  const details: [number, number, number, number][] = [];
  if (weight >= 3 && tall) {
    for (const f of [0.38, 0.64]) {
      const dx = x0 + bw * f;
      details.push([dx, base - 2, dx, top + bh * 0.14]);
    }
  }
  return pack(pts, details, depthAlpha(bh, hscale));
}

function strokePartial(ctx: CanvasRenderingContext2D, b: Building, frac: number) {
  const target = b.total * Math.min(frac, 1);
  ctx.beginPath();
  ctx.moveTo(b.pts[0][0], b.pts[0][1]);
  for (let i = 1; i < b.pts.length; i++) {
    if (b.cum[i] <= target) {
      ctx.lineTo(b.pts[i][0], b.pts[i][1]);
      continue;
    }
    const seg = b.cum[i] - b.cum[i - 1];
    const k = seg > 0 ? (target - b.cum[i - 1]) / seg : 0;
    ctx.lineTo(
      b.pts[i - 1][0] + (b.pts[i][0] - b.pts[i - 1][0]) * k,
      b.pts[i - 1][1] + (b.pts[i][1] - b.pts[i - 1][1]) * k
    );
    break;
  }
  ctx.stroke();
}

function penPoint(b: Building, frac: number): [number, number] {
  const target = b.total * Math.min(frac, 1);
  for (let i = 1; i < b.pts.length; i++) {
    if (b.cum[i] >= target) {
      const seg = b.cum[i] - b.cum[i - 1];
      const k = seg > 0 ? (target - b.cum[i - 1]) / seg : 0;
      return [
        b.pts[i - 1][0] + (b.pts[i][0] - b.pts[i - 1][0]) * k,
        b.pts[i - 1][1] + (b.pts[i][1] - b.pts[i - 1][1]) * k,
      ];
    }
  }
  return b.pts[b.pts.length - 1];
}

export default function HeroSkyline() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0,
      h = 0;
    let cfg = configFor(0);
    let buildings: Building[] = [];
    let horizon: [number, number, number] = [0, 0, 0];
    const n = ITEMS.length;
    // drive 0..1 draws the horizon; buildings start at 1 and stagger from there
    const SPAN = 1 + (n - 1) * STAGGER + FULL;

    const render = (drive: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.9;
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";

      // the horizon draws first and erases last: the city rises from a line
      const hp = Math.min(Math.max(drive, 0), 1);
      if (hp > 0) {
        const [hx0, hx1, hy] = horizon;
        ctx.strokeStyle = INK(HORIZON_ALPHA * cfg.alphaScale);
        ctx.beginPath();
        ctx.moveTo(hx0, hy);
        ctx.lineTo(hx0 + (hx1 - hx0) * easeIO(hp), hy);
        ctx.stroke();
      }

      buildings.forEach((b, i) => {
        const p = Math.min(Math.max(drive - 1 - i * STAGGER, 0), FULL);
        if (p <= 0) return;
        const pe = p < 1 ? easeIO(p) : 1;
        ctx.strokeStyle = INK(b.alpha);
        strokePartial(ctx, b, pe);
        if (p > 0 && p < 1) {
          const [px, py] = penPoint(b, pe);
          ctx.beginPath();
          ctx.fillStyle = INK(0.4 * cfg.alphaScale);
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        if (p > 1 && b.details.length) {
          const fa = DETAIL_ALPHA * cfg.alphaScale * ((p - 1) / (FULL - 1));
          ctx.strokeStyle = INK(fa);
          ctx.beginPath();
          for (const [dx0, dy0, dx1, dy1] of b.details) {
            ctx.moveTo(dx0, dy0);
            ctx.lineTo(dx1, dy1);
          }
          ctx.stroke();
        }
      });
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      // Same deliberate no-dpr canvas as the harmonograph: the browser's
      // upscale is what gives the line its soft, hazy thinness.
      canvas.width = w;
      canvas.height = h;
      cfg = configFor(w);
      ({ buildings, horizon } = buildSkyline(w, h, cfg));
      if (reduce) render(SPAN); // the finished skyline, standing still
    };
    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      return () => window.removeEventListener("resize", resize);
    }

    const CYCLE = T_BUILD + T_HOLD + T_UNBUILD + T_GAP;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    const step = (now: number) => {
      // clamp dt so a background-tab return doesn't teleport the loop
      t += Math.min((now - last) / 1000, 0.1);
      last = now;
      const tc = t % CYCLE;
      let drive: number;
      if (tc < T_BUILD) {
        drive = (tc / T_BUILD) * SPAN;
      } else if (tc < T_BUILD + T_HOLD) {
        drive = SPAN;
      } else if (tc < T_BUILD + T_HOLD + T_UNBUILD) {
        // time rewinds: the same drive runs backward, so the city un-builds
        // east to west and sinks back into the horizon line
        drive = (1 - (tc - T_BUILD - T_HOLD) / T_UNBUILD) * SPAN;
      } else {
        drive = 0;
      }
      render(drive);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-skyline" aria-hidden="true" />;
}
