#!/usr/bin/env node
/**
 * Image Optimizer for Blog Bohemio
 * 
 * Optimizes images for web:
 * - 3 sizes: 400px, 800px, 1600px (width)
 * - WebP conversion + JPEG fallback
 * - Target: 50% file size reduction
 * 
 * Usage: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../vault/images');
const OUTPUT_DIR = path.join(__dirname, '../quartz/public/static/images');

const SIZES = [400, 800, 1600];
const QUALITY = 85;

async function optimizeImages() {
  console.log('🖼️  Optimizing images...');
  
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('No images directory found. Skipping.');
    return;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const imageFiles = getAllImages(IMAGES_DIR);
  let processed = 0;

  for (const filePath of imageFiles) {
    const filename = path.basename(filePath, path.extname(filePath));
    const relativeDir = path.relative(IMAGES_DIR, path.dirname(filePath));
    const outputDir = path.join(OUTPUT_DIR, relativeDir);
    
    fs.mkdirSync(outputDir, { recursive: true });

    try {
      const originalSize = fs.statSync(filePath).size;
      
      for (const size of SIZES) {
        // WebP
        const webpPath = path.join(outputDir, `${filename}-${size}w.webp`);
        await sharp(filePath)
          .rotate() // Auto-rotate based on EXIF orientation
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(webpPath);

        // JPEG fallback
        const jpegPath = path.join(outputDir, `${filename}-${size}w.jpg`);
        await sharp(filePath)
          .rotate() // Auto-rotate based on EXIF orientation
          .resize(size, null, { withoutEnlargement: true })
          .jpeg({ quality: QUALITY })
          .toFile(jpegPath);
      }

      const optimizedSize = fs.statSync(path.join(outputDir, `${filename}-800w.jpg`)).size;
      const reduction = Math.round((1 - optimizedSize / originalSize) * 100);

      console.log(`✅ ${filename}: ${reduction}% reduction`);
      processed++;
      
    } catch (err) {
      console.error(`❌ Error optimizing ${filePath}:`, err.message);
    }
  }

  console.log(`\n✅ Optimized ${processed} images across ${SIZES.length} sizes (WebP + JPEG).`);
}

function getAllImages(dir) {
  const files = [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllImages(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

optimizeImages().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
