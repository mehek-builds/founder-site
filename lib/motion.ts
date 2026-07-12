// The single motion token set. GSAP is the only motion system on the site;
// scenes AND micro-interactions share these tokens. Consistency is the quality
// signal (design law §4). No Framer Motion, no Lenis at v1.

export const EASE = {
  // Scene reveals: expressive, filmic settle.
  scene: "power3.out",
  // UI micro-interactions: quick, crisp.
  ui: "power2.out",
  // The scrub timeline base (linear feel, scroll drives it).
  scrub: "none",
} as const;

export const DUR = {
  ui: 0.3, // 200-500ms UI
  reveal: 0.6, // 300-600ms reveals
  hero: 0.5,
} as const;

// One spring config, expressed as a GSAP tween approximation.
export const SPRING = { duration: 0.7, ease: "elastic.out(1, 0.75)" } as const;

// True when the visitor asked for reduced motion. Everything degrades to a
// static, fully-readable twin when this is true (don't-list rule 5).
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
