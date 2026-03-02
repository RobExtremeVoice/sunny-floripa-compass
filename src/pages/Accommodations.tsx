import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Users, CalendarDays, Loader2, Hotel, BedDouble } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const getDefaultDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
};

const Accommodations = () => {
  const [checkin, setCheckin] = useState(getDefaultDate(1));
  const [checkout, setCheckout] = useState(getDefaultDate(3));
  const [adults, setAdults] = useState("2");
  const [rooms, setRooms] = useState("1");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["accommodations", checkin, checkout, adults, rooms],
    queryFn: async () => {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-accommodations?checkin=${checkin}&checkout=${checkout}&adults=${adults}&rooms=${rooms}`;
      const res = await fetch(url, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      if (!res.ok) throw new Error("Erro ao buscar hospedagens");
      return res.json();
    },
    enabled: searchTriggered,
  });

  const accommodations = data?.data ?? [];

  const handleSearch = () => {
    setSearchTriggered(true);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
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
                Hospedagem em Florianópolis
              </h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl">
                Encontre hotéis, pousadas e resorts para sua estadia na Ilha da Magia
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search bar */}
        <section className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="bg-card rounded-2xl shadow-elevated border border-border p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Check-in
                </label>
                <Input
                  type="date"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  min={getDefaultDate(0)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Check-out
                </label>
                <Input
                  type="date"
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  min={checkin}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" /> Hóspedes
                </label>
                <Input
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  min="1"
                  max="10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <BedDouble className="w-3 h-3" /> Quartos
                </label>
                <Input
                  type="number"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  min="1"
                  max="5"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90 h-10"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="container mx-auto px-4 py-12">
          {!searchTriggered && (
            <div className="text-center py-20">
              <Hotel className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-2xl font-display text-foreground/60 mb-2">
                Descubra onde se hospedar
              </h2>
              <p className="text-muted-foreground">
                Selecione suas datas e clique em buscar para encontrar as melhores opções.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchTriggered && !isLoading && accommodations.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Nenhuma hospedagem encontrada para as datas selecionadas.
              </p>
            </div>
          )}

          {accommodations.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold">
                  {accommodations.length} hospedagens encontradas
                </h2>
                {data?.source && (
                  <Badge variant="outline" className="text-xs">
                    {data.source === "cache" ? "Cache" : "Booking.com"}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map((acc: any, i: number) => (
                  <motion.div
                    key={acc.external_id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-shadow group"
                  >
                    {/* Photo */}
                    <div className="relative h-48 overflow-hidden">
                      {acc.photo_url ? (
                        <img
                          src={acc.photo_url}
                          alt={acc.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Hotel className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      {acc.star_rating && (
                        <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-sunset fill-sunset" />
                          <span className="text-xs font-medium">{acc.star_rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                        {acc.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3" /> Florianópolis, SC
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          {acc.review_score && (
                            <div className="flex items-center gap-1.5">
                              <span className="bg-primary text-primary-foreground text-xs font-bold rounded px-1.5 py-0.5">
                                {acc.review_score}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({acc.review_count} avaliações)
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {acc.price_per_night ? (
                            <>
                              <p className="text-lg font-bold text-primary">
                                R$ {Number(acc.price_per_night).toFixed(0)}
                              </p>
                              <p className="text-xs text-muted-foreground">por noite</p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">Consultar preço</p>
                          )}
                        </div>
                      </div>

                      {acc.booking_url && (
                        <a
                          href={acc.booking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 block w-full text-center bg-gradient-sunset text-primary-foreground rounded-lg py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          Ver no Booking.com
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Accommodations;
