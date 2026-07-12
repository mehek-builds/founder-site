"use client";
// The hero's ambient texture: an abstract render of the Record grid (faint
// drifting amber nodes), derived from the site's own motif rather than stock
// scenery (master plan §5 Scene 0). Reduced-motion / no-canvas falls back to a
// static CSS glow (the "PNG fallback" role). Muted behind a scrim.
import { useEffect, useRef } from "react";

export default function HeroBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    type Dot = { x: number; y: number; r: number; a: number; sp: number; ph: number };
    let dots: Dot[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.max(14, Math.floor(w / 46));
      const rows = Math.max(6, Math.floor(h / 46));
      dots = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: (i + 0.5) * (w / cols),
            y: (j + 0.5) * (h / rows),
            r: 1.1,
            a: Math.random() * 0.5,
            sp: 0.2 + Math.random() * 0.5,
            ph: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const tw = 0.12 + 0.5 * (0.5 + 0.5 * Math.sin(t * d.sp + d.ph));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        // ember specks on paper: the code-driven "grid echo"
        ctx.fillStyle = `rgba(217,102,10,${(tw * d.a * 0.7).toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
