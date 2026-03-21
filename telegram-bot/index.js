require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = process.env.BOT_TOKEN;
const authorizedUserId = parseInt(process.env.USER_ID);
const vaultPath = process.env.VAULT_PATH;

const bot = new TelegramBot(token, { polling: true });

// Session storage (in-memory, reset on restart)
const sessions = new Map();

// Templates
const TEMPLATES = {
  'cafe': { name: 'Cafe Visit ☕', screens: 8 },
  'food': { name: 'Food Experience 🍜', screens: 6 },
  'city': { name: 'City Exploration 🌆', screens: 6 },
  'travel': { name: 'Travel Story ✈️', screens: 7 },
  'free': { name: 'Free Form 📝', screens: 4 }
};

// Authorization middleware
function isAuthorized(userId) {
  return userId === authorizedUserId;
}

// Commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAuthorized(msg.from.id)) {
    bot.sendMessage(chatId, '🚫 Unauthorized');
    return;
  }

  bot.sendMessage(chatId, `🌸 Blog Bohemio Bot

Commands:
/status - Show pending drafts
/drafts - List all drafts  
/create - Start new draft

Send a photo to create a draft automatically.`);
});

bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAuthorized(msg.from.id)) return;

  const draftsPath = path.join(__dirname, vaultPath, 'drafts');
  const drafts = fs.readdirSync(draftsPath).filter(f => f.endsWith('.md'));

  bot.sendMessage(chatId, `📊 Status

Pending drafts: ${drafts.length}
Last publish: N/A

Use /drafts to see list.`);
});

bot.onText(/\/drafts/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAuthorized(msg.from.id)) return;

  const draftsPath = path.join(__dirname, vaultPath, 'drafts');
  const drafts = fs.readdirSync(draftsPath).filter(f => f.endsWith('.md'));

  if (drafts.length === 0) {
    bot.sendMessage(chatId, '📝 No pending drafts');
    return;
  }

  const list = drafts.map((f, i) => `${i + 1}. ${f}`).join('\n');
  bot.sendMessage(chatId, `📝 Pending Drafts:\n\n${list}`);
});

bot.onText(/\/create (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const template = match[1].toLowerCase();
  
  if (!isAuthorized(msg.from.id)) return;

  if (!TEMPLATES[template]) {
    bot.sendMessage(chatId, `Template not found. Options: cafe, food, city, travel, free`);
    return;
  }

  sessions.set(chatId, {
    template,
    screen: 1,
    responses: []
  });

  bot.sendMessage(chatId, `✨ ${TEMPLATES[template].name}

Screen 1 of ${TEMPLATES[template].screens}

[Prompt for screen 1 would go here]

Reply with your answer, or /skip to skip, /cancel to abort.`);
});

bot.onText(/\/create/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAuthorized(msg.from.id)) return;

  // Show template options
  const options = Object.entries(TEMPLATES)
    .map(([key, val]) => `/create ${key} - ${val.name}`)
    .join('\n');

  bot.sendMessage(chatId, `Choose a template:\n\n${options}`);
});

bot.onText(/\/upload (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  
  if (!isAuthorized(msg.from.id)) return;

  const folderName = match[1];
  const templateType = match[2];

  bot.sendMessage(chatId, `📥 Processing upload: ${folderName} (${templateType})...`);

  try {
    const { execSync } = require('child_process');
    const result = execSync(
      `node ${path.join(__dirname, '../scripts/process-upload.js')} "${folderName}" "${templateType}"`,
      { encoding: 'utf8' }
    );

    bot.sendMessage(chatId, `✅ Draft created!\n\n${result}`);
  } catch (err) {
    bot.sendMessage(chatId, `❌ Error: ${err.message}`);
  }
});

// Handle photo uploads
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAuthorized(msg.from.id)) return;

  bot.sendMessage(chatId, `📸 Photo received!

What template?
/create cafe
/create food  
/create city
/create travel
/create free`);
});

// Handle text messages (session responses)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  if (!isAuthorized(msg.from.id)) return;
  if (msg.text && msg.text.startsWith('/')) return; // Skip commands

  const session = sessions.get(chatId);
  if (!session) return;

  // Save response
  session.responses.push(msg.text);
  session.screen++;

  const template = TEMPLATES[session.template];

  if (session.screen > template.screens) {
    // Session complete, generate draft
    const draftContent = generateDraft(session);
    const filename = `draft-${Date.now()}.md`;
    const draftPath = path.join(__dirname, vaultPath, 'drafts', filename);

    fs.writeFileSync(draftPath, draftContent);

    bot.sendMessage(chatId, `✅ Draft created!

File: ${filename}

Review in Obsidian and publish when ready.`);

    sessions.delete(chatId);
  } else {
    // Next screen
    bot.sendMessage(chatId, `Screen ${session.screen} of ${template.screens}

[Prompt for screen ${session.screen}]

Reply with your answer, or /skip to skip, /cancel to abort.`);
  }
});

function generateDraft(session) {
  const date = new Date().toISOString().split('T')[0];
  
  return `---
title: "Draft - ${session.template}"
date: ${date}
published: false
template: "${session.template}"
---

# Draft

${session.responses.join('\n\n')}
`;
}

console.log('🤖 Blog Bohemio Telegram Bot started...');
