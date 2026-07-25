"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const orbitRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (motionPreference.matches) orbit.pauseAnimations();
      else orbit.unpauseAnimations();
    };
    const followPointer = (event: PointerEvent) => {
      if (motionPreference.matches) return;
      const x = (event.clientX / innerWidth - 0.5) * 10;
      const y = (event.clientY / innerHeight - 0.5) * 10;
      orbit.style.setProperty("--pointer-x", `${x}px`);
      orbit.style.setProperty("--pointer-y", `${y}px`);
    };

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);
    window.addEventListener("pointermove", followPointer, { passive: true });
    return () => {
      motionPreference.removeEventListener("change", syncMotionPreference);
      window.removeEventListener("pointermove", followPointer);
    };
  }, []);

  return (
    <header className="scene hero" id="top">
      <svg
        ref={orbitRef}
        className="hero-orbit"
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <ellipse cx="600" cy="350" rx="470" ry="210" transform="rotate(-9 600 350)" />
        <ellipse cx="600" cy="350" rx="320" ry="310" transform="rotate(34 600 350)" />
        <path id="wide-flow" d="M85 500C280 220 398 579 590 310S890 210 1110 430" />
        <path id="hot-flow" className="hot" d="M350 125C570 282 700 212 915 485" />
        <circle className="dot" cx="350" cy="125" r="5" />
        <circle className="dot" cx="915" cy="485" r="5" />
        <g className="signal">
          <circle r="8" />
          <text x="16" y="4">BUILD</text>
          <animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#hot-flow" /></animateMotion>
        </g>
        <g className="signal signal-dark">
          <circle r="7" />
          <text x="15" y="4">SHIP</text>
          <animateMotion dur="4.4s" begin="-1.1s" repeatCount="indefinite"><mpath href="#wide-flow" /></animateMotion>
        </g>
        <g className="signal">
          <circle r="6" />
          <text x="14" y="4">LISTEN</text>
          <animateMotion dur="5.2s" begin="-2.7s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href="#wide-flow" /></animateMotion>
        </g>
        <g className="signal signal-dark">
          <circle r="6" />
          <text x="14" y="4">REPEAT</text>
          <animateMotion dur="4s" begin="-2s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"><mpath href="#hot-flow" /></animateMotion>
        </g>
      </svg>
      <div className="wrap hero-inner">
        <h1 className="hero-title">
          <span>mehek mandal</span>
          <span className="hero-builds">loves building products.</span>
        </h1>
      </div>
      <a className="hero-cue" href="#flagships" aria-label="Scroll down">
        <span className="hero-cue-arrow">↓</span>
      </a>
    </header>
  );
}
