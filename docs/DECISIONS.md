# Decisions & standing laws

Mirror of the master-plan locked ledger (vault
`2-content/founder-site-MASTER-PLAN-2026-07-12.md` §0). The vault is canonical;
this file is the in-repo enforcement copy. A code editor must never break these.

## Locked ledger

| Decision | Value |
|---|---|
| The fork | Option B reskin + one cinematic signature scene (The Record). |
| Hero identity line | "Building products." (copy law: simplest possible text everywhere). |
| Banned phrase | "Trustee Scholar" NEVER appears. Credential renders de-named: "full-ride merit scholar" / "top 1% of USC class, full-tuition merit scholarship". |
| Numbers ledger | Spark $14K; VCA 120 students; Tonee 100+ users in 8 weeks; intern/analyst titles are data only, never rendered. |
| Higgsfield hero | One ambient loop allowed, real-asset-derived, PNG fallback. v1 ships an abstract canvas render of the grid (a real Higgsfield loop can swap into HeroBackdrop later). |
| Motion system | GSAP only, one token set (`lib/motion.ts`). No Lenis, no Framer Motion at v1. |
| Theme | "Proof carries the color", light-only v1 (Mehek rejected dark 2026-07-12; bright clean gallery, near-white paper, ink type, ember reserved for verified facts). |

## Standing laws (build gates)

1. **Zero em dashes** in any output, including site copy.
2. **One accent.** Amber = verified fact / live signal only. Never on chrome,
   headings, or decoration. Pillars use amber luminance steps, never new hues.
3. **Stranger test.** Every proper noun is either traditionally recognized by all
   three audiences (investors, co-founders, employees) or carries a 3-6 word
   visible-text gloss at every appearance. Acronyms never lead (spell the idea:
   "trades the drift after earnings," not "PEAD"). Glosses are visible, never
   hover-only. The `oneLiner` field IS the gloss.
4. **Founder-CEO frame.** No employer-first headline copy; no job title ever
   rendered; intern/analyst roles capped at grid weight 1-2; Leading scene is
   verb-first, built-things only.
5. **The ledger rule.** The site never states a number or claim Mehek cannot back
   in a phone call. Counts derive from `items.ts`; every receipt links to proof.
6. **Publish safety.** No client deal terms or pricing. Never link
   letterstory-console.vercel.app (real lead data) or any private repo. Client
   dashboards with real data are never shown; captures use sanitized rows.
7. **Motion discipline.** One message/metric per animated moment; `transform`/
   `opacity` only; reduced-motion static twin on everything; never scrolljack;
   substance reachable in one scroll, never gated behind the experience.
8. **Anti-rot.** Every dynamic feature degrades gracefully; adding a ship is one
   object in `items.ts`.

## Open (needs Mehek before production merge)

- Sign off the final `items.ts` (links, making-of facts, hero + client counts:
  currently 8 live / 16 shipped / 120 students / 4 client systems).
- Approve or rewrite the Scene 5 honest note (currently a draft).
- Early-age origin receipt (optional): supply one, or the arc stays at the JPM no.
- RoleQuick Chrome Web Store link is intentionally omitted until the listing is
  confirmed approved (it was rejected/pending as of the submission doc).
