#!/usr/bin/env bash
# Upload only the remaining step illustrations from a connected machine.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [[ $# -ne 1 || "${1:-}" != "--confirm" ]]; then
  echo '用法: bash tools/upload_steps.sh --confirm' >&2
  echo '注意：这会真实上传最多 12 张步骤图，不会创建或发布文章。' >&2
  exit 2
fi
printf '%s\n' '注意：这次会真实上传冬季文章的步骤图；不会创建或发布文章。'
if [[ -z "${SITE_API_TOKEN:-}" ]]; then
  if [[ ! -t 0 ]]; then
    echo '请在可交互的终端运行，或先通过安全方式设置 SITE_API_TOKEN。' >&2
    exit 1
  fi
  read -r -s -p '请输入网站 API 密钥（不回显）：' SITE_API_TOKEN
  printf '\n' >&2
fi
if [[ -z "${SITE_API_TOKEN//[[:space:]]/}" ]]; then
  echo '密钥不能为空。' >&2
  exit 1
fi
export SITE_API_TOKEN
trap 'unset SITE_API_TOKEN' EXIT
python3 tools/api/upload_steps.py --confirm
