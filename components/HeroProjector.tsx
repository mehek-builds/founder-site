"use client";
// THE PROJECTOR — the hero backdrop. The paper reads blank until the cursor moves
// across it like a warm projector beam: ghostly, warm-graded frames of the real
// work "develop" only under the light, with grain and a warm bloom. The beam lags
// the cursor slightly (film feel), dims as you scroll into the Record, and parks
// at a fixed spot as a still "developed frame" under reduced-motion / touch.
// Easter egg: dwell in the bottom-left corner and a frame catches and plays.
import { useEffect, useRef, useState } from "react";

// Warm, light frames of real work (the dark trading dashboard sits out of the montage).
const FRAMES = [
  { src: "/work/rufescent.jpg", cls: "f0" },
  { src: "/work/rolequick.jpg", cls: "f1" },
  { src: "/work/buildsmart.jpg", cls: "f2" },
  { src: "/work/rufescent.jpg", cls: "f3" },
];

export default function HeroProjector() {
  const root = useRef<HTMLDivElement>(null);
  const [caught, setCaught] = useState(false);
  const caughtVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;

    // default beam position (also the still-frame position for reduced-motion/touch)
    let tx = window.innerWidth * 0.7;
    let ty = window.innerHeight * 0.36;
    let x = tx;
    let y = ty;
    const set = () => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    set();

    if (reduce || coarse) {
      el.classList.add("proj-still");
      return; // static developed frame, no cursor tracking
    }

    let dwellStart = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add("proj-live");
      // easter-egg dwell tracking: bottom-left corner
      const inCorner = e.clientX < 220 && e.clientY > window.innerHeight - 220;
      if (inCorner) {
        if (!dwellStart) dwellStart = performance.now();
        else if (!caught && performance.now() - dwellStart > 1300) setCaught(true);
      } else {
        dwellStart = 0;
      }
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      set();
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onScroll = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.85));
      el.style.setProperty("--proj-dim", String(1 - p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [caught]);

  useEffect(() => {
    if (caught) caughtVideo.current?.play().catch(() => {});
  }, [caught]);

  return (
    <div className="hero-projector" ref={root} aria-hidden="true">
      <div className="proj-reveal">
        <div className="proj-film">
          {FRAMES.map((f) => (
            <div
              key={f.cls}
              className={`proj-frame ${f.cls}`}
              style={{ backgroundImage: `url(${f.src})` }}
            />
          ))}
        </div>
        <div className="proj-grain" />
      </div>
      <div className="proj-beam" />

      {caught && (
        <div className="proj-caught">
          <video
            ref={caughtVideo}
            muted
            loop
            playsInline
            poster="/work/rufescent.jpg"
            onClick={() => setCaught(false)}
          >
            <source src="/work/rufescent.mp4" type="video/mp4" />
          </video>
          <span className="proj-caught-cap">caught one ·</span>
        </div>
      )}
    </div>
  );
}
