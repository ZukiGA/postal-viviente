# Publishing Workflow

## Quick Post (Album → Published)

**Time:** ~5 minutes

1. **Capture** — Create iCloud album with photos
2. **Draft** — Telegram bot `/create` → answer prompts
3. **Review** — Open Obsidian, check draft
4. **Publish** — Change `published: true`, move to `published/`
5. **Live** — Auto-deploy via GitHub Actions (~2 min)

---

## Batch Publishing (Sunday Workflow)

**Time:** ~30 minutes for 4 posts

1. **List drafts** — Telegram `/drafts`
2. **Create multiple** — `/create` × 4 (20 min)
3. **Batch review** — Obsidian desktop (10 min)
4. **Publish selected** — Move 3/4 to `published/`
5. **Deploy** — Auto-commit + build

---

## Templates

### ☕ Cafe Visit (8 screens)
- Title & details
- Arrival
- The coffee
- Atmosphere
- Details noticed
- Reflection
- Rating
- Preview

### 🍜 Food Experience (6 screens)
- First impressions
- The taste
- Context
- What stood out
- Final thoughts
- Rating

### 🌆 City Exploration (6 screens)
- Start
- Discoveries
- Best moment
- Reflections
- New perspective
- Preview

### ✈️ Travel Story (7 screens)
- Title
- Journey
- Arrival
- Highlights
- People
- Unexpected
- Takeaway

### 📝 Free Form (4 screens)
- Title
- Opening
- Story
- Closing

---

## Frontmatter Schema

```yaml
---
title: "Post Title"
slug: "auto-generated"
date: YYYY-MM-DD
published: false  # Change to true to publish
template: "template-name"
tags:
  - tag1
  - tag2
description: "SEO description"
location:
  name: "Place Name"
  neighborhood: "Neighborhood"
  city: "City"
rating: 5  # Optional 1-5
gallery:
  - image1.jpg
  - image2.jpg
---
```

---

## Tips

- **Timing:** Write immediately (fresh emotion) or later (mature reflection)
- **Photos:** 6-12 optimal (captures experience without overwhelming)
- **Skip prompts:** Use `/skip` if you don't have an answer
- **Free Form:** No rules, just write
