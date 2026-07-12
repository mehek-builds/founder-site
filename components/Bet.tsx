"use client";
// Scene 1 — The Bet. The JP Morgan cornerstone, compressed to three lines.
// Soft pin; each line masks in as scroll passes a third. Quiet scene: text only.
import { useEffect, useRef } from "react";
import { ensureGsap } from "../lib/gsap";
import { whenVisible } from "../lib/visible";

const BEATS = [
  "At 20, I turned down J.P. Morgan.",
  "The safe version of me is at a desk in NYC right now.",
  "This is what I built instead.",
];

export default function Bet() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return whenVisible(() => {
      const { gsap } = ensureGsap();
      const ctx = gsap.context(() => {
        const lines = gsap.utils.toArray<HTMLElement>(".bet-line");
        gsap.set(lines, { opacity: 0.12, y: 20 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.6,
          },
        });
        lines.forEach((ln, i) => {
          tl.to(ln, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, i * 1.1);
          if (i < lines.length - 1)
            tl.to(ln, { opacity: 0.18, duration: 1 }, i * 1.1 + 1.4);
        });
      }, root);
      return () => ctx.revert();
    });
  }, []);

  return (
    <section className="scene bet" id="bet" ref={root} aria-label="Origin">
      <div className="wrap bet-inner">
        <p className="eyebrow reveal">The bet</p>
        <div className="bet-lines">
          {BEATS.map((b, i) => (
            <p className={`bet-line titlecard ${i === 0 ? "bet-line-lead" : ""}`} key={i}>
              {b}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
