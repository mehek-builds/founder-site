"use client";
// THE ORBIT — the hero backdrop. One fine elliptical line with a single moon
// tracing it, endlessly, behind the name. "Always in orbit"; the moon is the
// quiet light. Nothing else. Slow cursor parallax tilts the whole orbit a touch.
// Reduced-motion / touch: the moon rests at a fixed point on a static ring.
import { useEffect, useRef, useState } from "react";

// Ellipse geometry in the SVG viewBox.
const W = 1000;
const H = 560;
const CX = W / 2;
const CY = H / 2;
const RX = 430;
const RY = 225;
// Full-ellipse path (two arcs), the moon's motion path.
const PATH = `M ${CX - RX},${CY} a ${RX},${RY} 0 1,1 ${2 * RX},0 a ${RX},${RY} 0 1,1 ${-2 * RX},0`;

export default function HeroOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      el.style.setProperty("--ox", `${(px * 20).toFixed(1)}px`);
      el.style.setProperty("--oy", `${(py * 14).toFixed(1)}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="hero-orbit" ref={ref} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="orbit-svg" preserveAspectRatio="xMidYMid meet">
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY} className="orbit-ring" />
        {reduce ? (
          <circle cx={CX + RX * 0.62} cy={CY - RY * 0.78} r={9} className="orbit-moon" />
        ) : (
          <circle r={9} className="orbit-moon">
            <animateMotion dur="54s" repeatCount="indefinite" path={PATH} />
          </circle>
        )}
      </svg>
    </div>
  );
}
