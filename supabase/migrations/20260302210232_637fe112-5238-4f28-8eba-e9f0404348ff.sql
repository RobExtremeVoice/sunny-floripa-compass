
-- Create beaches table
CREATE TABLE public.beaches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  region TEXT NOT NULL, -- Norte, Sul, Leste, Oeste, Centro
  latitude NUMERIC,
  longitude NUMERIC,
  photo_url TEXT,
  photos TEXT[] DEFAULT '{}',
  characteristics TEXT[] DEFAULT '{}', -- surf, calm, family, nature, urban
  infrastructure TEXT[] DEFAULT '{}', -- parking, restaurants, showers, lifeguard
  wave_intensity TEXT, -- calm, moderate, strong
  sand_type TEXT, -- fine_white, coarse, dark
  average_water_temp NUMERIC,
  best_season TEXT, -- summer, all_year, winter
  difficulty_access TEXT DEFAULT 'easy', -- easy, moderate, hard (trail)
  length_meters INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.beaches ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Beaches are publicly readable"
ON public.beaches FOR SELECT
USING (true);

-- Service role write
CREATE POLICY "Service role can insert beaches"
ON public.beaches FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update beaches"
ON public.beaches FOR UPDATE
USING (true) WITH CHECK (true);

-- Updated at trigger
CREATE TRIGGER update_beaches_updated_at
BEFORE UPDATE ON public.beaches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
