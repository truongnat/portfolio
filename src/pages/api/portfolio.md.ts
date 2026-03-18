import type { APIRoute } from 'astro';
import { personalInfo, workExperience, projectsConfig, skillsConfig, certificatesData, testimonialsData, awards, navLinks, seo, uiStrings, liveWork, projectCategories } from '@/lib/config';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const blogPosts = await getCollection('blog');
  const journalEntries = await getCollection('journal');

  const markdownContent = generatePortfolioMarkdown(blogPosts, journalEntries);

  return new Response(markdownContent, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="portfolio.md"',
    },
  });
};

function generatePortfolioMarkdown(blogPosts: any[], journalEntries: any[]): string {
  const generatedDate = new Date().toISOString().split('T')[0];

  return `# Portfolio - ${personalInfo.name}

> 📄 Complete Portfolio Information for AI Agents
> Generated: ${generatedDate}

---

## Table of Contents

1. [Personal Information](#personal-information)
2. [Tech Stack & Skills](#tech-stack--skills)
3. [Work Experience](#work-experience)
4. [Projects](#projects)
5. [Design System](#design-system)
6. [Blog Posts](#blog-posts)
7. [Journal Entries](#journal-entries)
8. [Site Navigation](#site-navigation)
9. [Project Structure](#project-structure)

---

## Personal Information

### Basic Info

- **Name**: ${personalInfo.name}
- **Role**: ${personalInfo.role}
- **Location**: ${personalInfo.location}
- **Email**: ${personalInfo.email}
- **Phone**: ${personalInfo.phone}
- **Website**: ${personalInfo.website}

### Bio

${personalInfo.bio}

### Typing Phrases

${personalInfo.typingPhrases.map(phrase => `- ${phrase}`).join('\n')}

### Stats

${personalInfo.stats.map(stat => `- **${stat.label}**: ${stat.value}`).join('\n')}

### Social Links

${personalInfo.socials.map(social => `- [${social.platform}](${social.url})`).join('\n')}

### Current Work

- **Company**: ${liveWork.company}
- **Location**: ${liveWork.location}
- **URL**: ${liveWork.url}

---

## Tech Stack & Skills

${skillsConfig.cards.map((skillCard, index) => `### ${index + 1}. ${skillCard.title}

${skillCard.level ? `**Level**: ${skillCard.level}\n` : ''}
${skillCard.subSections.map(sub => `
#### ${sub.label}

**Skills**: ${sub.skills.join(', ')}
${sub.highlight ? `\n> ${sub.highlight}` : ''}
`).join('\n')}
`).join('\n---\n\n')}

### All Technologies Summary

${extractAllTechnologies(skillsConfig, projectsConfig)}

---

## Work Experience

${workExperience.map((exp, index) => `### ${index + 1}. ${exp.role} @ ${exp.company}

**Period**: ${exp.period}
${exp.description ? `\n${exp.description}` : ''}

**Achievements**:
${exp.achievements.map(achievement => `- ${achievement}`).join('\n')}
`).join('\n---\n\n')}

---

## Projects

**Total Projects**: ${projectsConfig.length}

**Categories**: ${projectCategories.join(', ')}

${projectsConfig.map((project, index) => `### ${index + 1}. ${project.title}

**Role**: ${project.role}
**Period**: ${project.period}
**Categories**: ${project.categories.join(', ')}
${project.link ? `\n**Live**: [${project.link}](${project.link})` : ''}

**Description**:
${project.description}

**Tech Stack**: ${project.techStack.join(', ')}

**Achievements**:
${project.achievements.map(achievement => `- ${achievement}`).join('\n')}
`).join('\n---\n\n')}

---

## Design System

### Color Palette (HSL)

\`\`\`css
:root {
  --background: 240 10% 3.9%      /* Dark background */
  --foreground: 0 0% 98%          /* Light text */
  
  --card: 240 10% 6%              /* Card background */
  --card-foreground: 0 0% 98%
  
  --primary: 0 0% 98%             /* Primary text */
  --primary-foreground: 240 5.9% 10%
  
  --secondary: 240 3.7% 15.9%     /* Secondary background */
  --secondary-foreground: 0 0% 98%
  
  --muted: 240 3.7% 15.9%         /* Muted background */
  --muted-foreground: 240 5% 64.9% /* Muted text */
  
  --accent: 240 3.7% 15.9%        /* Accent background */
  --accent-foreground: 0 0% 98%
  
  --destructive: 0 62.8% 30.6%    /* Error/destructive */
  --destructive-foreground: 0 0% 98%
  
  --border: 240 3.7% 15.9%        /* Border color */
  --input: 240 3.7% 15.9%         /* Input border */
  --ring: 240 4.9% 83.9%          /* Focus ring */
  
  --radius: 0.5rem                /* Border radius */
}
\`\`\`

### Typography

- **Primary Font**: Inter, system-ui, sans-serif
- **Monospace Font**: JetBrains Mono, monospace
- **Headings**: JetBrains Mono with -0.02em letter-spacing
- **Body**: Inter with relaxed leading

### UI Components

- **Border Radius**: 
  - lg: 0.5rem
  - md: calc(var(--radius) - 2px)
  - sm: calc(var(--radius) - 4px)

### Design Principles

1. **High Contrast**: Dark zinc theme with 98% white text on ~4% dark background
2. **Monospace Accents**: All headings use JetBrains Mono for technical aesthetic
3. **Subtle Gradients**: Background features radial gradients for depth
4. **Smooth Transitions**: 200ms duration for hover states
5. **Developer-First**: Code blocks styled with JetBrains Mono and dark backgrounds

### Component Styling

- **Cards**: Border transitions on hover, translateY(-2px) effect
- **Buttons**: Cursor changes based on state (pointer/not-allowed)
- **Links**: Underline with transition on decoration
- **Scroll**: Custom scrollbar with muted colors
- **Code**: Pre blocks with black/50 background and border

---

## Blog Posts

**Total Posts**: ${blogPosts.length}

${blogPosts.map((post, index) => `### ${index + 1}. ${post.data.title}

**Slug**: \`${post.id}\`
**Date**: ${post.data.date.toISOString().split('T')[0]}
**Description**: ${post.data.description}
**Tags**: ${post.data.tags?.join(', ') || 'None'}
**Published**: ${post.data.published ? 'Yes' : 'No'}
`).join('\n---\n\n')}

---

## Journal Entries

**Total Entries**: ${journalEntries.length}

${journalEntries.slice(0, 50).map((entry, index) => `### ${index + 1}. ${entry.data.title}

**Slug**: \`${entry.id}\`
**Date**: ${entry.data.date.toISOString().split('T')[0]}
**Type**: ${entry.data.type}
**Tags**: ${entry.data.tags?.join(', ') || 'None'}
${entry.data.summary ? `\n**Summary**: ${entry.data.summary}` : ''}
`).join('\n---\n\n')}

${journalEntries.length > 50 ? `\n> ... and ${journalEntries.length - 50} more journal entries\n` : ''}

---

## Site Navigation

### Main Navigation

${navLinks.map(link => `- [${link.label}](${link.href})`).join('\n')}

### UI Strings

\`\`\`json
{
  "logo": "${uiStrings.common.logo}",
  "hero": {
    "cta": {
      "projects": "${uiStrings.hero.cta.projects}",
      "cv": "${uiStrings.hero.cta.cv}",
      "contact": "${uiStrings.hero.cta.contact}"
    }
  },
  "contact": {
    "title": "${uiStrings.contact.title}",
    "subtitle": "${uiStrings.contact.subtitle}"
  }
}
\`\`\`

---

## Project Structure

\`\`\`
portfolio/
├── Documentation
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
│   │   ├── mdx/                  ← MDX components
│   │   ├── ui/                   ← UI components
│   │   └── seo/                  ← SEO components
│   ├── pages/                    ← Routes
│   │   ├── api/                  ← API endpoints
│   │   ├── blog/                 ← Blog pages
│   │   └── journal/              ← Journal pages
│   ├── layouts/                  ← Page layouts
│   ├── hooks/                    ← Custom hooks
│   ├── lib/                      ← Utilities & config
│   │   └── config.ts             ← Main configuration
│   └── styles/                   ← Global styles
│       └── global.css            ← Design system CSS
│
├── scripts/
│   └── generate-journal-summaries.ts  ← Summary generator
│
└── public/                       ← Static assets
\`\`\`

---

## Technical Stack

### Framework & Build

- **Framework**: Astro 5.x
- **UI Library**: React 19
- **Styling**: TailwindCSS 4.x
- **Animation**: Framer Motion
- **Diagrams**: Mermaid.js

### AI & ML

- **AI SDK**: Vercel AI SDK
- **LLM Providers**: Google Generative AI, OpenAI, Anthropic
- **Agent Frameworks**: LangChain, LangGraph, CrewAI

### Data & Visualization

- **Charts**: D3.js, ChartJS, Recharts
- **Graphs**: React Force Graph
- **Maps**: Leaflet.js

### Backend & DevOps

- **Runtime**: Node.js (NestJS/Express)
- **Database**: PostgreSQL
- **CI/CD**: GitHub Actions, GitLab CI/CD, Jenkins
- **Container**: Docker
- **Cloud**: AWS, Cloudflare Pages

### Mobile & Desktop

- **Mobile**: React Native, Flutter
- **Desktop**: Electron.js

### State Management

- **Global**: TanStack Store, Nanostores
- **Server State**: TanStack Query
- **Forms**: React Hook Form

### UI Components

- **Component Library**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React, Simple Icons
- **Command Palette**: cmdk

---

## SEO Configuration

\`\`\`json
{
  "title": "${seo.title}",
  "description": "${seo.description}",
  "url": "${seo.url}",
  "keywords": [${seo.keywords.map(k => `"${k}"`).join(', ')}]
}
\`\`\`

---

## Awards & Certificates

### Awards

${awards.map(award => `- **${award.title}** - ${award.organization} (${award.date})`).join('\n')}

### Certificates

${certificatesData.map(cert => `
#### ${cert.title}
- **Issuer**: ${cert.issuer}
- **Year**: ${cert.year}
- **Description**: ${cert.description}
${cert.credentialId ? `- **Credential ID**: ${cert.credentialId}` : ''}
${cert.credentialUrl ? `- **URL**: ${cert.credentialUrl}` : ''}
`).join('\n')}

---

## Testimonials

${testimonialsData.map((testimonial, index) => `### ${index + 1}. ${testimonial.author}

> "${testimonial.quote}"

**Role**: ${testimonial.role}
`).join('\n---\n\n')}

---

## Content Guidelines

### Language
- All content in **English**
- Technical terms remain in English
- Professional yet approachable tone

### File Naming
- **Journal**: \`YYYY-MM-DD-type-slug.md\`
- **Blog**: \`topic-descriptor.md\`
- Always **kebab-case**

### Journal Types
| Type | Frequency |
|------|-----------|
| Daily | Every day |
| Weekly | Sunday |
| Monthly | 1st of month |
| Quarterly | 1st of Q |
| Yearly | Dec 31 |

### Blog Types
| Type | Purpose |
|------|---------|
| Case Study | Project experience |
| Advanced Patterns | Technical deep dive |
| Reflection | Personal insights |
| Tutorial | How-to guides |

---

## For AI Agents

This document provides complete context about the portfolio. Use this information to:

1. **Understand the developer's expertise** - Review tech stack, projects, and experience
2. **Generate consistent content** - Follow the established tone, style, and formatting
3. **Make informed suggestions** - Based on existing patterns and best practices
4. **Maintain design consistency** - Reference the design system for any UI changes

### Key Focus Areas

- **Agentic AI**: Multi-agent orchestration, SDLC automation
- **Cross-Platform**: React Native, Electron, Vue/React ecosystems
- **Leadership**: Team mentoring, technical interviewing, system architecture
- **Performance**: API optimization, high-scale systems

---

*This file is auto-generated from the portfolio configuration. For the latest updates, refer to the source files.*

**Portfolio Version**: ${import.meta.env.APP_VERSION || '0.0.1'}
**Generated**: ${new Date().toISOString()}
`.trim();
}

function extractAllTechnologies(skillsConfig: any, projectsConfig: any[]): string {
  const allTechs = new Set<string>();
  
  // From skills
  skillsConfig.cards.forEach((card: any) => {
    card.subSections.forEach((sub: any) => {
      sub.skills.forEach((skill: string) => allTechs.add(skill));
    });
  });
  
  // From projects
  projectsConfig.forEach((project) => {
    project.techStack.forEach((tech: string) => allTechs.add(tech));
  });
  
  const sortedTechs = Array.from(allTechs).sort();
  
  // Group by category
  const aiTechs = sortedTechs.filter(t => /ai|llm|langchain|langgraph|openai|anthropic|gemini|agent|neural|machine learning/i.test(t));
  const frontendTechs = sortedTechs.filter(t => /react|vue|next|nuxt|typescript|javascript|tailwind|css|html|d3|chart/i.test(t));
  const backendTechs = sortedTechs.filter(t => /node|nest|express|python|postgresql|database|api|server/i.test(t));
  const devopsTechs = sortedTechs.filter(t => /docker|kubernetes|ci|cd|jenkins|git|aws|cloud|linux|nginx/i.test(t));
  const mobileTechs = sortedTechs.filter(t => /react native|flutter|mobile|ios|android/i.test(t));
  const otherTechs = sortedTechs.filter(t => 
    !aiTechs.includes(t) && 
    !frontendTechs.includes(t) && 
    !backendTechs.includes(t) && 
    !devopsTechs.includes(t) && 
    !mobileTechs.includes(t)
  );
  
  let output = '#### AI & Agentic\n';
  output += aiTechs.length ? aiTechs.map(t => `- ${t}`).join('\n') + '\n' : '- None listed\n';
  
  output += '\n#### Frontend\n';
  output += frontendTechs.length ? frontendTechs.map(t => `- ${t}`).join('\n') + '\n' : '- None listed\n';
  
  output += '\n#### Backend\n';
  output += backendTechs.length ? backendTechs.map(t => `- ${t}`).join('\n') + '\n' : '- None listed\n';
  
  output += '\n#### DevOps & Infrastructure\n';
  output += devopsTechs.length ? devopsTechs.map(t => `- ${t}`).join('\n') + '\n' : '- None listed\n';
  
  output += '\n#### Mobile & Desktop\n';
  output += mobileTechs.length ? mobileTechs.map(t => `- ${t}`).join('\n') + '\n' : '- None listed\n';
  
  if (otherTechs.length) {
    output += '\n#### Other\n';
    output += otherTechs.map(t => `- ${t}`).join('\n') + '\n';
  }
  
  return output;
}
