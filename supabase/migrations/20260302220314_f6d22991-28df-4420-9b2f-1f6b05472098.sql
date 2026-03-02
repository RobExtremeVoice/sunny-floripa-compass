
-- Enum for entertainment categories
CREATE TYPE public.entertainment_category AS ENUM (
  'trilhas_natureza',
  'passeios_barco',
  'esportes_aventura',
  'vida_noturna',
  'cultura_historia',
  'familia_criancas'
);

-- Activities / Attractions table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category public.entertainment_category NOT NULL,
  description TEXT,
  address TEXT,
  neighborhood TEXT,
  region TEXT NOT NULL DEFAULT 'Centro',
  latitude NUMERIC,
  longitude NUMERIC,
  photo_url TEXT,
  photos TEXT[] DEFAULT '{}'::text[],
  duration_minutes INTEGER,
  price_range INTEGER DEFAULT 2,
  difficulty TEXT DEFAULT 'fácil',
  best_time TEXT,
  highlights TEXT[] DEFAULT '{}'::text[],
  phone TEXT,
  website TEXT,
  instagram TEXT,
  opening_hours TEXT,
  is_free BOOLEAN DEFAULT false,
  min_age INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activity reviews
CREATE TABLE public.activity_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Visitante',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  visit_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for activities (public read, service write)
CREATE POLICY "Activities are publicly readable" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Service role can insert activities" ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update activities" ON public.activities FOR UPDATE USING (true) WITH CHECK (true);

-- Policies for activity reviews (public read, anyone insert)
CREATE POLICY "Activity reviews are publicly readable" ON public.activity_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert activity reviews" ON public.activity_reviews FOR INSERT WITH CHECK (true);
