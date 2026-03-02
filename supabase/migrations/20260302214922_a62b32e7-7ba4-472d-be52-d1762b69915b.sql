
-- Create restaurant category enum
CREATE TYPE public.restaurant_category AS ENUM ('frutos_do_mar', 'acoriana', 'internacional', 'cafes_doces');

-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category restaurant_category NOT NULL,
  address TEXT,
  neighborhood TEXT,
  region TEXT NOT NULL DEFAULT 'Centro',
  phone TEXT,
  website TEXT,
  instagram TEXT,
  price_range INTEGER DEFAULT 2 CHECK (price_range BETWEEN 1 AND 4),
  latitude NUMERIC,
  longitude NUMERIC,
  photo_url TEXT,
  photos TEXT[] DEFAULT '{}'::text[],
  specialties TEXT[] DEFAULT '{}'::text[],
  opening_hours TEXT,
  has_delivery BOOLEAN DEFAULT false,
  has_reservation BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create restaurant reviews table
CREATE TABLE public.restaurant_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Visitante',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  visit_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for restaurants (public read, service role write)
CREATE POLICY "Restaurants are publicly readable" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Service role can insert restaurants" ON public.restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update restaurants" ON public.restaurants FOR UPDATE USING (true) WITH CHECK (true);

-- RLS policies for restaurant reviews (public read, anyone can insert)
CREATE POLICY "Restaurant reviews are publicly readable" ON public.restaurant_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert restaurant reviews" ON public.restaurant_reviews FOR INSERT WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
