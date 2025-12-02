# Next.js 16 Portfolio

A modern, production-ready portfolio website built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

## Features

- ⚡ Next.js 16 with App Router
- 🎨 Tailwind CSS v3.4+ with shadcn/ui components
- 🌙 Dark mode support with next-themes
- 📝 Blog system with Markdown/MDX support
- 🎭 Smooth animations with Framer Motion
- 📊 Data fetching with TanStack Query v5
- 🗄️ Supabase for database and storage
- 🎯 TypeScript strict mode
- 🚀 Optimized for 100/100 Lighthouse scores

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Set up Supabase database:

Follow the detailed instructions in [supabase/README.md](./supabase/README.md) to:
- Create a Supabase project
- Execute the schema
- Add sample data (optional)

4. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update the following values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Test your Supabase connection (optional):

```bash
bun run scripts/test-supabase-connection.ts
```

6. Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## Project Structure

```
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions and configurations
│   └── supabase.ts  # Supabase client and query helpers
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
│   └── database.ts  # Database types from Supabase schema
├── supabase/        # Database schema and seed data
│   ├── schema.sql   # Database schema
│   ├── seed.sql     # Sample data
│   └── README.md    # Database setup guide
├── scripts/         # Utility scripts
└── public/          # Static assets
```

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** Supabase
- **Data Fetching:** TanStack Query v5
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Package Manager:** Bun

## License

MIT
