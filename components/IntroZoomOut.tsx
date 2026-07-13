"use client";
// THE OPENING — the zoom-out globe, mirror of the origin globe's zoom-in.
// On first load the Earth sits center screen on the paper, the camera pulls
// back through hairline orbit rings past a sun-glow while faint stars gather,
// and the small Earth then arcs down into the top-left corner and lands
// exactly on the site mark, which takes over its looping journey
// (an `origin-intro-done` event is the baton; see OriginGlobe.tsx).
// Runs once per browser session. Any click, wheel, key, or touch skips it;
// reduced-motion, sub-820px viewports (no corner mark there), and deep links
// skip it entirely; a hard 6.5s failsafe guarantees the cover can never stick.
import { useLayoutEffect, useRef, useState } from "react";
import LAND_ARCS from "@/lib/land-arcs";

const RAD = Math.PI / 180;
// Camera fixed on New Delhi, matching the corner mark's opening frame.
const CAM = { lon: 77.209, lat: 28.6139 };

const T_REVEAL = 350;
const T_PULL = 1600;
const T_DOCK = 950;
const T_TOTAL = T_REVEAL + T_PULL + T_DOCK;

export default function IntroZoomOut() {
  const [mounted, setMounted] = useState(true);
  const coverRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const cover = coverRef.current;
    const canvas = canvasRef.current;
    if (!cover || !canvas) return;
    const ctx = canvas.getContext("2d");
    const w = window as unknown as { __originIntroRunning?: boolean };

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const deepLink = !!location.hash && location.hash !== "#top";
    let seen = false;
    try { seen = sessionStorage.getItem("mm-intro-seen") === "1"; } catch {}
    const shouldRun = !!ctx && !reduced && !deepLink && !seen && window.innerWidth > 820;

    if (!shouldRun || !ctx) {
      w.__originIntroRunning = false;
      setMounted(false);
      return;
    }
    w.__originIntroRunning = true;
    try { sessionStorage.setItem("mm-intro-seen", "1"); } catch {}

    /* ---- geometry (same Natural Earth data as the origin globe) ---- */
    const prep = (flat: number[]) => {
      const n = flat.length / 2;
      const lam = new Float64Array(n), sp = new Float64Array(n), cp = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        lam[i] = (flat[2 * i] / 10) * RAD;
        const phi = (flat[2 * i + 1] / 10) * RAD;
        sp[i] = Math.sin(phi); cp[i] = Math.cos(phi);
      }
      return { n, lam, sp, cp };
    };
    const LAND = LAND_ARCS.map(prep);
    const GRAT: ReturnType<typeof prep>[] = [];
    for (let lon = -180; lon < 180; lon += 20) {
      const flat: number[] = [];
      for (let lat = -84; lat <= 84; lat += 4) flat.push(lon * 10, lat * 10);
      GRAT.push(prep(flat));
    }
    for (let lat = -60; lat <= 60; lat += 20) {
      const flat: number[] = [];
      for (let lon = -180; lon <= 180; lon += 4) flat.push(lon * 10, lat * 10);
      GRAT.push(prep(flat));
    }
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    /* ---- canvas + scene state ---- */
    let W = 0, H = 0, DPR = 1;
    // Stars are stored normalized and rescaled on resize; deterministic
    // pseudo-random so the sky is stable across frames.
    const fract = (x: number) => x - Math.floor(x);
    const STARS = Array.from({ length: 120 }, (_, i) => ({
      nx: fract(Math.sin(i * 127.1 + 311.7) * 43758.5453),
      ny: fract(Math.sin(i * 269.5 + 183.3) * 28001.8384),
      r: 0.7 + fract(Math.sin(i * 419.2) * 9173.25) * 0.9,
      tw: fract(Math.sin(i * 97.3) * 5461.1) * Math.PI * 2,
    }));
    const resize = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    const rot = {
      lam0: CAM.lon * RAD,
      sinP0: Math.sin(CAM.lat * RAD),
      cosP0: Math.cos(CAM.lat * RAD),
    };
    const strokeSphereLines = (
      list: ReturnType<typeof prep>[],
      cx: number, cy: number, R: number,
      color: string, alpha: number
    ) => {
      ctx.beginPath();
      for (const a of list) {
        let pen = false;
        for (let i = 0; i < a.n; i++) {
          const dl = a.lam[i] - rot.lam0;
          const cdl = Math.cos(dl), sdl = Math.sin(dl);
          const x = a.cp[i] * sdl;
          const y = rot.cosP0 * a.sp[i] - rot.sinP0 * a.cp[i] * cdl;
          const z = rot.sinP0 * a.sp[i] + rot.cosP0 * a.cp[i] * cdl;
          if (z > 0.005) {
            if (pen) ctx.lineTo(cx + x * R, cy - y * R);
            else { ctx.moveTo(cx + x * R, cy - y * R); pen = true; }
          } else pen = false;
        }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = alpha;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawEarth = (cx: number, cy: number, R: number, alpha: number, landA: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.2, cx, cy, R);
      g.addColorStop(0, "#fffefb");
      g.addColorStop(1, "#f4f1e9");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.restore();
      strokeSphereLines(GRAT, cx, cy, R, "rgba(24,20,12,0.045)", alpha);
      strokeSphereLines(LAND, cx, cy, R, "rgba(24,20,12,0.72)", alpha * 0.9 * (landA / 0.72));
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7);
      ctx.strokeStyle = "rgba(24,20,12,0.15)";
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    // Rotated-ellipse point for the ring moons.
    const TILT = -16 * RAD;
    const ringPoint = (cx: number, cy: number, rx: number, ry: number, a: number) => [
      cx + rx * Math.cos(a) * Math.cos(TILT) - ry * Math.sin(a) * Math.sin(TILT),
      cy + rx * Math.cos(a) * Math.sin(TILT) + ry * Math.sin(a) * Math.cos(TILT),
    ];
    const drawRings = (cx: number, cy: number, R: number, alpha: number, now: number) => {
      if (alpha <= 0.002) return;
      const K = [2.05, 3.2, 4.7];
      ctx.save();
      for (const k of K) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * k, R * k * 0.32, TILT, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(24,20,12,0.16)";
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // a moon on the inner ring, a slower planet on the outer
      const m = ringPoint(cx, cy, R * K[0], R * K[0] * 0.32, now * 0.0011 + 1.1);
      ctx.beginPath(); ctx.arc(m[0], m[1], 1.7, 0, 7);
      ctx.fillStyle = "rgba(24,20,12,0.55)";
      ctx.globalAlpha = alpha; ctx.fill();
      const p = ringPoint(cx, cy, R * K[2], R * K[2] * 0.32, now * -0.0005 + 3.9);
      ctx.beginPath(); ctx.arc(p[0], p[1], 2.2, 0, 7);
      ctx.fillStyle = "rgba(24,20,12,0.45)";
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const drawSun = (alpha: number) => {
      if (alpha <= 0.002) return;
      const sx = W * 0.85, sy = H * 0.86, r = Math.max(W, H) * 0.45;
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      g.addColorStop(0, `rgba(255,238,204,${0.55 * alpha})`);
      g.addColorStop(0.35, `rgba(236,178,96,${0.16 * alpha})`);
      g.addColorStop(1, "rgba(236,178,96,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.beginPath(); ctx.arc(sx, sy, 20, 0, 7);
      ctx.fillStyle = `rgba(224,150,60,${0.5 * alpha})`;
      ctx.fill();
    };

    const drawStars = (alpha: number, now: number) => {
      if (alpha <= 0.002) return;
      ctx.fillStyle = "rgba(24,20,12,1)";
      for (let i = 0; i < STARS.length; i++) {
        const s = STARS[i];
        const x = s.nx * W, y = s.ny * H;
        // the sky thickens toward the top-left: the galaxy is where we're headed
        const bias = 1 - (x / W + y / H) / 2;
        const tw = 0.75 + 0.25 * Math.sin(now * 0.002 + s.tw);
        ctx.globalAlpha = alpha * tw * (0.16 + 0.42 * bias);
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    /* ---- the run ---- */
    let finished = false;
    let raf = 0, watchdog = 0, hardStop = 0, unmountT = 0;
    const finish = () => {
      if (finished) return;
      finished = true;
      w.__originIntroRunning = false;
      window.dispatchEvent(new Event("origin-intro-done"));
      cover.classList.add("intro-cover-out");
      unmountT = window.setTimeout(() => setMounted(false), 450);
      cancelAnimationFrame(raf);
      window.clearInterval(watchdog);
      window.clearTimeout(hardStop);
      removeSkips();
    };

    const t0 = performance.now();
    let lastFrameAt = 0;
    const frame = (now: number) => {
      if (finished) return;
      lastFrameAt = now;
      const t = now - t0;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      // opaque paper: the page loads quietly underneath
      ctx.fillStyle = "#f7f5f0";
      ctx.fillRect(0, 0, W, H);

      const C0 = { x: W * 0.5, y: H * 0.46 };
      const R0 = Math.min(W, H) * 0.33;
      const R1 = 30;

      let cx = C0.x, cy = C0.y, R = R0;
      let reveal = 1, rings = 0, sky = 0, landA = 0.72;

      if (t < T_REVEAL) {
        reveal = easeOut(t / T_REVEAL);
        R = R0;
      } else if (t < T_REVEAL + T_PULL) {
        const p = easeInOut((t - T_REVEAL) / T_PULL);
        R = lerp(R0, R1, p);
        rings = Math.min(1, p * 1.7);
        sky = p;
      } else if (t < T_TOTAL) {
        const q = easeInOut((t - T_REVEAL - T_PULL) / T_DOCK);
        // measure the corner mark late so layout is settled
        const tr = document.querySelector(".globe-mark")?.getBoundingClientRect();
        const CT = tr
          ? { x: tr.left + tr.width / 2, y: tr.top + tr.height / 2 }
          : C0;
        const Rt = tr ? tr.width * 0.46 : R1;
        // gentle arc: up and out of the solar system, then into the corner
        const ctrl = { x: lerp(C0.x, CT.x, 0.35), y: CT.y - 90 };
        const u = 1 - q;
        cx = u * u * C0.x + 2 * u * q * ctrl.x + q * q * CT.x;
        cy = u * u * C0.y + 2 * u * q * ctrl.y + q * q * CT.y;
        R = lerp(R1, Rt, q);
        rings = 1 - q;
        sky = 1 - q;
        landA = lerp(0.72, 0.55, q);
      } else {
        finish();
        return;
      }

      drawSun(sky);
      drawStars(sky, now);
      drawRings(cx, cy, R, rings * 0.9, now);
      drawEarth(cx, cy, R, reveal, landA);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame((tt) => { lastFrameAt = tt; frame(tt); });
    // rAF can be suspended in embedded webviews; the cover must never stick
    watchdog = window.setInterval(() => {
      const now = performance.now();
      if (now - lastFrameAt > 300 && !finished) frame(now);
    }, 33);
    hardStop = window.setTimeout(finish, 6500);

    // any input skips straight to the site
    const skip = () => finish();
    const addSkips = () => {
      cover.addEventListener("pointerdown", skip);
      window.addEventListener("wheel", skip, { passive: true });
      window.addEventListener("keydown", skip);
      window.addEventListener("touchstart", skip, { passive: true });
    };
    const removeSkips = () => {
      cover.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("touchstart", skip);
    };
    addSkips();

    return () => {
      finished = true;
      w.__originIntroRunning = false;
      cancelAnimationFrame(raf);
      window.clearInterval(watchdog);
      window.clearTimeout(hardStop);
      window.clearTimeout(unmountT);
      window.removeEventListener("resize", resize);
      removeSkips();
    };
  }, []);

  if (!mounted) return null;
  return (
    <div className="intro-cover" ref={coverRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
