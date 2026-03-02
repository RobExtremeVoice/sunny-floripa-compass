-- Create enum for flight status
CREATE TYPE public.flight_status AS ENUM ('scheduled', 'boarding', 'departed', 'in_air', 'landed', 'arrived', 'delayed', 'cancelled');

-- Create airlines table
CREATE TABLE public.airlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(3) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flights table
CREATE TABLE public.flights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_number VARCHAR(10) NOT NULL,
  airline_code VARCHAR(3) NOT NULL REFERENCES public.airlines(code),
  origin VARCHAR(4) NOT NULL,
  destination VARCHAR(4) NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_time TIMESTAMP WITH TIME ZONE,
  actual_time TIMESTAMP WITH TIME ZONE,
  status flight_status NOT NULL DEFAULT 'scheduled',
  terminal VARCHAR(5),
  gate VARCHAR(10),
  is_arrival BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.airlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Airlines are publicly readable" ON public.airlines FOR SELECT USING (true);
CREATE POLICY "Flights are publicly readable" ON public.flights FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_flights_is_arrival ON public.flights(is_arrival);
CREATE INDEX idx_flights_scheduled_time ON public.flights(scheduled_time);
CREATE INDEX idx_flights_status ON public.flights(status);
CREATE INDEX idx_flights_flight_number ON public.flights(flight_number);
CREATE INDEX idx_flights_airline_code ON public.flights(airline_code);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_flights_updated_at
  BEFORE UPDATE ON public.flights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();