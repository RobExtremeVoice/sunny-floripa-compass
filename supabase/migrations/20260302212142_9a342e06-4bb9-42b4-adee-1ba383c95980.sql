
-- Create beach_reviews table
CREATE TABLE public.beach_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  beach_id UUID NOT NULL REFERENCES public.beaches(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Visitante',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  visit_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.beach_reviews ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Beach reviews are publicly readable"
ON public.beach_reviews FOR SELECT
USING (true);

-- Anyone can insert (no auth required for now)
CREATE POLICY "Anyone can insert beach reviews"
ON public.beach_reviews FOR INSERT
WITH CHECK (true);
