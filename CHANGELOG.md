# Changelog

## 2026-07-12 — Rebuild: "Proof carries the color" (Phases B-F, on `rebuild` branch)

Full cinematic rebuild per the master plan. The old GitHub-profile shell is
demolished (survives in git history); the data layer was kept and extended.

**Added**
- Light "Proof carries the color" design system (`globals.css`, `scenes.css`): near-white paper
  canvas, one amber accent reserved for verified facts, Space Grotesk display +
  system text, global grain+vignette grade, node motif, glass receipts.
- Seven scenes: Hero (kinetic reveal + count-ups + ambient grid backdrop), The Bet
  (pinned origin), The Record (pinned scrubbed timeline of every real item, with an
  interactive deep-linkable node index), Receipts (glass evidence cards + pillar
  filters + `#item-slug`), The Work (four flagship product windows), Leading
  (count-up lines), The Person (headshot tilt + honest note), Now + colophon +
  terminal easter egg. Sticky section nav.
- Data layer: `items.ts` extended (status / clientWork / makingOf / watch),
  Rufescent added, every oneLiner rewritten as a stranger-gloss, PEAD de-acronymed;
  `counts.ts` (all numbers derive from items), `now.ts` (21-day anti-rot).
- Motion engine: `lib/gsap.ts`, `lib/motion.ts`, `lib/visible.ts` (background-tab
  guard so throttled rAF never freezes content hidden). GSAP added.
- In-repo docs: ARCHITECTURE, SCENES, DECISIONS.

**Verified**
- Production build passes (static prerender, no TS/lint/SSR errors).
- Plain `curl` returns the full server-rendered pitch of every scene.
- Hero renders 8 live / 16 shipped / 120 students led, all derived from items.ts.

**Next**
- Real screenshots into `public/work/` + `public/og.png`; PostHog; perf trim to
  <150 kB; qa-motion-recorder gate; a11y/mobile pass (Phase F).
- Mehek sign-off on items.ts + honest note before merging `rebuild` into `main`.
