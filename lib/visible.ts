// Runs an entrance/scrub setup only when the tab is actually visible. If the
// page loads in a background tab, rAF is throttled and GSAP would otherwise
// freeze mid-animation, leaving content hidden. This guarantees the DOM stays
// in its readable (final) state until the tab is visible, then plays.
export function whenVisible(run: () => void | (() => void)): () => void {
  if (typeof document === "undefined") return () => {};
  let cleanup: void | (() => void);
  if (!document.hidden) {
    cleanup = run();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }
  const onVis = () => {
    if (!document.hidden) {
      document.removeEventListener("visibilitychange", onVis);
      cleanup = run();
    }
  };
  document.addEventListener("visibilitychange", onVis);
  return () => {
    document.removeEventListener("visibilitychange", onVis);
    if (typeof cleanup === "function") cleanup();
  };
}
