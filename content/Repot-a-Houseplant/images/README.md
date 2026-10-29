# Image status — repotting guide

This guide is still a **draft**. It needs 16 illustrations (one cover plus one per step) and currently has **6**: `00-hero`, `05-pot`, `08-remove`, `10-loosen`, `13-fill` and `14-water`. All six were newly generated for this guide; nothing is reused from another article. Each has a 1600×900 and a 960×540 WebP variant.

Ten step illustrations are still missing: `01-signs`, `02-identify`, `03-timing`, `04-workspace`, `06-mix`, `07-moisture`, `09-inspect`, `11-base`, `12-depth` and `15-aftercare`. The authoritative list is `imageStatus.stepImagesPending` in `article.json`. Image generation is limited to ten images per working session, so the remaining ones are produced in a later batch.

Do not package or publish this guide until every base listed in `article.json` has both WebP variants and `python3 tools/check_article.py content/Repot-a-Houseplant/article.json` reports no errors. The article also needs human review before publication.

The ignored `raw/` folder holds the source PNGs. Convert with `bash tools/make_images.sh content/Repot-a-Houseplant/images`.
