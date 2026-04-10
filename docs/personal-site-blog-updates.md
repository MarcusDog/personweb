# Personal Site Blog Updates

## Current Workflow

Blog content now lives in:

- `ai-learning-studio/src/content/journal/*.md`

The site now also provides:

- category filters plus text search on the Journal index
- an article outline generated from Markdown headings
- a copy-link action on each article page

Each article is one Markdown file with:

1. frontmatter for metadata
2. a `<!--lang:zh-->` block
3. a `<!--lang:en-->` block

Example:

```md
---
slug: my-new-post
date: 2026-03-30
categoryZh: 笔记
categoryEn: Note
titleZh: 我的新文章
titleEn: My New Post
standfirstZh: 一句话摘要。
standfirstEn: One-line summary.
---
<!--lang:zh-->
## 标题

中文正文

<!--lang:en-->
## Heading

English body
```

## How To Publish A New Post

1. Add a new Markdown file under `ai-learning-studio/src/content/journal/`
2. Keep the filename sortable by date, for example `2026-03-30-my-new-post.md`
3. Run:
   - `npm test`
   - `npm run build`
4. Deploy the site

## What Counts As "Real-Time"

### Option 1: Fast static publishing

This is the current setup. You add a Markdown file, push to Git, and your host redeploys automatically.

This is not truly real-time, but for a personal site it is usually the simplest and most reliable workflow.

### Option 2: True real-time publishing

If you want posts to appear instantly without redeploying, the site needs a runtime content source, for example:

- Supabase
- Notion API
- Sanity
- Contentful
- a custom admin backend

In that setup, the website fetches blog data from the database or CMS at runtime.

## Recommended Path

Use the current Markdown workflow first.

When your writing frequency increases and you want browser-based publishing, add a small CMS or Supabase-backed editor in the next phase.
