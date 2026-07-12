"use client";
// Counts an integer up when it scrolls into view. The real number is server-
// rendered as the initial text so a plain fetch and reduced-motion both show it.
import { useEffect, useRef, useState } from "react";
import { whenVisible } from "../lib/visible";

export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1100,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to); // SSR renders the true final value
  const started = useRef(false);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Only zero-and-animate when the tab is visible, so a background tab never
    // shows a frozen "0" (the real value is the SSR/initial state).
    return whenVisible(() => {
      setVal(0);
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.round(eased * to));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      return () => io.disconnect();
    });
  }, [to, duration]);

  return (
    <span ref={ref} className="num">
      {prefix}
      {val}
      {suffix}
    </span>
  );
}
