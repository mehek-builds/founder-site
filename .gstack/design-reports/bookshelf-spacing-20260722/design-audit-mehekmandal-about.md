# Bookshelf spacing review

Date: 2026-07-22
Page: `/about`
Scope: bookshelf spacing and collision behavior

## Finding 001

Impact: Medium
Category: Spacing and layout
Status: Verified

The desktop shelf list occupied 434 px and packed adjacent spines into 1 px gaps. This made the physical books read as crowded and allowed their angled edges to appear overlapped.

Fix: increase desktop spine scale from 1 to 1.2 and increase the inter-book gap from 1 px to 4 px. Preserve the existing mobile scale and 1 px gap so the shelf remains inside the 375 px viewport.

Evidence:

- Before width: 434 px
- After width: 520 px
- Increase: 19.8%
- Collision checks: 0 overlaps in all 12 selected-book states
- Mobile: 375 px body width, 325.6 px shelf width, 0 overlaps
- Browser console: 0 errors
- Before screenshot: `screenshots/finding-001-before.png`
- After screenshot: `screenshots/finding-001-after.png`

## Scores

- Design score: B to B
- Spacing and layout: C to A
- AI slop score: A to A

Design review found 1 issue and fixed 1. The shelf now uses 20% more horizontal space without collisions or mobile overflow.
