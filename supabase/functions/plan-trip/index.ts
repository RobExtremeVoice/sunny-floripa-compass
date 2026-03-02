import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Fetch all places from DB to give context to the AI
    const [beachesRes, restaurantsRes, activitiesRes] = await Promise.all([
      supabase.from("beaches").select("name, slug, region, description, characteristics, wave_intensity, infrastructure, best_season").limit(50),
      supabase.from("restaurants").select("name, slug, region, category, description, specialties, price_range, neighborhood").limit(50),
      supabase.from("activities").select("name, slug, region, category, description, difficulty, duration_minutes, price_range, best_time, highlights").limit(50),
    ]);

    const beaches = beachesRes.data ?? [];
    const restaurants = restaurantsRes.data ?? [];
    const activities = activitiesRes.data ?? [];

    const placesContext = `
## Praias disponíveis em Florianópolis:
${beaches.map(b => `- **${b.name}** (${b.region}): ${b.description?.slice(0, 120) || ""}. Ondas: ${b.wave_intensity || "N/A"}. Melhor época: ${b.best_season || "o ano todo"}. Infraestrutura: ${(b.infrastructure || []).join(", ") || "básica"}.`).join("\n")}

## Restaurantes disponíveis:
${restaurants.map(r => `- **${r.name}** (${r.region}, ${r.neighborhood || ""}): ${r.category}. ${r.description?.slice(0, 100) || ""}. Preço: ${"$".repeat(r.price_range || 2)}. Especialidades: ${(r.specialties || []).join(", ") || "variada"}.`).join("\n")}

## Atividades e entretenimento disponíveis:
${activities.map(a => `- **${a.name}** (${a.region}): ${a.category}. ${a.description?.slice(0, 100) || ""}. Duração: ${a.duration_minutes ? a.duration_minutes + "min" : "variável"}. Dificuldade: ${a.difficulty || "fácil"}. Melhor horário: ${a.best_time || "qualquer"}.`).join("\n")}
`;

    const { messages } = await req.json();

    const systemPrompt = `Você é o assistente de viagem do VisiteFloripa, especialista em Florianópolis, Brasil.

Seu papel é ajudar o usuário a planejar uma viagem perfeita para Florianópolis. Você deve:
1. Ser amigável, entusiasmado e conhecedor da ilha
2. Perguntar sobre: datas de viagem, número de viajantes, interesses (praias, gastronomia, aventura, vida noturna, família), orçamento e preferências
3. Quando tiver informações suficientes, gerar um roteiro dia-a-dia usando APENAS os lugares reais listados abaixo
4. Formatar o roteiro em markdown bonito com emojis, horários sugeridos e dicas
5. Responder sempre em português brasileiro

IMPORTANTE: Use APENAS os lugares que existem no nosso banco de dados abaixo. Não invente lugares.

${placesContext}

Quando criar o roteiro, use este formato para cada dia:
## 🗓️ Dia X — Título do dia
### 🌅 Manhã
- **HH:MM** — Local (tipo) — breve descrição/dica
### ☀️ Tarde  
- **HH:MM** — Local (tipo) — breve descrição/dica
### 🌙 Noite
- **HH:MM** — Local (tipo) — breve descrição/dica

💡 **Dica do dia:** uma dica relevante

Comece se apresentando brevemente e pergunte sobre a viagem do usuário.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao gerar roteiro" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("plan-trip error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
