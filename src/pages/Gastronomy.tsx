import { useState, useMemo, lazy, Suspense } from "react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, MapPin, UtensilsCrossed, Star, DollarSign,
  Fish, Wheat, Globe, Coffee, LayoutGrid, Map, Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { value: "all", label: "Todos", icon: UtensilsCrossed },
  { value: "frutos_do_mar", label: "Frutos do Mar", icon: Fish },
  { value: "acoriana", label: "Açoriana", icon: Wheat },
  { value: "internacional", label: "Internacional", icon: Globe },
  { value: "cafes_doces", label: "Cafés & Doces", icon: Coffee },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  frutos_do_mar: "Frutos do Mar",
  acoriana: "Açoriana",
  internacional: "Internacional",
  cafes_doces: "Cafés & Doces",
};

const CATEGORY_COLORS: Record<string, string> = {
  frutos_do_mar: "bg-ocean/10 text-ocean-deep border-ocean/20",
  acoriana: "bg-sand-warm/30 text-foreground border-sand-warm/40",
  internacional: "bg-tropical-light text-tropical border-tropical/20",
  cafes_doces: "bg-sunset/10 text-sunset border-sunset/20",
};

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  address: string | null;
  neighborhood: string | null;
  region: string;
  phone: string | null;
  price_range: number | null;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  specialties: string[] | null;
  opening_hours: string | null;
  has_delivery: boolean;
  has_reservation: boolean;
  avg_rating?: number;
  review_count?: number;
};

const Gastronomy = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("name");
      if (error) throw error;

      // Fetch review stats
      const { data: reviews } = await supabase
        .from("restaurant_reviews")
        .select("restaurant_id, rating");

      const stats: Record<string, { sum: number; count: number }> = {};
      reviews?.forEach((r) => {
        if (!stats[r.restaurant_id]) stats[r.restaurant_id] = { sum: 0, count: 0 };
        stats[r.restaurant_id].sum += r.rating;
        stats[r.restaurant_id].count++;
      });

      return (data as Restaurant[]).map((rest) => ({
        ...rest,
        avg_rating: stats[rest.id] ? stats[rest.id].sum / stats[rest.id].count : undefined,
        review_count: stats[rest.id]?.count || 0,
      }));
    },
  });

  const filtered = useMemo(() => {
    if (!restaurants) return [];
    return restaurants.filter((r) => {
      const matchesSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase()) ||
        r.specialties?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "all" || r.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [restaurants, search, category]);

  const categoryCounts = useMemo(() => {
    if (!restaurants) return {};
    const counts: Record<string, number> = {};
    restaurants.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [restaurants]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gastronomia de Florianópolis – Restaurantes e Bares"
        description="Descubra os melhores restaurantes de Florianópolis: frutos do mar, culinária açoriana, internacional e cafés. Avaliações e cardápios."
        url="/gastronomia"
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 bg-gradient-sunset text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground/20 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
              Gastronomia de Florianópolis
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-xl mb-8">
              Dos frutos do mar frescos à culinária açoriana — descubra os melhores
              sabores da Ilha da Magia.
            </p>
          </motion.div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
              <Input
                placeholder="Buscar restaurante ou prato..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-primary-foreground/15 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30"
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    category === c.value
                      ? "bg-primary-foreground text-foreground"
                      : "bg-primary-foreground/15 text-primary-foreground/80 hover:bg-primary-foreground/25"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {c.label}
                  {c.value !== "all" && categoryCounts[c.value] && (
                    <span className="ml-0.5 opacity-70">({categoryCounts[c.value]})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground text-sm">
            {filtered.length} restaurante{filtered.length !== 1 ? "s" : ""} encontrado
            {filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-card shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Visualização em grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "map"
                  ? "bg-card shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Visualização no mapa"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : viewMode === "map" ? (
          <RestaurantMap restaurants={filtered} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">Nenhum restaurante encontrado</p>
            <p className="text-sm">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
};

/* ---- Restaurant Card ---- */
const PriceIndicator = ({ level }: { level: number }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4].map((n) => (
      <DollarSign
        key={n}
        className={`w-3 h-3 ${n <= level ? "text-foreground" : "text-muted-foreground/30"}`}
      />
    ))}
  </span>
);

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    className="group rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-card"
  >
    <div className="relative h-48 overflow-hidden bg-muted">
      {restaurant.photo_url ? (
        <img
          src={restaurant.photo_url}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/5">
          <UtensilsCrossed className="w-12 h-12 text-muted-foreground/20" />
        </div>
      )}
      <div className="absolute inset-0 bg-card-hover" />
      <div className="absolute top-3 left-3">
        <Badge className={`text-xs border ${CATEGORY_COLORS[restaurant.category] || "bg-muted text-foreground"}`}>
          {CATEGORY_LABELS[restaurant.category] || restaurant.category}
        </Badge>
      </div>
      {restaurant.avg_rating && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-foreground">{restaurant.avg_rating.toFixed(1)}</span>
        </div>
      )}
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {restaurant.name}
        </h3>
        {restaurant.price_range && <PriceIndicator level={restaurant.price_range} />}
      </div>
      <p className="text-muted-foreground text-sm line-clamp-2">{restaurant.description}</p>
      {restaurant.neighborhood && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {restaurant.neighborhood}
        </p>
      )}
      {restaurant.specialties && restaurant.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {restaurant.specialties.slice(0, 3).map((s) => (
            <Badge key={s} variant="outline" className="text-xs">
              {s}
            </Badge>
          ))}
          {restaurant.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{restaurant.specialties.length - 3}
            </Badge>
          )}
        </div>
      )}
      <Link
        to={`/gastronomia/${restaurant.slug}`}
        className="text-xs text-primary hover:underline font-medium inline-block"
      >
        Ver detalhes →
      </Link>
    </div>
  </motion.div>
);

/* ---- Restaurant Map ---- */
const RestaurantMap = ({ restaurants }: { restaurants: Restaurant[] }) => {
  const withCoords = restaurants.filter((r) => r.latitude && r.longitude);

  if (withCoords.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Map className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>Nenhum restaurante com localização disponível.</p>
      </div>
    );
  }

  const center = {
    lat: withCoords.reduce((s, r) => s + Number(r.latitude), 0) / withCoords.length,
    lng: withCoords.reduce((s, r) => s + Number(r.longitude), 0) / withCoords.length,
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.15},${center.lat - 0.1},${center.lng + 0.15},${center.lat + 0.1}&layer=mapnik`;

  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden border border-border h-[500px]">
        <iframe src={mapUrl} className="w-full h-full" title="Mapa de Restaurantes" loading="lazy" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {withCoords.map((r) => (
          <Link
            key={r.id}
            to={`/gastronomia/${r.slug}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:shadow-card transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
              <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[r.category]} · {r.neighborhood}</p>
            </div>
            {r.avg_rating && (
              <div className="ml-auto flex items-center gap-1 shrink-0">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{r.avg_rating.toFixed(1)}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gastronomy;
