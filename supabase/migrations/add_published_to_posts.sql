-- Add published column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Update existing posts to be published if they have a published_at date
UPDATE posts SET published = true WHERE published_at IS NOT NULL;
