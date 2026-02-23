#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   chmod +x scripts/vm_sync_build_homolog.sh
#   ./scripts/vm_sync_build_homolog.sh
#
# Optional overrides:
#   REPO_URL=https://github.com/<user>/faculdadepaulista.com.br.git
#   TARGET_DIR=/www/wwwroot/faculdadepaulista.com.br
#   BRANCH=main

REPO_URL="${REPO_URL:-https://github.com/martinlofranodeoliveira/faculdadepaulista.com.br.git}"
TARGET_DIR="${TARGET_DIR:-/www/wwwroot/faculdadepaulista.com.br}"
BRANCH="${BRANCH:-main}"

echo "==> Repo:   $REPO_URL"
echo "==> Pasta:  $TARGET_DIR"
echo "==> Branch: $BRANCH"

if [ -d "$TARGET_DIR/.git" ]; then
  echo "==> Atualizando repositório existente..."
  git -C "$TARGET_DIR" fetch --all --prune
  git -C "$TARGET_DIR" checkout "$BRANCH"
  git -C "$TARGET_DIR" pull --ff-only origin "$BRANCH"
else
  echo "==> Clonando repositório..."
  mkdir -p "$(dirname "$TARGET_DIR")"
  git clone --branch "$BRANCH" "$REPO_URL" "$TARGET_DIR"
fi

cd "$TARGET_DIR"

echo "==> Instalando dependências..."
npm ci

echo "==> Build de produção..."
npm run build

echo "==> OK: build gerada em $TARGET_DIR/dist"
