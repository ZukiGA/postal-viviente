#!/usr/bin/env node
/**
 * Weather Memory — Auto-enrich posts with historical weather data
 * Uses Open-Meteo Historical API (free, no key needed)
 * Reads coordinates + date from frontmatter, adds weather data
 */

const fs = require('fs');
const path = require('path');

const PUBLISHED_DIR = path.join(__dirname, '../vault/published');

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

function getField(fm, field) {
  const m = fm.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

function getCoords(fm) {
  const m = fm.match(/^coordinates:\s*\[([^\]]+)\]/m);
  if (!m) return null;
  const [lat, lng] = m[1].split(',').map(Number);
  return { lat, lng };
}

const WMO_CODES = {
  0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Niebla', 48: 'Niebla con escarcha',
  51: 'Llovizna ligera', 53: 'Llovizna moderada', 55: 'Llovizna densa',
  61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia fuerte',
  71: 'Nieve ligera', 73: 'Nieve moderada', 75: 'Nieve fuerte',
  80: 'Chubascos ligeros', 81: 'Chubascos moderados', 82: 'Chubascos fuertes',
  95: 'Tormenta', 96: 'Tormenta con granizo ligero', 99: 'Tormenta con granizo fuerte',
};

async function fetchWeather(lat, lng, date) {
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,precipitation_sum&timezone=auto`;
  
  const res = await fetch(url);
  const data = await res.json();
  
  if (!data.daily || !data.daily.time || data.daily.time.length === 0) return null;
  
  const d = data.daily;
  return {
    temp_max: Math.round(d.temperature_2m_max[0]),
    temp_min: Math.round(d.temperature_2m_min[0]),
    condition: WMO_CODES[d.weather_code[0]] || `Código ${d.weather_code[0]}`,
    wind_kmh: Math.round(d.wind_speed_10m_max[0]),
    rain_mm: Math.round(d.precipitation_sum[0] * 10) / 10,
  };
}

async function main() {
  console.log('🌤️  Enriching posts with historical weather...');
  const posts = getAllPosts(PUBLISHED_DIR);
  let enriched = 0, skipped = 0;

  for (const postPath of posts) {
    const content = fs.readFileSync(postPath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) continue;

    if (/^weatherMemory:/m.test(fm)) { skipped++; continue; }

    const date = getField(fm, 'date');
    const coords = getCoords(fm);
    if (!date || !coords) continue;

    const name = path.relative(PUBLISHED_DIR, postPath);
    
    try {
      const w = await fetchWeather(coords.lat, coords.lng, date);
      if (!w) { console.log(`  ⚠️  ${name}: no weather data`); continue; }

      const weatherYaml = `weatherMemory:\n  temp_max: ${w.temp_max}\n  temp_min: ${w.temp_min}\n  condition: "${w.condition}"\n  wind_kmh: ${w.wind_kmh}\n  rain_mm: ${w.rain_mm}`;
      
      const updated = content.replace(/^(coordinates:\s*\[.+\])$/m, `$1\n${weatherYaml}`);
      fs.writeFileSync(postPath, updated);
      console.log(`  ✅ ${name}: ${w.temp_max}°/${w.temp_min}° ${w.condition}`);
      enriched++;
    } catch (e) {
      console.log(`  ❌ ${name}: ${e.message}`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n📊 ${enriched} enriched, ${skipped} already had weather`);
}

main().catch(console.error);
