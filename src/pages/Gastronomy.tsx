import { useState, useMemo } from "react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, MapPin, UtensilsCrossed, Star, DollarSign,
  Fish, Wheat, Globe, Coffee, LayoutGrid, Map,
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
      <section className="relative flex items-end min-h-[65vh] md:min-h-[70vh] pt-20 overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        {/* Warm accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #FF6F61 0%, transparent 70%)" }} />

        <div className="relative z-10 w-full pb-10 md:pb-14">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border"
                  style={{ color: "#FF6F61", borderColor: "#FF6F61", background: "rgba(255,111,97,0.15)" }}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  Gastronomia · Ilha da Magia
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight">
                Sabores de{" "}
                <span className="italic" style={{ color: "#f4c025" }}>Florianópolis</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl mb-8 max-w-xl">
                Dos frutos do mar frescos à culinária açoriana — os melhores sabores da ilha.
              </p>
            </motion.div>

            {/* Search + Category pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/20 max-w-2xl"
            >
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  placeholder="Buscar restaurante, prato ou especialidade..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 outline-none focus:border-[#FF6F61] transition-colors text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                        category === c.value
                          ? "text-slate-900 shadow-md"
                          : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
                      }`}
                      style={category === c.value ? { background: "#f4c025" } : {}}
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
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
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
      <BottomNav />
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
    className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card"
  >
    <div className="relative h-56 overflow-hidden bg-muted">
      {restaurant.photo_url ? (
        <img
          src={restaurant.photo_url}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700">
          <UtensilsCrossed className="w-12 h-12 text-orange-200 dark:text-slate-600" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute top-3 left-3">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full text-slate-900"
          style={{ background: "#f4c025" }}
        >
          {CATEGORY_LABELS[restaurant.category] || restaurant.category}
        </span>
      </div>
      {restaurant.avg_rating && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-white">{restaurant.avg_rating.toFixed(1)}</span>
        </div>
      )}
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="font-extrabold text-white text-lg leading-tight drop-shadow-md group-hover:text-[#f4c025] transition-colors">
          {restaurant.name}
        </h3>
        {restaurant.neighborhood && (
          <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" /> {restaurant.neighborhood}
          </p>
        )}
      </div>
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted-foreground text-sm line-clamp-2 flex-1">{restaurant.description}</p>
        {restaurant.price_range && <PriceIndicator level={restaurant.price_range} />}
      </div>
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
        className="text-xs font-bold hover:underline inline-block"
        style={{ color: "#FF6F61" }}
      >
        Ver cardápio →
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
