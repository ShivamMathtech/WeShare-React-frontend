#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
node scripts/check-node.mjs
if [ ! -d node_modules/vite ]; then
  npm ci
fi
npm run dev -- --open
