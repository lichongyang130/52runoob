# Illustrations — How to Plan a Run-Walk Workout

Status: **14 of 16 ready.** Still to draw: `14-progress`, `15-symptoms`.

Every illustration here was drawn for this article. Nothing is reused from another guide,
so `media.reusedFrom` is empty.

## Format

Each illustration ships at two widths, 16:9:

- `<base>-1600.webp` — 1600×900, the version referenced by the article
- `<base>-960.webp` — 960×540, for narrow screens

All 1600px files are kept under 200,000 bytes.

## Files

| Base | Scene | Notes |
| --- | --- | --- |
| `00-hero` | Three adults on a riverside path in autumn, walking and jogging | re-encoded at q72 to fit the size budget |
| `01-purpose` | Writing a short note at a kitchen table in morning light | |
| `02-health` | Talking with a clinician in a bright consulting room | |
| `03-length` | Pencil over the empty grid of a paper planner | alt rewritten to match the finished art |
| `04-route` | Runner looking along a looped park path | |
| `05-kit` | Shoes, bottle, reflective band and plain watch on a bench | still life, no people |
| `06-ratio` | Overhead notebook with empty interval boxes and a stopwatch | |
| `07-timing` | Phone, earphones and a key on a hallway shelf | alt rewritten: earphones, not headphones |
| `08-warmup` | Easy walking past allotment beds at sunrise | re-encoded at q72 to fit the size budget |
| `09-intervals` | Walking recovery on a coastal boardwalk | |
| `10-effort` | Two runners talking on a woodland path | re-encoded at q78 to fit the size budget |
| `11-cooldown` | Slow walk along a park path at dusk | **retouched**, see below |
| `12-stretch` | Standing calf stretch against a low dry-stone wall | alt rewritten to describe the posture |
| `13-log` | Writing up the session at a desk under a warm lamp | alt rewritten to match the finished art |

## Retouching

`11-cooldown` was generated with invented pseudo-lettering on the grass — a cluster of
marks left of the bench that read like handwriting, and a fainter smudge of the same kind
further right. Both were removed before export:

```
convert -size 1376x768 xc:black -fill white \
  -draw "roundrectangle 73,453 138,484 8,8" \
  -draw "roundrectangle 344,396 416,414 6,6" \
  -blur 0x3 mask.png
convert 11-cooldown.png -morphology Close Disk:4 -blur 0x0.8 clean.png
convert 11-cooldown.png clean.png mask.png -composite 11-cooldown.png
```

A morphological close erases thin dark strokes while leaving the watercolour wash and
paper texture intact. The untouched original is kept outside the repository at
`/home/user/deliverables/11-cooldown.orig.png`.

## Checks applied

- Every illustration was inspected at magnification for invented text, labels, logos and
  watermarks. Watch dials, the phone screen, the clipboard, the kettle and the planner
  grid were all confirmed blank.
- Alt text describes what is actually drawn. Four entries were rewritten where the
  finished art differed from the original brief.
- No two files share content; backgrounds vary by scene (kitchen, consulting room, desk,
  parkland, bench, tabletop, hallway, dusk path, stone wall, lamplit desk).
