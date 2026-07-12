"use client";
// Scene 0 — the 10-second block. The entire pitch, server-rendered and visible
// before any JS. Kinetic line-reveal + count-ups enhance on top.
import { useEffect, useRef } from "react";
import { ensureGsap } from "../lib/gsap";
import { whenVisible } from "../lib/visible";
import CountUp from "./CountUp";
import HeroHarmonograph from "./HeroHarmonograph";
import { COUNTS } from "../content/counts";
import { getNow, BUILD_DATE } from "../content/now";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const now = getNow(BUILD_DATE);
  const chip = now.building ?? { name: now.lastShip.name, gloss: now.lastShip.gloss };

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return whenVisible(() => {
      const { gsap } = ensureGsap();
      const ctx = gsap.context(() => {
        gsap.set(".hero-line-inner", { yPercent: 110 });
        gsap.set(".hero-fade", { opacity: 0, y: 14 });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(".hero-line-inner", { yPercent: 0, duration: 0.75, stagger: 0.12 })
          .to(".hero-fade", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.3");
      }, root);
      return () => ctx.revert();
    });
  }, []);

  return (
    <header className="scene hero" ref={root} id="top">
      <HeroHarmonograph />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="wrap hero-inner">
        <h1 className="hero-title">
          <span className="hero-line">
            <span className="hero-line-inner">Mehek Mandal</span>
          </span>
          <span className="hero-line hero-line-2">
            <span className="hero-line-inner">Building products.</span>
          </span>
        </h1>

        <p className="hero-stats hero-fade">
          <CountUp to={COUNTS.total} />
          <span className="hero-stat-label"> shipped</span>
        </p>

        <p className="hero-chip hero-fade">
          <span className="node-live" aria-hidden="true" />
          <span>
            now: {chip.name}, {chip.gloss}
          </span>
        </p>

        <p className="hero-sub hero-fade">
          CS + Business @ USC, on a gap year building products.
        </p>

        <div className="hero-cta hero-fade">
          <a className="btn btn-primary" href="mailto:mehekman@usc.edu">
            Get in touch
          </a>
          <a
            className="btn"
            href="https://www.instagram.com/mehek.builds"
            target="_blank"
            rel="noreferrer"
          >
            Follow along
          </a>
        </div>
      </div>

      <a className="hero-cue hero-fade" href="#record" aria-label="Scroll to the record">
        <span>the record</span>
        <span className="hero-cue-arrow">↓</span>
      </a>
    </header>
  );
}
