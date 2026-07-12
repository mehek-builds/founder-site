# Architecture

Next.js 15 (app router) / React 19 / TypeScript, static-exported (SSG). GSAP +
ScrollTrigger is the single motion system. Light-only "Proof carries the color"
theme (near-white paper, ink type, one ember accent for verified facts).

## Data flow (one source of truth)

```
content/items.ts        ← every real thing, with status/clientWork/makingOf
   ├─ content/counts.ts ← ALL hero + scene numbers derive here (never hardcode)
   ├─ lib/record.ts     ← node positions for the Record grid + texture from activity.json
   └─ components/*       ← scenes read items/counts, never invent data
content/now.json → content/now.ts (21-day anti-rot) → Hero chip + Now widget
content/activity.json ← real git-log day counts (scripts/build-activity.mjs); grid texture only
```

Counts: `live` = built products (ventures/inventions) with `status: "live"`;
`shipped` = all ventures+inventions; `clientSystems` = items with `clientWork`.

## Rendering & motion

- Everything is server-rendered HTML (a plain `curl` returns the full pitch of
  every scene). The motion layer hydrates after paint and only enhances.
- `lib/gsap.ts` registers ScrollTrigger once, client-side.
- `lib/motion.ts` holds the one token set (ease-scene, ease-ui, durations, spring).
- `lib/visible.ts` `whenVisible()` gates every entrance/scrub so a background tab
  (throttled rAF) never freezes content in a hidden state. The DOM's default
  (no-JS) state is always the readable one; JS hides-then-reveals only when visible.
- Reduced motion: `.js` class is only added when motion is allowed, so all
  `.reveal` / count-up / grid-dim behavior falls back to a fully static, lit twin.

## Directory map

- `app/` — layout (fonts, OG, grade overlay), page (scene composition), globals.css
  (design tokens + primitives), scenes.css (per-scene styles).
- `components/` — one file per scene (Hero, Bet, Record, Receipts, Work, Leading,
  Person, NowFooter) plus StickyNav, Reveal, CountUp, HeroBackdrop, Terminal.
- `content/` — data layer. `lib/` — engine (gsap, motion, record, visible).
- `public/` — headshot.jpg, work/*.png (Scene 3 screenshots), og.png.

## Known follow-ups

- `public/work/*.png`: real screenshots of the four flagship sites (windows
  currently degrade to styled placeholders until these land).
- `public/og.png`: rendered share image (the lit Record grid + name + claim).
- First Load JS ~160 kB; trim toward the <150 kB budget (lazy ScrollTrigger).
- PostHog (US) analytics, buildsmart env-var pattern.
