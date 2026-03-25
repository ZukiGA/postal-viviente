#!/usr/bin/env node
/**
 * Import Photos for Blog Bohemio
 * 
 * Processes photos from a source directory into the blog vault:
 * - Auto-rotates based on EXIF orientation (sharp .rotate())
 * - Resizes to 1600px wide (source quality)
 * - Strips all EXIF metadata
 * - Names as photo-1.jpg, photo-2.jpg, etc.
 * 
 * Usage: node scripts/import-photos.js <source-dir> <slug> [photo-list]
 * 
 * Examples:
 *   node scripts/import-photos.js ~/Desktop/fujifilm/mt-rainier mt-rainier
 *   node scripts/import-photos.js ~/Desktop/fujifilm/mt-rainier mt-rainier "DSCF5002,DSCF5001,DSCF5010"
 * 
 * If photo-list is provided, only those files are imported (in that order).
 * Otherwise, all JPG/PNG files are imported sorted by name.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const VAULT_IMAGES = path.join(
  process.env.HOME,
  'Library/Mobile Documents/iCloud~md~obsidian/Documents/obsidian thoughts/Blog Bohemio/images'
);

const MAX_WIDTH = 1600;
const QUALITY = 90;

async function importPhotos() {
  const [,, sourceDir, slug, photoList] = process.argv;

  if (!sourceDir || !slug) {
    console.error('Usage: node scripts/import-photos.js <source-dir> <slug> [photo-list]');
    console.error('  photo-list: comma-separated filenames without extension (e.g. "DSCF5002,DSCF5001")');
    process.exit(1);
  }

  const resolvedSource = path.resolve(sourceDir);
  if (!fs.existsSync(resolvedSource)) {
    console.error(`❌ Source directory not found: ${resolvedSource}`);
    process.exit(1);
  }

  const outputDir = path.join(VAULT_IMAGES, slug);
  fs.mkdirSync(outputDir, { recursive: true });

  // Get file list
  let files;
  if (photoList) {
    files = photoList.split(',').map(name => {
      const trimmed = name.trim();
      // Find the actual file (try common extensions)
      for (const ext of ['.JPG', '.jpg', '.jpeg', '.JPEG', '.png', '.PNG']) {
        const fullPath = path.join(resolvedSource, trimmed + ext);
        if (fs.existsSync(fullPath)) return fullPath;
      }
      // Try as-is (already has extension)
      const asIs = path.join(resolvedSource, trimmed);
      if (fs.existsSync(asIs)) return asIs;
      console.warn(`⚠️  Not found: ${trimmed}`);
      return null;
    }).filter(Boolean);
  } else {
    files = fs.readdirSync(resolvedSource)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .sort()
      .map(f => path.join(resolvedSource, f));
  }

  if (files.length === 0) {
    console.error('❌ No photos found.');
    process.exit(1);
  }

  console.log(`📸 Importing ${files.length} photos into ${slug}/\n`);

  let imported = 0;
  const manifest = [];

  for (let i = 0; i < files.length; i++) {
    const num = i + 1;
    const srcFile = files[i];
    const srcName = path.basename(srcFile);
    const dstName = `photo-${num}.jpg`;
    const dstPath = path.join(outputDir, dstName);

    try {
      const info = await sharp(srcFile)
        .rotate()  // Auto-rotate based on EXIF
        .resize(MAX_WIDTH, null, { withoutEnlargement: true })
        .jpeg({ quality: QUALITY })
        .toFile(dstPath);

      const orientation = info.height > info.width ? 'portrait' : 'landscape';
      console.log(`  ✓ ${dstName} ← ${srcName} (${info.width}x${info.height}, ${orientation})`);
      
      manifest.push({
        num,
        src: srcName,
        dst: dstName,
        width: info.width,
        height: info.height,
        orientation,
        mdRef: `/static/images/${slug}/${dstName.replace('.jpg', '')}-800w.jpg`
      });
      imported++;
    } catch (err) {
      console.error(`  ✗ ${srcName}: ${err.message}`);
    }
  }

  // Write manifest
  const manifestPath = path.join(outputDir, '_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // Print markdown references
  console.log(`\n✅ Imported ${imported}/${files.length} photos to ${outputDir}`);
  console.log(`📋 Manifest saved to ${manifestPath}\n`);
  console.log('📝 Markdown image references:');
  console.log('─'.repeat(50));
  for (const m of manifest) {
    console.log(`![Caption here](${m.mdRef})`);
  }
  console.log('─'.repeat(50));
}

importPhotos().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
