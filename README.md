# Portfolio - Dao Quang Truong

🚀 Fullstack Developer Portfolio built with Astro, React, and TailwindCSS

## 📖 Documentation

### Content Creation
- **[📋 CONTENT_TEMPLATES.md](./CONTENT_TEMPLATES.md)** - Template index (start here)
- **[🤖 AI_AGENT_INSTRUCTIONS.md](./AI_AGENT_INSTRUCTIONS.md)** - AI agent usage guide
- **[📔 TEMPLATES_JOURNAL.md](./TEMPLATES_JOURNAL.md)** - Journal entry templates
- **[📝 TEMPLATES_BLOG.md](./TEMPLATES_BLOG.md)** - Blog post templates
- **[📜 JOURNAL_RULES.md](./JOURNAL_RULES.md)** - Journal generation rules

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Development
bun run dev

# Build production
bun run build

# Preview build
bun run preview
```

## 📁 Project Structure

```
portfolio/
├── 📄 Documentation
│   ├── CONTENT_TEMPLATES.md      ← Template index
│   ├── AI_AGENT_INSTRUCTIONS.md  ← AI agent guide
│   ├── TEMPLATES_JOURNAL.md      ← Journal templates
│   ├── TEMPLATES_BLOG.md         ← Blog templates
│   └── JOURNAL_RULES.md          ← Generation rules
│
├── src/
│   ├── content/
│   │   ├── journal/              ← Daily logs & summaries
│   │   └── blog/                 ← Blog posts
│   ├── components/               ← React & Astro components
│   ├── pages/                    ← Routes
│   ├── layouts/                  ← Page layouts
│   ├── hooks/                    ← Custom hooks
│   ├── lib/                      ← Utilities & config
│   └── styles/                   ← Global styles
│
├── scripts/
│   └── generate-journal-summaries.ts  ← Summary generator
│
└── public/                       ← Static assets
```

## 📋 Content Commands

### Journal Generation
```bash
# Auto-generate summaries
bun run journal:summary

# Force generate specific period
bun run journal:summary:force-week
bun run journal:summary:force-month
bun run journal:summary:force-quarter
bun run journal:summary:force-year
```

### Code Quality
```bash
bun run lint        # ESLint check
bun run lint:fix    # Fix issues
bun run content:validate  # Zod frontmatter vs blog/journal/courses (also runs in `bun run verify`)
```

## 🎯 Content Templates

### Journal Types
| Type | Frequency | Template |
|------|-----------|----------|
| Daily | Every day | `TEMPLATES_JOURNAL.md` |
| Weekly | Sunday | `TEMPLATES_JOURNAL.md` |
| Monthly | 1st of month | `TEMPLATES_JOURNAL.md` |
| Quarterly | 1st of Q | `TEMPLATES_JOURNAL.md` |
| Yearly | Dec 31 | `TEMPLATES_JOURNAL.md` |

### Blog Types
| Type | Purpose | Template |
|------|---------|----------|
| Case Study | Project experience | `TEMPLATES_BLOG.md` |
| Advanced Patterns | Technical deep dive | `TEMPLATES_BLOG.md` |
| Reflection | Personal insights | `TEMPLATES_BLOG.md` |
| Tutorial | How-to guides | `TEMPLATES_BLOG.md` |

## 🛠 Tech Stack

- **Framework**: Astro 5.x
- **UI**: React 19, TailwindCSS 4.x
- **Animation**: Framer Motion
- **Diagrams**: Mermaid.js
- **AI**: Vercel AI SDK, Google Generative AI
- **Database**: Content Collections
- **Deployment**: Cloudflare Pages

## 📝 Content Guidelines

### Language
- All content in **English**
- Technical terms remain in English
- Professional yet approachable tone

### File Naming
- **Journal**: `YYYY-MM-DD-type-slug.md`
- **Blog**: `topic-descriptor.md`
- Always **kebab-case**

### Frontmatter
- Follow schema exactly as defined in templates
- All required fields must be present
- Use proper YAML syntax

## 🎨 Component Usage

### MDX Components
```mdx
<Callout type="info">
  Important information here
</Callout>

<Mermaid>
  graph TD
    A --> B
</Mermaid>
```

### React Components
```tsx
import { ExperienceClient } from '@/components/Experience.client';
import { AIAssistant } from '@/components/AIAssistant';
```

## 🚢 Deployment

### Production Build
```bash
bun run build
bun run preview  # Test locally
```

### Cloudflare
- Deploy to Cloudflare Pages
- Configure KV bindings for sessions
- Set environment variables

## 📞 For AI Agents

When generating content:

1. **Read** `AI_AGENT_INSTRUCTIONS.md` for workflows
2. **Choose** appropriate template from `TEMPLATES_JOURNAL.md` or `TEMPLATES_BLOG.md`
3. **Follow** frontmatter schema exactly
4. **Use** English throughout
5. **Check** quality checklist before finalizing

## 🔧 Configuration

### Environment Variables

**Contact form (Telegram)** — set on the **server** only (never `PUBLIC_*` for the bot token). The homepage form calls `POST /api/contact`, which reads:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

For local development, add these to `.env` so the Astro dev server can pass them to API routes.

### Site Config
Edit `src/lib/config.ts` for:
- Personal info
- SEO settings
- UI strings
- Work experience
- Projects

## 📚 Learning Resources

- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 🤝 Contributing

When adding new content:
1. Use appropriate template
2. Build project to verify
3. Check for consistency
4. Commit with descriptive message

## 📄 License

MIT License - Copyright © Dao Quang Truong

---

**Last Updated**: 2026-03-14
