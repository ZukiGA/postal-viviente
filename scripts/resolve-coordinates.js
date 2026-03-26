#!/usr/bin/env node
/**
 * Auto-coordinates for Blog Bohemio
 * 
 * Resolves coordinates for posts that have `location` but no `coordinates`.
 * Strategy: 
 *   1. Try EXIF GPS from the post's first image
 *   2. Fallback to Google Maps Geocoding API from `location` string
 * 
 * Usage: node scripts/resolve-coordinates.js
 */

const fs = require('fs');
const path = require('path');
const exifr = require('exifr');

const VAULT_DIR = path.join(__dirname, '../vault');
const PUBLISHED_DIR = path.join(VAULT_DIR, 'published');
const IMAGES_DIR = path.join(VAULT_DIR, 'images');

// Google Maps API key
const API_KEY_PATH = path.join(process.env.HOME, '.openclaw/workspace/sua/google-maps-key.txt');
let GOOGLE_API_KEY = '';
try {
  GOOGLE_API_KEY = fs.readFileSync(API_KEY_PATH, 'utf8').trim();
} catch (e) {
  console.log('⚠️  No Google Maps API key found, EXIF-only mode');
}

function getAllPosts(dir) {
  const posts = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      posts.push(...getAllPosts(fullPath));
    } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
      posts.push(fullPath);
    }
  }
  return posts;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return match[1];
}

function getField(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : null;
}

function hasCoordinates(frontmatter) {
  return /^coordinates:/m.test(frontmatter);
}

function getImageSlug(content) {
  // Extract image folder from first image reference like /static/images/mt-rainier/photo-1-800w.jpg
  const match = content.match(/\/static\/images\/([^/]+)\//);
  return match ? match[1] : null;
}

async function getExifCoords(imageDir) {
  if (!fs.existsSync(imageDir)) return null;
  
  const files = fs.readdirSync(imageDir)
    .filter(f => /\.(jpg|jpeg|png|tiff?)$/i.test(f))
    .sort(); // Try first image first

  for (const file of files) {
    try {
      const gps = await exifr.gps(path.join(imageDir, file));
      if (gps && gps.latitude && gps.longitude) {
        return [
          Math.round(gps.latitude * 10000) / 10000,
          Math.round(gps.longitude * 10000) / 10000,
        ];
      }
    } catch (e) {
      // No GPS data in this image
    }
  }
  return null;
}

async function geocode(locationStr) {
  if (!GOOGLE_API_KEY) return null;
  
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationStr)}&key=${GOOGLE_API_KEY}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return [
        Math.round(lat * 10000) / 10000,
        Math.round(lng * 10000) / 10000,
      ];
    }
  } catch (e) {
    console.error(`  ❌ Geocoding failed for "${locationStr}":`, e.message);
  }
  return null;
}

async function main() {
  console.log('🗺️  Resolving coordinates for posts...');
  
  const posts = getAllPosts(PUBLISHED_DIR);
  let resolved = 0;
  let skipped = 0;
  let failed = 0;

  for (const postPath of posts) {
    const content = fs.readFileSync(postPath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter) continue;

    // Skip if already has coordinates
    if (hasCoordinates(frontmatter)) {
      skipped++;
      continue;
    }

    const location = getField(frontmatter, 'location');
    if (!location) continue;

    const postName = path.relative(PUBLISHED_DIR, postPath);
    let coords = null;
    let source = '';

    // Strategy 1: EXIF GPS from images
    const imageSlug = getImageSlug(content);
    if (imageSlug) {
      const imageDir = path.join(IMAGES_DIR, imageSlug);
      coords = await getExifCoords(imageDir);
      if (coords) source = 'EXIF';
    }

    // Strategy 2: Google Maps Geocoding
    if (!coords) {
      coords = await geocode(location);
      if (coords) source = 'geocoding';
    }

    if (coords) {
      // Insert coordinates after location line
      const updated = content.replace(
        /^(location:\s*.+)$/m,
        `$1\ncoordinates: [${coords[0]}, ${coords[1]}]`
      );
      fs.writeFileSync(postPath, updated);
      console.log(`  ✅ ${postName}: [${coords}] (${source})`);
      resolved++;
    } else {
      console.log(`  ⚠️  ${postName}: Could not resolve "${location}"`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${resolved} resolved, ${skipped} already had coords, ${failed} failed`);
}

main().catch(console.error);
