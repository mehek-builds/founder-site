# Graph Report - .  (2026-07-22)

## Corpus Check
- 32 files · ~111,068 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 91 nodes · 116 edges · 11 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `fail()` - 5 edges
2. `pass()` - 5 edges
3. `pack()` - 4 edges
4. `checkHeroMotion()` - 4 edges
5. `checkHeroReducedMotionStatic()` - 4 edges
6. `tower()` - 3 edges
7. `wrap()` - 3 edges
8. `canvasSignature()` - 3 edges
9. `checkRecordScrub()` - 3 edges
10. `checkWorkHoverToPlay()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (0): 

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (7): buildSkyline(), burj(), depthAlpha(), pack(), sail(), slotPositions(), tower()

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (3): onMove(), tick(), wrap()

### Community 3 - "Community 3"
Cohesion: 0.2
Nodes (0): 

### Community 4 - "Community 4"
Cohesion: 0.31
Nodes (2): getNow(), newestItem()

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 0.61
Nodes (7): canvasSignature(), checkHeroMotion(), checkHeroReducedMotionStatic(), checkRecordScrub(), checkWorkHoverToPlay(), fail(), pass()

### Community 7 - "Community 7"
Cohesion: 0.5
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 2.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 8`** (2 nodes): `motion.ts`, `prefersReducedMotion()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `gsap.ts`, `ensureGsap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._