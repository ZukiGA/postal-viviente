#!/usr/bin/env node
/**
 * Process photos from iCloud Drive uploads
 * 
 * Moves photos from temporary upload folder to Obsidian vault
 * and creates a draft with the specified template.
 * 
 * Usage: node scripts/process-upload.js [folder_name] [template_type]
 */

const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(
  process.env.HOME,
  'Library/Mobile Documents/com~apple~CloudDocs/Blog Bohemio Uploads'
);

const VAULT_PATH = path.join(
  process.env.HOME,
  'Library/Mobile Documents/iCloud~md~obsidian/Documents/obsidian thoughts/Blog Bohemio'
);

const TEMPLATES = {
  cafe: 'cafe-visit.md',
  food: 'food-experience.md',
  city: 'city-exploration.md',
  travel: 'travel-story.md',
  free: 'free-form.md'
};

async function processUpload(folderName, templateType = 'free') {
  const uploadPath = path.join(UPLOADS_DIR, folderName);
  
  if (!fs.existsSync(uploadPath)) {
    console.error(`❌ Upload folder not found: ${folderName}`);
    process.exit(1);
  }

  // Get all images from upload folder
  const files = fs.readdirSync(uploadPath).filter(f => 
    /\.(jpg|jpeg|png|heic)$/i.test(f)
  );

  if (files.length === 0) {
    console.error('❌ No images found in upload folder');
    process.exit(1);
  }

  console.log(`📸 Found ${files.length} images`);

  // Generate draft filename
  const timestamp = new Date().toISOString().slice(0, 10);
  const slug = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const draftPath = path.join(VAULT_PATH, 'drafts', `${timestamp}-${slug}.md`);

  // Copy images to vault
  const imageNames = [];
  for (const file of files) {
    const destPath = path.join(VAULT_PATH, 'images', file);
    fs.copyFileSync(path.join(uploadPath, file), destPath);
    imageNames.push(file);
    console.log(`📋 Copied: ${file}`);
  }

  // Load template
  const templatePath = path.join(VAULT_PATH, 'templates', TEMPLATES[templateType] || TEMPLATES.free);
  let template = fs.readFileSync(templatePath, 'utf8');

  // Update frontmatter
  const frontmatter = [
    '---',
    `title: ${folderName}`,
    `date: ${timestamp}`,
    'tags: []',
    'location: ',
    'rating: ',
    'gallery:',
    ...imageNames.map(name => `  - ${name}`),
    '---',
    ''
  ].join('\n');

  // Extract content after frontmatter from template
  const contentMatch = template.match(/---\n[\s\S]*?---\n([\s\S]*)/);
  const content = contentMatch ? contentMatch[1] : template;

  // Write draft
  fs.writeFileSync(draftPath, frontmatter + content);

  console.log(`\n✅ Draft created: drafts/${path.basename(draftPath)}`);
  console.log(`📝 Open in Obsidian to edit`);

  // Clean up upload folder
  fs.rmSync(uploadPath, { recursive: true, force: true });
  console.log(`🧹 Cleaned up upload folder`);

  return draftPath;
}

// CLI
if (require.main === module) {
  const folderName = process.argv[2];
  const templateType = process.argv[3] || 'free';

  if (!folderName) {
    console.error('Usage: node scripts/process-upload.js [folder_name] [template_type]');
    console.error('Templates: cafe, food, city, travel, free');
    process.exit(1);
  }

  processUpload(folderName, templateType).catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { processUpload };
