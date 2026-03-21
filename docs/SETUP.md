# Blog Bohemio Setup Guide

## Prerequisites

- Node.js 18+
- Obsidian (desktop + iOS app)
- Telegram account
- GitHub account
- iCloud Photos (iOS)

---

## 1. Install Dependencies

```bash
# Root dependencies
npm install

# Quartz
cd quartz && npm install

# Telegram bot
cd telegram-bot && npm install
```

---

## 2. Configure Telegram Bot

### Create Bot

1. Open Telegram, search for `@BotFather`
2. Send `/newbot`
3. Follow prompts to get your bot token
4. Send `/mybots` → select your bot → Bot Settings → Turn off Group Privacy

### Get Your User ID

1. Search for `@userinfobot` in Telegram
2. Send `/start`
3. Copy your User ID

### Configure

```bash
cd telegram-bot
cp .env.example .env
# Edit .env with your BOT_TOKEN and AUTHORIZED_USER_ID
```

### Start Bot

```bash
npm start
```

---

## 3. Obsidian Vault Setup

### Desktop

1. Open Obsidian
2. Open folder as vault: `/path/to/blog-bohemio/vault`
3. Enable iCloud sync (Settings → Sync → iCloud Drive)

### iOS

1. Install Obsidian iOS app
2. Open vault from iCloud Drive

---

## 4. Deploy to GitHub Pages

### One-Time Setup

1. Go to GitHub repo settings
2. Pages → Source → GitHub Actions
3. Push to `main` branch triggers auto-deploy

### Manual Deploy

```bash
cd quartz
npx quartz build
# Output in public/
```

---

## 5. iOS Shortcuts (Optional)

Create iOS Shortcut for album detection:

1. New Shortcut → Repeat every 5 min
2. Get Photos from Album "Blog Albums"
3. If new photos → Send notification
4. Tap notification → Open Telegram bot

---

## Workflow

### Creating a Post (Telegram)

1. Open Telegram bot
2. Send `/create cafe` (or food/city/travel/free)
3. Answer prompts
4. Draft saved to `vault/drafts/`

### Publishing

1. Open Obsidian
2. Review draft
3. Change `published: false` → `published: true`
4. Move to `vault/published/YYYY-MM/`
5. Git auto-commits and deploys

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
