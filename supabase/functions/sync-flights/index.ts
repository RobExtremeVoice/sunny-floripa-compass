import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("AVIATIONSTACK_API_KEY");
    if (!apiKey) throw new Error("AVIATIONSTACK_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch arrivals and departures for FLN
    const [arrivalsRes, departuresRes] = await Promise.all([
      fetch(
        `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&arr_iata=FLN&limit=50`
      ),
      fetch(
        `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=FLN&limit=50`
      ),
    ]);

    const arrivalsData = await arrivalsRes.json();
    const departuresData = await departuresRes.json();

    if (arrivalsData.error || departuresData.error) {
      throw new Error(
        arrivalsData.error?.message ||
          departuresData.error?.message ||
          "API error"
      );
    }

    const allFlights = [
      ...(arrivalsData.data ?? []).map((f: any) => ({ ...f, _isArrival: true })),
      ...(departuresData.data ?? []).map((f: any) => ({ ...f, _isArrival: false })),
    ];

    // Collect unique airlines
    const airlinesMap = new Map<string, string>();
    for (const f of allFlights) {
      const code = f.airline?.iata;
      const name = f.airline?.name;
      if (code && name) airlinesMap.set(code, name);
    }

    // Upsert airlines
    if (airlinesMap.size > 0) {
      const airlineRows = Array.from(airlinesMap.entries()).map(
        ([code, name]) => ({ code, name })
      );
      await supabase
        .from("airlines")
        .upsert(airlineRows, { onConflict: "code" });
    }

    // Map status
    const mapStatus = (status: string | null): string => {
      if (!status) return "scheduled";
      const s = status.toLowerCase();
      if (s === "active" || s === "en-route") return "in_air";
      if (s === "landed") return "landed";
      if (s === "scheduled") return "scheduled";
      if (s === "cancelled") return "cancelled";
      if (s === "diverted") return "delayed";
      if (s === "incident") return "delayed";
      return "scheduled";
    };

    // Build flight rows
    const flightRows = allFlights
      .filter((f: any) => f.flight?.iata && f.airline?.iata)
      .map((f: any) => ({
        flight_number: f.flight.iata,
        airline_code: f.airline.iata,
        origin: f.departure?.iata ?? "???",
        destination: f.arrival?.iata ?? "???",
        scheduled_time:
          f.departure?.scheduled ?? f.arrival?.scheduled ?? new Date().toISOString(),
        estimated_time: f.departure?.estimated ?? f.arrival?.estimated ?? null,
        actual_time: f.departure?.actual ?? f.arrival?.actual ?? null,
        is_arrival: f._isArrival,
        status: mapStatus(f.flight_status),
        terminal: f._isArrival
          ? f.arrival?.terminal ?? null
          : f.departure?.terminal ?? null,
        gate: f._isArrival
          ? f.arrival?.gate ?? null
          : f.departure?.gate ?? null,
      }));

    // Clear old data and insert fresh
    await supabase.from("flights").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    if (flightRows.length > 0) {
      const { error: insertError } = await supabase
        .from("flights")
        .insert(flightRows);
      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        arrivals: arrivalsData.data?.length ?? 0,
        departures: departuresData.data?.length ?? 0,
        total_inserted: flightRows.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
