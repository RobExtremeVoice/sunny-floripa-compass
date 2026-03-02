
-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'dicas',
  tags TEXT[] DEFAULT '{}'::text[],
  author_name TEXT NOT NULL DEFAULT 'Equipe VisiteFloripa',
  author_avatar TEXT,
  read_time_minutes INTEGER DEFAULT 5,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read for published posts
CREATE POLICY "Published blog posts are publicly readable" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Service role can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update blog posts" ON public.blog_posts FOR UPDATE USING (true) WITH CHECK (true);
