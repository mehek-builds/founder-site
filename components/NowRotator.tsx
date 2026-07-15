"use client";
// PROTOTYPE 2026-07-15 (Jacqueline Guo's "She's probably..." pattern). A single
// line that rotates through FACTUAL present-tense status strings, so the page
// reads as live without asserting anything untrue. Information-bearing motion
// (what she is doing now), opacity + small rise only, on the shared --ease-ui
// token. Each new line is a fresh element (key={i}) so its CSS entrance
// animation replays and then settles at full opacity — no stuck-fade state.
// Reduced-motion shows the first line and never moves (CSS disables the anim).
import { useEffect, useState } from "react";

export default function NowRotator({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (lines.length < 2) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 3.4s dwell: slow enough to read, quiet enough to ignore
    const cycle = window.setInterval(() => {
      setI((p) => (p + 1) % lines.length);
    }, 3400);
    return () => window.clearInterval(cycle);
  }, [lines.length]);

  return (
    <span className="now-rotator">
      <span className="now-recently">Recently</span>
      {/* key changes each rotation → the element remounts → the entrance
          animation replays, then rests at opacity 1 */}
      <span key={i} className="now-rot-line">
        {lines[i]}
      </span>
    </span>
  );
}
