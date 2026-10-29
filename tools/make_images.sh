#!/usr/bin/env bash
# make_images.sh — 把一篇稿件的 PNG 原图批量转成站上用的双尺寸 WebP
#
# 用法:
#   bash tools/make_images.sh content/Keep-Running-Through-Winter/images
#
# 约定: 原图放在 <dir>/raw/*.png，文件名即输出前缀，例如 02-layers.png
#       输出: <dir>/02-layers-1600.webp (1600x900) 和 <dir>/02-layers-960.webp (960x540)
set -euo pipefail
# 防止被 source 时中断调用方 shell
cd "$(dirname "${BASH_SOURCE[0]}")/.."

DIR="${1:?用法: bash tools/make_images.sh <images 目录>}"
RAW="$DIR/raw"

[ -d "$RAW" ] || { echo "没有找到 $RAW"; exit 1; }
command -v convert >/dev/null || { echo "需要 ImageMagick (convert)"; exit 1; }

shopt -s nullglob
files=("$RAW"/*.png)
[ ${#files[@]} -gt 0 ] || { echo "$RAW 里没有 PNG"; exit 1; }

for f in "${files[@]}"; do
  b="$(basename "$f" .png)"
  # 按输出比例缩放后居中裁切，不假设输入固定为 1365x768。
  # 这样 4:3、方形等原图也能得到精确的 16:9 输出。
  for size in 1600x900 960x540; do
    width="${size%x*}"
    convert "$f" -auto-orient -resize "${size}^" -gravity center -extent "$size" \
            -strip -quality 82 -define webp:method=6 "$DIR/$b-$width.webp"
  done
  printf '%-28s %s KB\n' "$b" "$(( $(stat -c%s "$DIR/$b-1600.webp") / 1024 ))"
done

echo
echo "完成。总大小: $(du -sh "$DIR" | cut -f1)"
echo "提示: 单张 > 200KB 时把 -quality 降到 78 重跑。"
