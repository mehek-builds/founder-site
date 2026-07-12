# Scenes (as built)

Order in `app/page.tsx`: Hero → Bet → Record → Receipts → Work → Leading →
Person → NowFooter. Sticky nav appears after the hero (Record/Work/Leading/
Person/Now), instant anchor jumps.

## 0. Hero (`Hero.tsx`, `HeroBackdrop.tsx`)
The whole pitch, server-rendered. Kinetic masked line-reveal ("Mehek Mandal" /
"Building products.") + count-ups on the stats line (derives from `counts.ts`) +
live chip (from `now.ts`) + sub-line + two CTAs. Ambient backdrop = an abstract
canvas render of the Record grid (drifting amber nodes), scrim'd; reduced-motion /
no-canvas shows a static CSS glow. Copy is the COPY LAW minimum.

## 1. The Bet (`Bet.tsx`)
Soft-pinned, three masked-reveal beats (JP Morgan origin), text only. Scrubbed.
"the record ↓" link. Reduced-motion: three static lines.

## 2. The Record (`Record.tsx`, `lib/record.ts`)
The centerpiece. Pinned graphic (`end +=360%`) builds the Aug 2024→now timeline:
one node per real item, positioned by month (x) and pillar row (y), amber
luminance = pillar. Faint texture dots = real active days from `activity.json`.
Scrub lights nodes in date order, updates the lit count, and cross-fades 5 beats.
Nodes are `<button>`s: hover/focus popover, click sets `#item-slug` (deep-link).
Default DOM state is fully lit (so hidden tabs/stalled rAF never go dark).

## 3. Receipts (`Receipts.tsx`)
The evidence index below the Record. Glass cards, fixed anatomy: state note +
date, title, gloss, description, tombstone line (wound-down), metric chips,
"How it was built" strip (weight 3-4 makingOf), tech tags, proof-ordered link
row. Pillar filter chips write `?pillar=`. `#item-slug` scrolls + flashes a card.

## 4. Work (`Work.tsx`)
Four flagship product windows (device chrome + screenshot from `public/work/`,
degrading to a placeholder). Each: gloss, three beat chips, "Open live" +
"The receipt". CSS `.reveal` entrance (robust); subtle GSAP parallax on the shot.

## 5. Leading (`Leading.tsx`)
Three Collison-compressed, verb-first lines with one count-up each (VCA 120,
Spark $14K, BuildSmart client-systems count). No titles rendered.

## 6. The Person (`Person.tsx`)
Headshot (cursor-reactive tilt, static on touch/reduced-motion) + honest note
(DRAFT — needs Mehek approval before production) + texture line + two glossed badges.

## 7. Now + colophon (`NowFooter.tsx`, `Terminal.tsx`)
Live widget from `now.ts` (21-day anti-rot), two CTAs, colophon + social links.
Easter egg: press `/` for a mini terminal (help / stack / now / clear).
