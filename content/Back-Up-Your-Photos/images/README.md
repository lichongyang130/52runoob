# Illustrations — How to Back Up Your Photos

Status: **8 of 16 ready.** Still to draw: `08-verify`, `09-encrypt`, `10-offsite`,
`11-offline`, `12-restore`, `13-schedule`, `14-security`, `15-maintain`.

Every illustration here was drawn for this article; `media.reusedFrom` is empty.

## Format

Two widths per illustration, 16:9: `<base>-1600.webp` (1600×900, used by the article) and
`<base>-960.webp` (960×540). All 1600px files are under 200,000 bytes.

## Files

| Base | Scene | Notes |
| --- | --- | --- |
| `00-hero` | Sorting prints at a sunlit desk, laptop showing thumbnails | |
| `01-inventory` | Overhead: phone, camera, memory card and closed laptop in a row | screens off |
| `02-sync` | Kitchen table, phone held up beside a laptop | |
| `03-plan` | Notebook with three empty circles, laptop, two drives | |
| `04-capacity` | Hand holding up a small drive, prints on the desk behind | |
| `05-import` | Lamplit evening desk, phone cable going into a laptop | **cropped**, see below |
| `06-originals` | Over the shoulder in an armchair, prints on the chair arm | |
| `07-local` | Close view of a cable going into a laptop's side port | **cropped**, see below |

## The screen problem

This article is full of laptops and phones, and image models reliably invent interface
chrome and fake lettering on them. Every prompt forced screens to be nothing but soft
abstract blocks of colour standing in for photo thumbnails, with devices plain and
unbranded. Each finished file was then inspected at magnification. Confirmed clean:
all screens, the keyboards (blank keycaps), the bookshelf spines in `06-originals`, the
storage boxes in `00-hero`, and the laptop port area in `07-local` (no stamped symbols).

## Cropping

`05-import` and `07-local` came back with a rough painted vignette and white paper margins,
while the other six are full-bleed. Both were cropped into the painted area so the set
matches:

```
convert 05-import.png -crop 1128x700+88+42 +repage 05-import.png
convert 07-local.png  -crop 1300x712+38+40 +repage 07-local.png
```

Untouched originals are kept outside the repository at
`/home/user/deliverables/05-import.orig.png` and `07-local.orig.png`.

## Alt text

All sixteen alt entries were rewritten. The originals carried instructions to the
illustrator rather than descriptions — phrases like "no readable screen text" and
"screen content abstract", which tell a screen reader user nothing. Entries for the eight
undrawn steps were tightened at the same time so they are usable as briefs and as alt
text once the art exists.
