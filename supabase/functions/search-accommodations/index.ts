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
    const rapidApiKey = Deno.env.get("RAPIDAPI_KEY");
    if (!rapidApiKey) throw new Error("RAPIDAPI_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const url = new URL(req.url);
    const checkin = url.searchParams.get("checkin") || getDefaultDate(1);
    const checkout = url.searchParams.get("checkout") || getDefaultDate(3);
    const adults = url.searchParams.get("adults") || "2";
    const rooms = url.searchParams.get("rooms") || "1";
    const sortBy = url.searchParams.get("sort") || "popularity";
    const page = url.searchParams.get("page") || "1";

    // First, try to get cached results
    const { data: cached } = await supabase
      .from("accommodations")
      .select("*")
      .eq("checkin_date", checkin)
      .eq("checkout_date", checkout)
      .order("review_score", { ascending: false });

    // If we have recent cached data (less than 1 hour old), return it
    if (cached && cached.length > 0) {
      const newest = new Date(cached[0].updated_at);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (newest > oneHourAgo) {
        return new Response(
          JSON.stringify({ source: "cache", data: cached }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Step 1: Get dest_id for Florianópolis
    const destRes = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=Florianopolis`,
      {
        headers: {
          "x-rapidapi-host": "booking-com15.p.rapidapi.com",
          "x-rapidapi-key": rapidApiKey,
        },
      }
    );
    const destData = await destRes.json();
    
    if (!destData.data || destData.data.length === 0) {
      throw new Error("Could not find Florianópolis destination ID");
    }

    const dest = destData.data[0];
    const destId = dest.dest_id;
    const destType = dest.search_type || "city";

    // Step 2: Search hotels
    const searchUrl = new URL("https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels");
    searchUrl.searchParams.set("dest_id", destId);
    searchUrl.searchParams.set("search_type", destType);
    searchUrl.searchParams.set("arrival_date", checkin);
    searchUrl.searchParams.set("departure_date", checkout);
    searchUrl.searchParams.set("adults", adults);
    searchUrl.searchParams.set("room_qty", rooms);
    searchUrl.searchParams.set("page_number", page);
    searchUrl.searchParams.set("units", "metric");
    searchUrl.searchParams.set("temperature_unit", "c");
    searchUrl.searchParams.set("languagecode", "pt-br");
    searchUrl.searchParams.set("currency_code", "BRL");
    searchUrl.searchParams.set("sort_by", sortBy);

    const searchRes = await fetch(searchUrl.toString(), {
      headers: {
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
        "x-rapidapi-key": rapidApiKey,
      },
    });
    const searchData = await searchRes.json();

    if (!searchData.data?.hotels) {
      return new Response(
        JSON.stringify({ source: "api", data: [], message: "No hotels found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map to our schema
    const accommodations = searchData.data.hotels.map((h: any) => ({
      external_id: String(h.hotel_id),
      name: h.property?.name || h.hotel_name || "Hotel",
      description: h.property?.wishlistName || h.accessibilityLabel || null,
      hotel_type: h.property?.propertyClass ? `${h.property.propertyClass} estrelas` : null,
      star_rating: h.property?.propertyClass || null,
      review_score: h.property?.reviewScore || null,
      review_count: h.property?.reviewCount || 0,
      price_per_night: h.property?.priceBreakdown?.grossPrice?.value || null,
      currency: "BRL",
      address: h.property?.countryCode === "br" ? "Florianópolis, SC" : null,
      city: "Florianópolis",
      latitude: h.property?.latitude || null,
      longitude: h.property?.longitude || null,
      photo_url: h.property?.photoUrls?.[0] || null,
      photos: h.property?.photoUrls?.slice(0, 5) || [],
      amenities: [],
      checkin_date: checkin,
      checkout_date: checkout,
      booking_url: h.property?.externalReviewUrl || null,
      data_source: "booking.com",
    }));

    // Cache results
    if (accommodations.length > 0) {
      // Delete old cached data for these dates
      await supabase
        .from("accommodations")
        .delete()
        .eq("checkin_date", checkin)
        .eq("checkout_date", checkout);

      await supabase.from("accommodations").insert(accommodations);
    }

    return new Response(
      JSON.stringify({
        source: "api",
        data: accommodations,
        total: searchData.data.hotels.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function getDefaultDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}
