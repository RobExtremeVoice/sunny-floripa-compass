
-- Table to cache accommodation search results
CREATE TABLE public.accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text NOT NULL,
  name text NOT NULL,
  description text,
  hotel_type text,
  star_rating numeric(2,1),
  review_score numeric(3,1),
  review_count integer DEFAULT 0,
  price_per_night numeric(10,2),
  currency text DEFAULT 'BRL',
  address text,
  city text DEFAULT 'Florianópolis',
  latitude numeric(10,7),
  longitude numeric(10,7),
  photo_url text,
  photos text[] DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  checkin_date date,
  checkout_date date,
  booking_url text,
  data_source text DEFAULT 'booking.com',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(external_id, checkin_date, checkout_date)
);

-- Enable RLS
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Accommodations are publicly readable"
ON public.accommodations FOR SELECT
USING (true);

-- Service role can manage
CREATE POLICY "Service role can insert accommodations"
ON public.accommodations FOR INSERT TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update accommodations"
ON public.accommodations FOR UPDATE TO service_role
USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete accommodations"
ON public.accommodations FOR DELETE TO service_role
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_accommodations_updated_at
BEFORE UPDATE ON public.accommodations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
