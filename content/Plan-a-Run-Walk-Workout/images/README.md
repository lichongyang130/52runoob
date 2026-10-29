# Image status — run-walk workout guide

This guide is still a **draft**. It needs 16 illustrations (one cover plus one per step) and currently has **4**: `00-hero`, `08-warmup`, `09-intervals` and `10-effort`. All four were newly generated for this guide; nothing is reused from the 5K or winter running articles. Each has a 1600×900 and a 960×540 WebP variant.

Twelve step illustrations are still missing: `01-purpose`, `02-health`, `03-length`, `04-route`, `05-kit`, `06-ratio`, `07-timing`, `11-cooldown`, `12-stretch`, `13-log`, `14-progress` and `15-symptoms`. The authoritative list is `imageStatus.stepImagesPending` in `article.json`. Image generation is limited to ten images per working session, so the remaining ones are produced in later batches.

Do not package or publish this guide until every base listed in `article.json` has both WebP variants and `python3 tools/check_article.py content/Plan-a-Run-Walk-Workout/article.json` reports no errors. This is exercise content, so it also needs review by a suitably qualified person before publication.

The ignored `raw/` folder holds the source PNGs. Convert with `bash tools/make_images.sh content/Plan-a-Run-Walk-Workout/images`.
