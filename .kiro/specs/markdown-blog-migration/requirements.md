# Requirements Document

## Introduction

This specification defines the migration of the blog system from a Supabase database backend to a local markdown file-based system. The blog will use static markdown files stored in the project directory, eliminating the need for database connections and enabling simpler content management through the file system.

## Glossary

- **Blog_System**: The complete blog functionality including content storage, retrieval, and rendering
- **Markdown_File**: A `.md` or `.mdx` file containing blog post content with frontmatter metadata
- **Frontmatter**: YAML metadata at the beginning of markdown files containing post information (title, date, slug, etc.)
- **Content_Directory**: The local directory where markdown blog posts are stored
- **Static_Generation**: Next.js static site generation that builds pages at build time
- **File_System_API**: Node.js file system operations for reading markdown files

## Requirements

### Requirement 1: Local Markdown Storage

**User Story:** As a content creator, I want to write blog posts as markdown files in the project directory, so that I can manage content through version control and simple file editing.

#### Acceptance Criteria

1. THE Blog_System SHALL store all blog posts as markdown files in a designated Content_Directory
2. WHEN a markdown file is created in the Content_Directory, THE Blog_System SHALL recognize it as a valid blog post
3. THE Blog_System SHALL support both `.md` and `.mdx` file formats
4. WHEN the project is built, THE Blog_System SHALL read all markdown files from the Content_Directory

### Requirement 2: Frontmatter Metadata

**User Story:** As a content creator, I want to define post metadata in frontmatter, so that I can control how posts are displayed and organized.

#### Acceptance Criteria

1. WHEN a markdown file contains frontmatter, THE Blog_System SHALL parse the YAML metadata
2. THE Blog_System SHALL extract title, date, slug, description, and published status from frontmatter
3. IF a markdown file lacks required frontmatter fields, THEN THE Blog_System SHALL handle it gracefully with defaults or skip the file
4. THE Blog_System SHALL support optional frontmatter fields such as tags, author, and cover image
5. WHEN frontmatter contains a published field set to false, THE Blog_System SHALL exclude the post from public listings

### Requirement 3: Blog Post Listing

**User Story:** As a visitor, I want to see a list of published blog posts, so that I can browse available content.

#### Acceptance Criteria

1. WHEN a user visits the blog listing page, THE Blog_System SHALL display all published posts
2. THE Blog_System SHALL sort posts by date in descending order (newest first)
3. WHEN displaying post listings, THE Blog_System SHALL show title, description, date, and excerpt
4. THE Blog_System SHALL exclude posts marked as unpublished in frontmatter
5. WHEN no published posts exist, THE Blog_System SHALL display an appropriate empty state message

### Requirement 4: Individual Post Rendering

**User Story:** As a visitor, I want to read individual blog posts with properly formatted content, so that I can consume the information effectively.

#### Acceptance Criteria

1. WHEN a user navigates to a post URL, THE Blog_System SHALL render the corresponding markdown content
2. THE Blog_System SHALL convert markdown syntax to HTML with proper styling
3. THE Blog_System SHALL support GitHub Flavored Markdown features (tables, code blocks, etc.)
4. WHEN a post contains code blocks, THE Blog_System SHALL apply syntax highlighting
5. IF a requested post slug does not exist, THEN THE Blog_System SHALL return a 404 error

### Requirement 5: Static Site Generation

**User Story:** As a developer, I want blog pages to be statically generated at build time, so that the site loads quickly and doesn't require a database.

#### Acceptance Criteria

1. WHEN the project is built, THE Blog_System SHALL generate static HTML for all published posts
2. THE Blog_System SHALL use Next.js `generateStaticParams` to create dynamic routes at build time
3. THE Blog_System SHALL read markdown files during the build process using File_System_API
4. WHEN content changes, THE Blog_System SHALL regenerate affected pages on the next build
5. THE Blog_System SHALL not make runtime database queries for blog content

### Requirement 6: URL Structure and Routing

**User Story:** As a visitor, I want clean, readable URLs for blog posts, so that I can easily share and bookmark content.

#### Acceptance Criteria

1. THE Blog_System SHALL use the slug from frontmatter to generate post URLs
2. WHEN a post has slug "my-first-post", THE Blog_System SHALL make it accessible at `/blog/my-first-post`
3. THE Blog_System SHALL ensure all slugs are URL-safe (lowercase, hyphenated)
4. IF two posts have the same slug, THEN THE Blog_System SHALL handle the conflict (use filename or show error)
5. THE Blog_System SHALL maintain the `/blog` route for the listing page

### Requirement 7: Admin Interface Removal

**User Story:** As a developer, I want to remove the Supabase-dependent admin interface, so that the codebase is simplified and doesn't require database authentication.

#### Acceptance Criteria

1. THE Blog_System SHALL remove all Supabase client initialization code
2. THE Blog_System SHALL remove the admin login page and authentication logic
3. THE Blog_System SHALL remove the admin blog editor interface
4. THE Blog_System SHALL remove database query functions for blog posts
5. WHEN Supabase dependencies are removed, THE Blog_System SHALL still function correctly for blog display

### Requirement 8: Content Migration

**User Story:** As a developer, I want to migrate existing blog posts from Supabase to markdown files, so that no content is lost during the transition.

#### Acceptance Criteria

1. THE Blog_System SHALL provide a way to export existing posts from Supabase to markdown format
2. WHEN exporting posts, THE Blog_System SHALL preserve all metadata (title, date, content, published status)
3. THE Blog_System SHALL generate appropriate frontmatter for each exported post
4. THE Blog_System SHALL create markdown files with URL-safe filenames based on slugs
5. WHEN migration is complete, THE Blog_System SHALL have all existing posts available as markdown files
