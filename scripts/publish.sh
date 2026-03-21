#!/bin/bash
# Blog Bohemio - Publish workflow
# 
# Syncs content from Obsidian vault and deploys to GitHub Pages
#
# Usage: ./scripts/publish.sh ["commit message"]

set -e

cd "$(dirname "$0")/.."

echo "📥 Syncing from Obsidian vault..."
node scripts/sync-from-obsidian.js

echo ""
echo "📝 Checking for changes..."
if [[ -z $(git status --porcelain vault/) ]]; then
  echo "✅ No changes to publish."
  exit 0
fi

echo ""
echo "📦 Staging changes..."
git add vault/

echo ""
git status --short vault/

echo ""
read -p "📤 Commit and deploy? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Publish cancelled."
  exit 1
fi

COMMIT_MSG="${1:-Update blog content}"

echo ""
echo "💾 Committing..."
git commit -m "$COMMIT_MSG"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Published! Site will update in ~1 minute."
echo "🌐 https://zukiga.github.io/blog-bohemio/"
