CREATE POLICY "Service role can insert flights"
ON public.flights
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can delete flights"
ON public.flights
FOR DELETE
TO service_role
USING (true);

CREATE POLICY "Service role can insert airlines"
ON public.airlines
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update airlines"
ON public.airlines
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);