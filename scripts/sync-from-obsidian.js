#!/usr/bin/env node
/**
 * Sync Blog Bohemio content from Obsidian vault to local git repo
 * 
 * Copies published posts and images from iCloud Obsidian vault
 * to the local blog-bohemio repo for git tracking and deployment.
 * 
 * Usage: node scripts/sync-from-obsidian.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OBSIDIAN_VAULT = path.join(
  process.env.HOME,
  'Library/Mobile Documents/iCloud~md~obsidian/Documents/obsidian thoughts/Blog Bohemio'
);

const LOCAL_VAULT = path.join(__dirname, '../vault');

function syncDirectory(source, dest) {
  // Use rsync for efficient sync (only copies changed files)
  try {
    execSync(`rsync -av --delete "${source}/" "${dest}/"`, { stdio: 'inherit' });
    return true;
  } catch (err) {
    console.error(`❌ Error syncing ${source} → ${dest}:`, err.message);
    return false;
  }
}

async function syncFromObsidian() {
  console.log('📥 Syncing from Obsidian vault...');
  
  if (!fs.existsSync(OBSIDIAN_VAULT)) {
    console.error('❌ Obsidian vault not found:', OBSIDIAN_VAULT);
    process.exit(1);
  }

  let success = true;

  // Sync published posts
  console.log('\n📝 Syncing published posts...');
  success = syncDirectory(
    path.join(OBSIDIAN_VAULT, 'published'),
    path.join(LOCAL_VAULT, 'published')
  ) && success;

  // Sync images
  console.log('\n🖼️  Syncing images...');
  success = syncDirectory(
    path.join(OBSIDIAN_VAULT, 'images'),
    path.join(LOCAL_VAULT, 'images')
  ) && success;

  if (success) {
    console.log('\n✅ Sync complete! Ready to commit and deploy.');
  } else {
    console.error('\n❌ Sync failed. Check errors above.');
    process.exit(1);
  }
}

syncFromObsidian().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
