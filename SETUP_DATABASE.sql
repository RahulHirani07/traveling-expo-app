-- ============================================
-- FINAL SCHEMA - Run this once in Supabase SQL Editor
-- ============================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS posts CASCADE;

-- Create posts table with TEXT user_id (for demo without auth)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow all operations for demo (no auth required)
CREATE POLICY "Allow all operations" ON posts 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Verify setup
SELECT 
  'Posts table created' as status,
  (SELECT COUNT(*) FROM posts) as post_count,
  (SELECT data_type FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'user_id') as user_id_type;
