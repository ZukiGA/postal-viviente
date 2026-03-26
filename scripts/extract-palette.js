#!/usr/bin/env node
/**
 * Paleta del Día — Extract dominant colors from post images
 * Uses sharp to sample pixels and find dominant colors via k-means-ish approach
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLISHED_DIR = path.join(__dirname, '../vault/published');
const IMAGES_DIR = path.join(__dirname, '../vault/images');

function getAllPosts(dir) {
  const posts = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) posts.push(...getAllPosts(full));
    else if (entry.name.endsWith('.md') && entry.name !== 'index.md') posts.push(full);
  }
  return posts;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : null;
}

function getImageSlug(content) {
  const m = content.match(/\/static\/images\/([^/]+)\//);
  return m ? m[1] : null;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function colorDistance(a, b) {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
}

async function extractPalette(imageDir, maxImages = 3) {
  const files = fs.readdirSync(imageDir)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort()
    .slice(0, maxImages);

  if (files.length === 0) return null;

  const allPixels = [];

  for (const file of files) {
    const fp = path.join(imageDir, file);
    // Resize to tiny for speed, get raw pixel data
    const { data, info } = await sharp(fp)
      .resize(50, 50, { fit: 'cover' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 3) {
      allPixels.push([data[i], data[i+1], data[i+2]]);
    }
  }

  // Simple k-means with 5 clusters
  const k = 5;
  let centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(allPixels[Math.floor(Math.random() * allPixels.length)].slice());
  }

  for (let iter = 0; iter < 15; iter++) {
    const clusters = Array.from({ length: k }, () => []);
    
    for (const px of allPixels) {
      let minD = Infinity, minI = 0;
      for (let i = 0; i < k; i++) {
        const d = colorDistance(px, centroids[i]);
        if (d < minD) { minD = d; minI = i; }
      }
      clusters[minI].push(px);
    }

    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) continue;
      centroids[i] = [
        Math.round(clusters[i].reduce((s, p) => s + p[0], 0) / clusters[i].length),
        Math.round(clusters[i].reduce((s, p) => s + p[1], 0) / clusters[i].length),
        Math.round(clusters[i].reduce((s, p) => s + p[2], 0) / clusters[i].length),
      ];
    }
  }

  // Sort by brightness (dark to light)
  centroids.sort((a, b) => (a[0]+a[1]+a[2]) - (b[0]+b[1]+b[2]));

  return centroids.map(c => rgbToHex(c[0], c[1], c[2]));
}

async function main() {
  console.log('🎨 Extracting color palettes from posts...');
  const posts = getAllPosts(PUBLISHED_DIR);
  let enriched = 0, skipped = 0;

  for (const postPath of posts) {
    const content = fs.readFileSync(postPath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) continue;

    if (/^palette:/m.test(fm)) { skipped++; continue; }

    const slug = getImageSlug(content);
    if (!slug) continue;

    const imageDir = path.join(IMAGES_DIR, slug);
    if (!fs.existsSync(imageDir)) continue;

    const name = path.relative(PUBLISHED_DIR, postPath);
    
    try {
      const colors = await extractPalette(imageDir);
      if (!colors) continue;

      const paletteYaml = `palette: [${colors.map(c => `"${c}"`).join(', ')}]`;
      
      // Insert after coordinates or weatherMemory line
      const updated = content.replace(
        /^((?:weatherMemory:[\s\S]*?(?=\n\w))|(?:coordinates:\s*\[.+\]))$/m,
        `$&\n${paletteYaml}`
      );
      fs.writeFileSync(postPath, updated);
      console.log(`  ✅ ${name}: ${colors.join(' ')}`);
      enriched++;
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
    }
  }

  console.log(`\n📊 ${enriched} enriched, ${skipped} already had palette`);
}

main().catch(console.error);
