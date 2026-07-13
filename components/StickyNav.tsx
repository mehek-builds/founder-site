"use client";
// Slim sticky progress nav (nodes + labels). Appears after the hero. Jumping is
// instant anchor navigation, never blocked by animation.
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "flagships", label: "Work" },
  { id: "leading", label: "Leading" },
  { id: "person", label: "Person" },
  { id: "now", label: "Now" },
];

export default function StickyNav() {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState("flagships");

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <nav className={`snav ${shown ? "snav-on" : ""}`} aria-label="Sections">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`snav-item ${active === s.id ? "snav-active" : ""}`}
        >
          <span className="snav-node" aria-hidden="true" />
          <span className="snav-label">{s.label}</span>
        </a>
      ))}
    </nav>
  );
}
