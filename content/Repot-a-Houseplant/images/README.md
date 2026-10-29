# Image status — repotting guide

All **16 illustrations are complete**: one cover plus one for each of the 15 steps. Every image was drawn for this guide; none is reused from another article, so `media.reusedFrom` is empty. Each has a 1600×900 and a 960×540 WebP variant, and no two images in the article are identical.

Two images were edited after generation:

- `12-depth` — the sack of potting mix carried an invented label with fake lettering. The label area was replaced with cloned burlap from the same sack and softened, so no pseudo-text remains.
- `07-moisture` — cropped from 1376×768 to 1220×686 to remove empty space on the right before the WebP export.

Keep both adjustments if the images are ever re-exported from `raw/`; the plain `tools/make_images.sh` run reproduces everything else.

Several files are exported below the default quality to stay under the 200 KB budget for the 1600px variant: `00-hero`, `01-signs`, `04-workspace`, `06-mix`, `10-loosen` and `12-depth` use quality 78, and `08-remove` uses quality 66.

Four alt descriptions were rewritten to match what the finished illustrations actually show rather than the original brief: `01-signs`, `03-timing`, `04-workspace` and `09-inspect`. The article still needs human review before publication.
