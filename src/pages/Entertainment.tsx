import { useState, useMemo } from "react";
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
  Search, MapPin, Star, DollarSign, LayoutGrid, Map,
  TreePine, Sailboat, Zap, Moon, Landmark, Baby, Clock, Ticket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { value: "all", label: "Todos", icon: Ticket },
  { value: "trilhas_natureza", label: "Trilhas & Natureza", icon: TreePine },
  { value: "passeios_barco", label: "Passeios de Barco", icon: Sailboat },
  { value: "esportes_aventura", label: "Esportes & Aventura", icon: Zap },
  { value: "vida_noturna", label: "Vida Noturna", icon: Moon },
  { value: "cultura_historia", label: "Cultura & História", icon: Landmark },
  { value: "familia_criancas", label: "Família & Crianças", icon: Baby },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  trilhas_natureza: "Trilhas & Natureza",
  passeios_barco: "Passeios de Barco",
  esportes_aventura: "Esportes & Aventura",
  vida_noturna: "Vida Noturna",
  cultura_historia: "Cultura & História",
  familia_criancas: "Família & Crianças",
};

const CATEGORY_COLORS: Record<string, string> = {
  trilhas_natureza: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  passeios_barco: "bg-ocean/10 text-ocean-deep border-ocean/20",
  esportes_aventura: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  vida_noturna: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  cultura_historia: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  familia_criancas: "bg-pink-500/10 text-pink-700 border-pink-500/20",
};

type Activity = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  neighborhood: string | null;
  region: string;
  photo_url: string | null;
  price_range: number | null;
  difficulty: string | null;
  duration_minutes: number | null;
  is_free: boolean | null;
  highlights: string[] | null;
  latitude: number | null;
  longitude: number | null;
  avg_rating?: number;
  review_count?: number;
};

const Entertainment = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("name");
      if (error) throw error;

      const { data: reviews } = await supabase
        .from("activity_reviews")
        .select("activity_id, rating");

      const stats: Record<string, { sum: number; count: number }> = {};
      reviews?.forEach((r) => {
        if (!stats[r.activity_id]) stats[r.activity_id] = { sum: 0, count: 0 };
        stats[r.activity_id].sum += r.rating;
        stats[r.activity_id].count++;
      });

      return (data as Activity[]).map((a) => ({
        ...a,
        avg_rating: stats[a.id] ? stats[a.id].sum / stats[a.id].count : undefined,
        review_count: stats[a.id]?.count || 0,
      }));
    },
  });

  const filtered = useMemo(() => {
    if (!activities) return [];
    return activities.filter((a) => {
      const matchesSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase()) ||
        a.highlights?.some((h) => h.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "all" || a.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [activities, search, category]);

  const categoryCounts = useMemo(() => {
    if (!activities) return {};
    const counts: Record<string, number> = {};
    activities.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [activities]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Entretenimento em Florianópolis – O que fazer"
        description="Trilhas, passeios de barco, surf, vida noturna e atrações culturais em Florianópolis. Guia completo de atividades na Ilha da Magia."
        url="/entretenimento"
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 bg-gradient-ocean text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground/20 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
              Entretenimento em Florianópolis
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-xl mb-8">
              Trilhas, passeios de barco, esportes radicais, vida noturna e muito mais — viva a Ilha da Magia.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
              <Input
                placeholder="Buscar atividade ou passeio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-primary-foreground/15 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30"
              />
            </div>
          </div>

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
            {filtered.length} atividade{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Visualização em grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "map" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
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
          <ActivityMap activities={filtered} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">Nenhuma atividade encontrada</p>
            <p className="text-sm">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
};

/* ---- Activity Card ---- */
const PriceIndicator = ({ level }: { level: number }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4].map((n) => (
      <DollarSign key={n} className={`w-3 h-3 ${n <= level ? "text-foreground" : "text-muted-foreground/30"}`} />
    ))}
  </span>
);

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${m}min` : `${h}h`;
};

const ActivityCard = ({ activity }: { activity: Activity }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    className="group rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-card"
  >
    <div className="relative h-48 overflow-hidden bg-muted">
      {activity.photo_url ? (
        <img
          src={activity.photo_url}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/5">
          <Ticket className="w-12 h-12 text-muted-foreground/20" />
        </div>
      )}
      <div className="absolute inset-0 bg-card-hover" />
      <div className="absolute top-3 left-3">
        <Badge className={`text-xs border ${CATEGORY_COLORS[activity.category] || "bg-muted text-foreground"}`}>
          {CATEGORY_LABELS[activity.category] || activity.category}
        </Badge>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {activity.is_free && (
          <Badge className="bg-emerald-500 text-white text-xs">Gratuito</Badge>
        )}
        {activity.avg_rating && (
          <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-foreground">{activity.avg_rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {activity.name}
        </h3>
        {activity.price_range && !activity.is_free && <PriceIndicator level={activity.price_range} />}
      </div>
      <p className="text-muted-foreground text-sm line-clamp-2">{activity.description}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {activity.neighborhood && (
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activity.neighborhood}</span>
        )}
        {activity.duration_minutes && (
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDuration(activity.duration_minutes)}</span>
        )}
      </div>
      {activity.highlights && activity.highlights.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {activity.highlights.slice(0, 3).map((h) => (
            <Badge key={h} variant="outline" className="text-xs">{h}</Badge>
          ))}
        </div>
      )}
      <Link
        to={`/entretenimento/${activity.slug}`}
        className="text-xs text-primary hover:underline font-medium inline-block"
      >
        Ver detalhes →
      </Link>
    </div>
  </motion.div>
);

/* ---- Activity Map ---- */
const ActivityMap = ({ activities }: { activities: Activity[] }) => {
  const withCoords = activities.filter((a) => a.latitude && a.longitude);

  if (withCoords.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Map className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>Nenhuma atividade com localização disponível.</p>
      </div>
    );
  }

  const center = {
    lat: withCoords.reduce((s, a) => s + Number(a.latitude), 0) / withCoords.length,
    lng: withCoords.reduce((s, a) => s + Number(a.longitude), 0) / withCoords.length,
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.15},${center.lat - 0.1},${center.lng + 0.15},${center.lat + 0.1}&layer=mapnik`;

  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden border border-border h-[500px]">
        <iframe src={mapUrl} className="w-full h-full" title="Mapa de Atividades" loading="lazy" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {withCoords.map((a) => (
          <Link
            key={a.id}
            to={`/entretenimento/${a.slug}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:shadow-card transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
              <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[a.category]} · {a.neighborhood}</p>
            </div>
            {a.avg_rating && (
              <div className="ml-auto flex items-center gap-1 shrink-0">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{a.avg_rating.toFixed(1)}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Entertainment;
