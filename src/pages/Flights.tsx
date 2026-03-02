import { useState } from "react";
import SEO from "@/components/SEO";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FlightTable from "@/components/flights/FlightTable";
import FlightSearch from "@/components/flights/FlightSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaneLanding, PlaneTakeoff, Search, RefreshCw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Flight = Tables<"flights">;

const Flights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("arrivals");
  const queryClient = useQueryClient();

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
    const matchesSearch =
      !searchQuery ||
      f.flight_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (airlineMap.get(f.airline_code) ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Voos em Tempo Real – Aeroporto de Florianópolis (FLN)"
        description="Acompanhe chegadas e partidas em tempo real no Aeroporto Internacional de Florianópolis. Status de voos, portões e horários atualizados."
        url="/flights"
      />
      <SiteHeader />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-ocean text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
                Voos em Tempo Real
              </h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl">
                Acompanhe chegadas e partidas do Aeroporto Internacional de
                Florianópolis — Hercílio Luz (FLN)
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 -mt-8 relative z-10 pb-16">
          <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row md:items-center gap-4">
              <FlightSearch value={searchQuery} onChange={setSearchQuery} />
              <div className="flex items-center gap-3 ml-auto shrink-0">
                <button
                  onClick={() => syncMutation.mutate()}
                  disabled={syncMutation.isPending}
                  className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {syncMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Sincronizar API
                </button>
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Atualizar
                </button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 md:px-6 border-b border-border">
                <TabsList className="bg-transparent h-auto p-0 gap-0">
                  <TabsTrigger
                    value="arrivals"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 gap-2"
                  >
                    <PlaneLanding className="w-4 h-4" />
                    Chegadas
                  </TabsTrigger>
                  <TabsTrigger
                    value="departures"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 gap-2"
                  >
                    <PlaneTakeoff className="w-4 h-4" />
                    Partidas
                  </TabsTrigger>
                  <TabsTrigger
                    value="track"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 gap-2"
                  >
                    <Search className="w-4 h-4" />
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
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Flights;
