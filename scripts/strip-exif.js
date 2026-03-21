#!/usr/bin/env node
/**
 * EXIF Stripper for Blog Bohemio
 * 
 * Removes GPS EXIF data from images before publishing.
 * HARD FAILS if GPS data cannot be removed (NFR40 compliance).
 * 
 * Usage: node scripts/strip-exif.js
 */

const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

const IMAGES_DIR = path.join(__dirname, '../vault/images');
const PUBLISHED_DIR = path.join(__dirname, '../vault/published');

async function stripExif() {
  console.log('🔒 Stripping GPS EXIF data from images...');
  
  const imageFiles = getAllImages(IMAGES_DIR);
  let processed = 0;
  let errors = 0;

  for (const filePath of imageFiles) {
    try {
      const exifData = await exifr.parse(filePath);
      
      if (exifData && (exifData.GPSLatitude || exifData.GPSLongitude)) {
        console.log(`⚠️  GPS data found in: ${path.basename(filePath)}`);
        
        // TODO: Implement GPS removal using sharp or piexifjs
        // For now, hard fail to prevent leaks
        console.error(`❌ ERROR: GPS data detected in ${filePath}`);
        console.error('GPS removal not yet implemented. Failing build.');
        process.exit(1);
      }
      
      processed++;
    } catch (err) {
      console.error(`❌ Error processing ${filePath}:`, err.message);
      errors++;
    }
  }

  if (errors > 0) {
    console.error(`\n❌ EXIF stripping failed with ${errors} errors.`);
    process.exit(1);
  }

  console.log(`✅ Processed ${processed} images. No GPS data found.`);
}

function getAllImages(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllImages(fullPath));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

stripExif().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
