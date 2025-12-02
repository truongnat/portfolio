# Supabase Database Setup

This directory contains the database schema and seed data for the portfolio application.

## Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `portfolio` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Wait for the project to be created (takes ~2 minutes)

### 2. Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local` in the project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the values in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Execute the Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `schema.sql` and paste it into the editor
4. Click "Run" to execute the schema
5. Verify that the tables were created by checking the **Table Editor**

### 5. Add Sample Data (Optional)

1. In the SQL Editor, create a new query
2. Copy the contents of `seed.sql` and paste it into the editor
3. Click "Run" to insert sample data
4. Verify the data in the **Table Editor**

## Database Schema

### Tables

#### `posts`
Blog posts with markdown content.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Post title |
| slug | TEXT | URL-friendly slug (unique) |
| content | TEXT | Markdown content |
| cover_image | TEXT | Cover image URL |
| published_at | TIMESTAMPTZ | Publication date |
| reading_time | INTEGER | Estimated reading time in minutes |
| tags | TEXT[] | Array of tags |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### `projects`
Portfolio projects showcase.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Project title |
| description | TEXT | Project description |
| screenshot | TEXT | Screenshot URL |
| tech_stack | TEXT[] | Array of technologies used |
| live_url | TEXT | Live demo URL (optional) |
| github_url | TEXT | GitHub repository URL (optional) |
| category | TEXT | Project category |
| featured | BOOLEAN | Whether project is featured |
| display_order | INTEGER | Display order (optional) |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

#### `github_projects`
Synced GitHub repositories.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| repo_id | INTEGER | GitHub repository ID (unique) |
| repo_name | TEXT | Repository name |
| description | TEXT | Repository description |
| language | TEXT | Primary language |
| language_color | TEXT | Language color hex code |
| stars | INTEGER | Star count |
| forks | INTEGER | Fork count |
| url | TEXT | Repository URL |
| synced_at | TIMESTAMPTZ | Last sync timestamp |
| created_at | TIMESTAMPTZ | Creation timestamp |

## Row Level Security (RLS)

All tables have RLS enabled with public read-only access:

- **posts**: Only published posts (where `published_at <= NOW()`) are visible
- **projects**: All projects are publicly readable
- **github_projects**: All GitHub projects are publicly readable

To modify data, you'll need to:
1. Use the Supabase dashboard
2. Create authenticated API routes
3. Use service role key (keep this secret!)

## Indexes

The schema includes optimized indexes for common queries:

- Posts: slug, published_at, tags (GIN index)
- Projects: category, featured, display_order
- GitHub Projects: stars, synced_at

## Triggers

Automatic `updated_at` timestamp updates are handled by triggers on:
- `posts` table
- `projects` table

## TypeScript Types

TypeScript types are automatically generated in `types/database.ts`. These types provide:
- Full type safety for database queries
- IntelliSense support in your IDE
- Compile-time error checking

## Troubleshooting

### Connection Issues

If you can't connect to Supabase:
1. Verify your environment variables are correct
2. Check that your Supabase project is active
3. Ensure you're using the correct URL and anon key

### RLS Errors

If you get "permission denied" errors:
1. Verify RLS policies are enabled
2. Check that the policies match your query conditions
3. For write operations, you may need to disable RLS or use service role key

### Schema Updates

To update the schema:
1. Make changes to `schema.sql`
2. Run the updated SQL in the Supabase SQL Editor
3. Update TypeScript types in `types/database.ts` if needed

## Next Steps

After setting up the database:
1. Test the connection by running the development server
2. Verify data fetching works in your components
3. Add your own content through the Supabase dashboard
4. Set up GitHub Actions for automated repo syncing (optional)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
