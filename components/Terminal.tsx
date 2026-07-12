"use client";
// Easter egg: press "/" for a mini terminal overlay. Ships help / stack / now,
// all derivable from real data. Nobody needs it; explorers get rewarded.
import { useEffect, useRef, useState } from "react";
import { COUNTS } from "../content/counts";
import { getNow, BUILD_DATE } from "../content/now";

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([
    "mehek.sh — type `help`, then Enter. Esc to close.",
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const now = getNow(BUILD_DATE);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && !open && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20);
  }, [open]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out: string[] = [`$ ${raw}`];
    if (cmd === "help") out.push("commands: help · stack · now · clear");
    else if (cmd === "stack")
      out.push("Next.js · React · TypeScript · GSAP ScrollTrigger. Dark, static-exported, one motion token set.");
    else if (cmd === "now")
      out.push(
        now.stale
          ? `latest ship: ${now.lastShip.name} (${now.lastShip.date})`
          : `building: ${now.building!.name}. shipped: ${COUNTS.shipped}. live: ${COUNTS.live}.`
      );
    else if (cmd === "clear") {
      setLines([]);
      return;
    } else if (cmd) out.push(`command not found: ${cmd}`);
    setLines((l) => [...l, ...out]);
  };

  if (!open) return null;
  return (
    <div className="term-overlay" role="dialog" aria-label="Terminal" onClick={() => setOpen(false)}>
      <div className="term glass" onClick={(e) => e.stopPropagation()}>
        <div className="term-body">
          {lines.map((l, i) => (
            <div key={i} className={l.startsWith("$") ? "term-cmd" : ""}>
              {l}
            </div>
          ))}
        </div>
        <form
          className="term-input"
          onSubmit={(e) => {
            e.preventDefault();
            const v = inputRef.current!.value;
            run(v);
            inputRef.current!.value = "";
          }}
        >
          <span className="term-prompt">$</span>
          <input ref={inputRef} aria-label="terminal input" autoComplete="off" spellCheck={false} />
        </form>
      </div>
    </div>
  );
}
