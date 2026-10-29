#!/usr/bin/env bash
# Probe the site from a machine that can reach it, without putting the key in shell history.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

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
python3 tools/api/publish.py --probe
