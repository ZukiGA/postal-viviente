#!/bin/bash
# Blog Bohemio - New Post workflow
#
# Full pipeline: validate → sync → check → commit → push
#
# Usage: ./scripts/new-post.sh ["commit message"]

set -e

cd "$(dirname "$0")/.."

VAULT="vault"
OBSIDIAN="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/obsidian thoughts/Blog Bohemio"

echo "📥 Step 1: Syncing from Obsidian vault..."
node scripts/sync-from-obsidian.js

echo ""
echo "🔍 Step 2: Validating image references..."

ERRORS=0
for post in $(find "$VAULT/published" -name "*.md" ! -name "index.md"); do
  # Extract image paths from markdown
  grep -oE '!\[.*\]\((.*?)\)' "$post" | grep -oE '/static/images/[^)]+' | while read img_ref; do
    # Convert /static/images/slug/photo-N-800w.jpg to vault/images/slug/photo-N.jpg
    # The optimizer generates the -800w version from the base file
    base_img=$(echo "$img_ref" | sed 's|/static/images/|vault/images/|' | sed 's/-[0-9]*w\.\(jpg\|webp\)/.\1/')
    if [ ! -f "$base_img" ]; then
      echo "  ❌ $post references $img_ref but source $base_img not found"
      ERRORS=$((ERRORS + 1))
    fi
  done
done

if [ "$ERRORS" -gt 0 ]; then
  echo ""
  echo "❌ Found $ERRORS broken image references. Fix them before publishing."
  exit 1
fi
echo "  ✅ All image references valid"

echo ""
echo "🔒 Step 3: Checking for EXIF GPS data..."
node scripts/strip-exif.js

echo ""
echo "🗺️  Step 3b: Resolving coordinates for map..."
node scripts/resolve-coordinates.js

echo ""
echo "📝 Step 4: Checking for changes..."
if [[ -z $(git status --porcelain vault/ scripts/) ]]; then
  echo "✅ No changes to publish."
  exit 0
fi

echo ""
echo "📦 Staging changes..."
git add vault/ scripts/

echo ""
git status --short vault/ scripts/

echo ""
echo "🔎 Step 5: Checking existing posts aren't deleted..."
DELETED=$(git diff --cached --diff-filter=D --name-only vault/published/ 2>/dev/null)
if [ -n "$DELETED" ]; then
  echo "⚠️  WARNING: The following published posts would be DELETED:"
  echo "$DELETED"
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publish cancelled. Restoring deleted files..."
    git checkout HEAD -- $DELETED
    exit 1
  fi
fi

COMMIT_MSG="${1:-Update blog content}"

echo ""
read -p "📤 Commit and deploy '$COMMIT_MSG'? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Publish cancelled."
  exit 1
fi

echo ""
echo "💾 Committing..."
git commit -m "$COMMIT_MSG"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Published! Site will update in ~1 minute."
echo "🌐 https://postalviviente.com"
