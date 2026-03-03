import { useState, useRef } from "react";
import SEO from "@/components/SEO";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BottomNav from "@/components/BottomNav";
import FlightTable from "@/components/flights/FlightTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RefreshCw, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Flight = Tables<"flights">;

const popularRoutes = [
  {
    city: "São Paulo",
    code: "GRU / CGH",
    img: "https://images.unsplash.com/photo-1578996090004-5ca8d04ca3f3?w=600&q=80",
    from: "R$ 289",
  },
  {
    city: "Rio de Janeiro",
    code: "GIG / SDU",
    img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80",
    from: "R$ 349",
  },
  {
    city: "Curitiba",
    code: "CWB",
    img: "https://images.unsplash.com/photo-1564515396-52ec00e2abc2?w=600&q=80",
    from: "R$ 199",
  },
  {
    city: "Brasília",
    code: "BSB",
    img: "https://images.unsplash.com/photo-1559662780-c3bab6f7e00b?w=600&q=80",
    from: "R$ 399",
  },
  {
    city: "Porto Alegre",
    code: "POA",
    img: "https://images.unsplash.com/photo-1604935067370-773afe6a3c6d?w=600&q=80",
    from: "R$ 179",
  },
  {
    city: "Buenos Aires",
    code: "EZE",
    img: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80",
    from: "R$ 899",
  },
];

const airlinesList = [
  { code: "LA", name: "LATAM Airlines", routes: 12, color: "#E31837", rating: 4.2 },
  { code: "G3", name: "Gol Linhas Aéreas", routes: 9, color: "#FF6600", rating: 3.8 },
  { code: "AD", name: "Azul Linhas Aéreas", routes: 8, color: "#0059A4", rating: 4.5 },
  { code: "AV", name: "Avianca", routes: 3, color: "#C61C2D", rating: 3.9 },
  { code: "AA", name: "American Airlines", routes: 2, color: "#0078D2", rating: 4.1 },
  { code: "CM", name: "Copa Airlines", routes: 2, color: "#003087", rating: 4.3 },
];

const tipsList = [
  {
    icon: "calendar_month",
    title: "Reserve com Antecedência",
    desc: "Passagens compradas 30–60 dias antes costumam ser 40% mais baratas.",
    accent: "#00A8E8",
  },
  {
    icon: "sync_alt",
    title: "Flexibilidade nas Datas",
    desc: "Viajar terça ou quarta-feira é geralmente mais barato do que fins de semana.",
    accent: "#26C6A0",
  },
  {
    icon: "compare_arrows",
    title: "Compare Preços",
    desc: "Use comparadores de passagens e ative alertas de preço para sua rota.",
    accent: "#FF6F61",
  },
  {
    icon: "luggage",
    title: "Atenção à Bagagem",
    desc: "Franquias variam por companhia. Verifique antes de comprar para evitar cobranças extras.",
    accent: "#f4c025",
  },
];

const airportGuide = [
  {
    icon: "check_circle",
    title: "Check-in",
    desc: "Online disponível até 48h antes. Balcões presenciais abrem 3h antes (internacionais) e 2h (domésticos).",
  },
  {
    icon: "work",
    title: "Bagagem",
    desc: "Despacho: até 23 kg (econômica). Bagagem de mão: 10 kg, dimensões 55×35×25 cm. Confirme com sua companhia.",
  },
  {
    icon: "directions_bus",
    title: "Como Chegar",
    desc: "Ônibus linha 183 (R$ 6,50), táxi (~R$ 60 ao centro), Uber e 99 disponíveis no app.",
  },
  {
    icon: "storefront",
    title: "Serviços no Aeroporto",
    desc: "Wi-Fi gratuito, duty-free, restaurantes, farmácia, câmbio e Sala Floripa para passageiros premium.",
  },
];

const Flights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("arrivals");
  const [heroOrigin, setHeroOrigin] = useState("");
  const queryClient = useQueryClient();
  const flightSectionRef = useRef<HTMLDivElement>(null);

  const syncMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("sync-flights");
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      toast.success(`Voos atualizados! ${data.total_inserted} voos carregados.`);
    },
    onError: (error) => {
      toast.error(`Erro ao sincronizar: ${error.message}`);
    },
  });

  const { data: flights, isLoading, refetch } = useQuery({
    queryKey: ["flights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flights")
        .select("*")
        .order("scheduled_time", { ascending: true });
      if (error) throw error;
      return data as Flight[];
    },
    refetchInterval: 60000,
  });

  const { data: airlines } = useQuery({
    queryKey: ["airlines"],
    queryFn: async () => {
      const { data, error } = await supabase.from("airlines").select("*");
      if (error) throw error;
      return data;
    },
  });

  const airlineMap = new Map(airlines?.map((a) => [a.code, a.name]) ?? []);

  const filteredFlights = flights?.filter((f) => {
    const isArrival = activeTab === "arrivals" ? true : activeTab === "departures" ? false : null;
    const matchesTab = isArrival === null || f.is_arrival === isArrival;
    const query = searchQuery || heroOrigin;
    const matchesSearch =
      !query ||
      f.flight_number.toLowerCase().includes(query.toLowerCase()) ||
      f.origin.toLowerCase().includes(query.toLowerCase()) ||
      f.destination.toLowerCase().includes(query.toLowerCase()) ||
      (airlineMap.get(f.airline_code) ?? "").toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(heroOrigin);
    flightSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <SEO
        title="Voos para Florianópolis – Aeroporto Hercílio Luz (FLN)"
        description="Passagens, chegadas e partidas em tempo real do Aeroporto Internacional de Florianópolis. Rotas populares, companhias aéreas e guia do aeroporto."
        url="/flights"
      />
      <SiteHeader />

      <main className="pb-24 md:pb-0">
        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          className="relative flex items-center min-h-[70vh] md:min-h-[65vh] pt-20 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2a4a 50%, #0a1f3d 100%)" }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80)" }}
          />
          {/* Sky blue accent glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #00A8E8 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: "radial-gradient(circle, #26C6A0 0%, transparent 70%)" }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Live badge */}
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border"
                  style={{ color: "#00A8E8", borderColor: "#00A8E8", background: "rgba(0,168,232,0.1)" }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "#26C6A0" }}
                  />
                  FLN · Aeroporto de Florianópolis
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                Voe para a{" "}
                <span style={{ color: "#f4c025" }} className="italic">
                  Ilha da Magia
                </span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl mb-10 max-w-xl">
                Passagens, chegadas e partidas em tempo real do Aeroporto Hercílio Luz (FLN).
              </p>

              {/* Search form */}
              <form
                onSubmit={handleHeroSearch}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 max-w-3xl"
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                      Origem
                    </label>
                    <input
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#00A8E8] transition-colors text-sm"
                      placeholder="Cidade de origem (ex: São Paulo)"
                      value={heroOrigin}
                      onChange={(e) => setHeroOrigin(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end justify-center pb-3">
                    <span className="material-symbols-outlined text-white/40 text-2xl">arrow_forward</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                      Destino
                    </label>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-base" style={{ color: "#f4c025" }}>
                        flight_land
                      </span>
                      FLN – Florianópolis
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
                      style={{ background: "linear-gradient(135deg, #FF6F61, #ff4f3d)" }}
                    >
                      <span className="material-symbols-outlined text-base">search</span>
                      Buscar Voos
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent" />
        </section>

        {/* ── REAL-TIME FLIGHTS ────────────────────────────── */}
        <section
          ref={flightSectionRef}
          className="max-w-7xl mx-auto px-4 md:px-8 py-12"
        >
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#26C6A0" }}
                />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#26C6A0" }}>
                  Dados em Tempo Real
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold">
                Voos no Aeroporto de Florianópolis
              </h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </button>
              <button
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "#00A8E8" }}
              >
                {syncMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Sincronizar API
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                search
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-[#00A8E8]/30 focus:border-[#00A8E8] transition-all"
                placeholder="Buscar por voo, origem, destino ou companhia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs + table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 md:px-6 border-b border-slate-200 dark:border-slate-700">
                <TabsList className="bg-transparent h-auto p-0 gap-0">
                  <TabsTrigger
                    value="arrivals"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00A8E8] data-[state=active]:text-[#00A8E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5 py-4 gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400"
                  >
                    <span className="material-symbols-outlined text-base">flight_land</span>
                    Chegadas
                  </TabsTrigger>
                  <TabsTrigger
                    value="departures"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00A8E8] data-[state=active]:text-[#00A8E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5 py-4 gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400"
                  >
                    <span className="material-symbols-outlined text-base">flight_takeoff</span>
                    Partidas
                  </TabsTrigger>
                  <TabsTrigger
                    value="track"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#00A8E8] data-[state=active]:text-[#00A8E8] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-5 py-4 gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400"
                  >
                    <span className="material-symbols-outlined text-base">radar</span>
                    Rastrear Voo
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="arrivals" className="m-0">
                <FlightTable
                  flights={filteredFlights ?? []}
                  airlineMap={airlineMap}
                  isLoading={isLoading}
                  type="arrival"
                />
              </TabsContent>
              <TabsContent value="departures" className="m-0">
                <FlightTable
                  flights={filteredFlights ?? []}
                  airlineMap={airlineMap}
                  isLoading={isLoading}
                  type="departure"
                />
              </TabsContent>
              <TabsContent value="track" className="m-0">
                <FlightTable
                  flights={filteredFlights ?? []}
                  airlineMap={airlineMap}
                  isLoading={isLoading}
                  type="all"
                />
              </TabsContent>
            </Tabs>

            <div className="px-4 md:px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">info</span>
              Dados atualizados automaticamente a cada 60 segundos via AviationStack API.
            </div>
          </div>
        </section>

        {/* ── POPULAR ROUTES ───────────────────────────────── */}
        <section className="py-12 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#FF6F61" }}>
              Destinos
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-1">
              Rotas Mais Populares
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">
              Voos diretos e conexões para as cidades mais buscadas a partir de FLN.
            </p>
          </div>

          {/* Mobile: horizontal scroll | Desktop: grid */}
          <div className="px-4 md:px-8">
            <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible scrollbar-none">
              {popularRoutes.map((route) => (
                <div
                  key={route.city}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer flex-shrink-0 w-48 md:w-auto"
                  style={{ height: "220px" }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${route.img})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-extrabold text-sm leading-tight">{route.city}</p>
                    <p className="text-white/60 text-xs mb-2">{route.code}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70">A partir de</span>
                      <span className="font-bold text-sm" style={{ color: "#f4c025" }}>
                        {route.from}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AIRLINES ─────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#26C6A0" }}>
            Companhias Aéreas
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-1 mb-8">
            Quem Voa para Florianópolis
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {airlinesList.map((airline) => (
              <div
                key={airline.code}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0"
                  style={{ background: airline.color }}
                >
                  {airline.code}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {airline.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{airline.routes} rotas · {airline.rating}★</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIPS ─────────────────────────────────────────── */}
        <section
          className="py-16"
          style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,168,232,0.04) 100%)" }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#00A8E8" }}>
                Dicas de Viagem
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-1">
                Como Economizar na Passagem
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {tipsList.map((tip) => (
                <div
                  key={tip.title}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${tip.accent}18` }}
                  >
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ color: tip.accent }}
                    >
                      {tip.icon}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base mb-2">{tip.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AIRPORT GUIDE ────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div
              className="px-6 md:px-10 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2a4a 100%)" }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#00A8E8" }}>
                  Informações Úteis
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  Guia do Aeroporto Hercílio Luz
                </h2>
                <p className="text-white/60 text-sm mt-1">
                  Florianópolis, SC · Código IATA: FLN
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-5xl md:text-7xl opacity-20 text-white">
                  local_airport
                </span>
              </div>
            </div>

            {/* Guide cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
              {airportGuide.map((item) => (
                <div key={item.title} className="p-6 md:p-8 flex gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(0,168,232,0.1)" }}
                  >
                    <span className="material-symbols-outlined text-xl" style={{ color: "#00A8E8" }}>
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base mb-1">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <BottomNav />
    </div>
  );
};

export default Flights;
