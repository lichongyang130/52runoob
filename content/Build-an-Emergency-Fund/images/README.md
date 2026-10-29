# Illustrations — How to Build an Emergency Fund

Sixteen illustrations (`00-hero` plus one per step) drawn for this guide only. Nothing here
is reused from another article. Each is exported at 960 px and 1600 px as WebP; the 1600 px
files are all under the 200 000 B budget and all sixteen are byte-distinct.

Backgrounds were varied deliberately so the set does not read as one room photographed
sixteen times: kitchen table at dusk, daytime desk, kitchen shelf, hallway wall, cork
noticeboard, bank branch, walnut desk under lamplight, car workshop, sunlit windowsill.

## Retouching

`14-use-fund` came back with pseudo-cursive strokes on the mechanic's pad that read as
handwriting rather than as the faint illegible marks the prompt asked for. They were
closed out in a single pass before export:

```
convert -size 1376x768 xc:black -fill white \
  -draw "polygon 748,500 828,492 836,527 754,536" -blur 0x2.5 mask.png
convert 14-use-fund.png -morphology Close Disk:5 -blur 0x0.8 clean.png
convert 14-use-fund.png clean.png mask.png -composite 14-use-fund.png
```

The mask is a parallelogram so it follows the tilt of the pad and stops short of the inked
paper edge and the pencil. A few short grey marks remain near the pencil tip, which is what
the step needs: someone is writing, and nothing on the page is legible. No untouched copy of
this file was kept — the backup command failed before the edit ran, and `images/raw/` is
outside version control.

The other fifteen needed no retouching. Checked at 4x on every surface that invites invented
lettering: the envelope and slip in `08-windfall`, the wall planner grid in `09-bill-timing`,
the chart and pinned scraps in `10-track-progress`, the bank counter and wall in
`11-accessible`, the statement rows in `12-account-terms`, the notebook and calculator in
`13-raise-target`, the number plate in `14-use-fund`, and the paper slips and jar in
`15-refill`.

## Alt text

Alt text describes the finished picture, not the brief. Four entries were rewritten after
the art arrived because the drawing differed from what had been imagined: `00-hero` had
claimed "a list of figures" where the page carries only pencil strokes, `05-payday-amount`
had said "two columns" where the notebook shows columns down both pages, and `07-start-small`
and `15-refill` both called blank folded paper "notes", which would have told a screen reader
user there is money on the table when there are only plain paper slips.
