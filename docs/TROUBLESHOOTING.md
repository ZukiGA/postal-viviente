# Troubleshooting

## Telegram Bot

**Bot not responding**
- Check bot is running: `cd telegram-bot && npm start`
- Verify `.env` has correct BOT_TOKEN
- Check authorization: USER_ID must match yours

**"Unauthorized" message**
- Get your User ID from @userinfobot
- Update AUTHORIZED_USER_ID in `.env`
- Restart bot

---

## Obsidian

**Vault not syncing (mobile ↔ desktop)**
- Check iCloud Drive enabled
- Wait 30 sec - 2 min for sync
- Force sync: Close Obsidian, reopen

**Drafts not showing**
- Check folder: `vault/drafts/`
- Refresh Obsidian file explorer

---

## GitHub Actions

**Build failing**
- Check workflow logs in GitHub Actions tab
- Common issues:
  - EXIF strip error → GPS data found
  - Image optimize error → missing image file
  - Quartz build error → invalid frontmatter

**Site not deploying**
- Verify GitHub Pages is enabled (Settings → Pages)
- Check deploy branch is `gh-pages`
- Wait 2-5 minutes after push

---

## Quartz

**Build errors**
- Missing index.md → Create `vault/published/index.md`
- Invalid frontmatter → Check YAML syntax
- Missing images → Verify gallery paths

**Slow builds**
- Normal: <30 sec for <100 posts
- Slow (>1 min): Check for large images (>5MB)

---

## iOS Shortcuts

**Album detection not working**
- Shortcuts has 30-second timeout
- Try manual trigger: `/create` in Telegram
- Fallback: Telegram photo upload

---

## General

**Git push rejected (workflow scope)**
- Use GitHub UI to add workflow file manually
- Or use `gh` CLI: `gh repo sync --force`

**Images not optimizing**
- Check `vault/images/` folder exists
- Verify images are JPG/PNG
- Run manually: `node scripts/optimize-images.js`

**EXIF strip failure**
- GPS data detected → Privacy leak prevented
- Fix: Remove GPS in Photos app before adding to album
- Or: Ignore and publish (if location is public place)
