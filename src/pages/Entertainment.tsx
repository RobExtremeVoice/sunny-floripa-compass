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
      <section className="relative flex items-end min-h-[65vh] md:min-h-[70vh] pt-20 overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        {/* Green accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, #26C6A0 0%, transparent 70%)" }} />

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
                  style={{ color: "#26C6A0", borderColor: "#26C6A0", background: "rgba(38,198,160,0.15)" }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  O que fazer · Ilha da Magia
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight">
                Aventuras em{" "}
                <span className="italic" style={{ color: "#f4c025" }}>Florianópolis</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl mb-8 max-w-xl">
                Trilhas, passeios de barco, surf, vida noturna e muito mais — viva a ilha ao máximo.
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
                  placeholder="Buscar atividade, passeio ou atrativo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 outline-none focus:border-[#26C6A0] transition-colors text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
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
      <BottomNav />
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
    className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card"
  >
    <div className="relative h-56 overflow-hidden bg-muted">
      {activity.photo_url ? (
        <img
          src={activity.photo_url}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-800 dark:to-slate-700">
          <Ticket className="w-12 h-12 text-emerald-200 dark:text-slate-600" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      <div className="absolute top-3 left-3">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full text-slate-900"
          style={{ background: "#f4c025" }}
        >
          {CATEGORY_LABELS[activity.category] || activity.category}
        </span>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {activity.is_free && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#26C6A0" }}>
            Gratuito
          </span>
        )}
        {activity.avg_rating && (
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-white">{activity.avg_rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="font-extrabold text-white text-lg leading-tight drop-shadow-md group-hover:text-[#f4c025] transition-colors">
          {activity.name}
        </h3>
        <div className="flex items-center gap-3 text-white/65 text-xs mt-0.5">
          {activity.neighborhood && (
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activity.neighborhood}</span>
          )}
          {activity.duration_minutes && (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDuration(activity.duration_minutes)}</span>
          )}
        </div>
      </div>
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted-foreground text-sm line-clamp-2 flex-1">{activity.description}</p>
        {activity.price_range && !activity.is_free && <PriceIndicator level={activity.price_range} />}
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
        className="text-xs font-bold hover:underline inline-block"
        style={{ color: "#26C6A0" }}
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
