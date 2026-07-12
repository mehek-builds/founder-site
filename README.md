# mehek-site

Mehek Mandal's founder site. One URL that makes a cold visitor believe, in under
10 seconds, "young founder who invents, ships, and leads at an unusual rate, with
the craft to prove it," then lets them verify it with receipts.

**Live (production):** https://mehek-site.vercel.app
**Canonical plan:** the vault's `2-content/founder-site-MASTER-PLAN-2026-07-12.md`
(read it before any large change). In-repo docs in `docs/` are the enforcement copy.

## Run

Dev server is on port 3505 (defined in the vault `.claude/launch.json`). In an
agent session use `preview_start` with name `mehek-site` — never a raw dev server.
Manually: `npm run dev -- -p 3505`. Build: `npm run build`.

## Branch + deploy flow

- Build on the **`rebuild`** branch. Every push gets a Vercel PREVIEW URL (that is
  the prototype Mehek reviews). `main` keeps the currently-live site public.
- This repo **push-deploys** via Vercel git integration (unusual for Mehek's
  projects). Always verify the deploy reached READY. Commit author must be
  `mehek-builds` (the local git config is already set).
- Merging `rebuild` into `main` deploys the new site to production.

## The two content rituals (how the site stays true and un-rotted)

1. **Add a ship:** append one object to `content/items.ts`. Every hero/scene count
   derives from that file (`content/counts.ts`), so nothing can drift. Set
   `status`, and `clientWork: true` for client engagements.
2. **Weekly `now.json`:** update `content/now.json` with what you are building and
   the last ship. If it goes older than 21 days the Now widget auto-degrades to a
   still-true "Latest ship" line.

## The laws (never break — see docs/DECISIONS.md)

- Zero em dashes anywhere, including site copy.
- One amber accent, reserved for verified facts and live signals only.
- The stranger test: every proper noun is recognized by all audiences or glossed
  in visible text.
- Founder-CEO frame: no job titles rendered; verb-first leadership lines.
- The site never states a number or claim Mehek cannot back in a phone call.
- Every animated moment carries one message/metric; `transform`/`opacity` only;
  reduced-motion static twin on everything; never scrolljack.
