# Illustrations — How to Back Up Your Photos

Status: **16 of 16 ready.**

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
| `08-verify` | Dining table, studying the screen with chin on hand | |
| `09-encrypt` | Still life: drive, closed lockbox, blank folded card on slate | no people |
| `10-offsite` | Crouching in the hallway, drive going into a padded case | |
| `11-offline` | Looking down into an open drawer at an unplugged drive | no people |
| `12-restore` | Rainy window, one recovered photo filling the screen | |
| `13-schedule` | Marking a square on a blank wall calendar | |
| `14-security` | Standing at a kitchen counter, laptop and phone | |
| `15-maintain` | Inspecting a scuffed older drive beside a checklist | **retouched**, see below |

## The screen problem

This article is full of laptops and phones, and image models reliably invent interface
chrome and fake lettering on them. Every prompt forced screens to be nothing but soft
abstract blocks of colour standing in for photo thumbnails, with devices plain and
unbranded. Each finished file was then inspected at magnification. Confirmed clean:
all screens, the keyboards (blank keycaps), the bookshelf spines in `06-originals`, the
storage boxes in `00-hero`, the laptop port area in `07-local` (no stamped symbols), the
wall calendar in `13-schedule` (a blank grid: no month, no day names, no dates) and the
kitchen jars in `14-security`. One failure got through and was retouched, see below.

## Retouching

`15-maintain` was generated with the word "Checklist" written legibly across the top of
the paper. It was removed in two passes before export:

```
convert -size 1376x768 xc:black -fill white \
  -draw "polygon 1038,552 1180,570 1180,599 1038,584" -blur 0x2.5 mask.png
convert 15-maintain.png -morphology Close Disk:5 -blur 0x0.8 clean.png
convert 15-maintain.png clean.png mask.png -composite 15-maintain.png
# second pass for two stroke fragments left at the feathered mask edge
convert -size 1376x768 xc:black -fill white \
  -draw "roundrectangle 1030,557 1056,575 4,4" \
  -draw "roundrectangle 1128,583 1172,601 4,4" -blur 0x2 mask2.png
```

The mask is a parallelogram rather than a rectangle so it follows the tilt of the sheet,
clearing the word without touching the inked paper edge above it or the tick boxes below.
The untouched original is at `/home/user/deliverables/15-maintain.orig.png`.

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
