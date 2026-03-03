import { useState, useMemo, lazy, Suspense } from "react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Waves, Footprints, Ruler, Sun, X, Map, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BeachesMap = lazy(() => import("@/components/BeachesMap"));

const REGIONS = ["Todas", "Norte", "Sul", "Leste", "Oeste"] as const;

const WAVE_LABELS: Record<string, string> = {
  calm: "Calmas",
  moderate: "Moderadas",
  strong: "Fortes",
};

const ACCESS_LABELS: Record<string, string> = {
  easy: "Fácil",
  moderate: "Moderado",
  hard: "Trilha",
};

const CHAR_LABELS: Record<string, string> = {
  surf: "Surf",
  calm: "Calma",
  family: "Família",
  nature: "Natureza",
  urban: "Urbana",
  wild: "Selvagem",
  trails: "Trilhas",
  nightlife: "Vida noturna",
  fishing: "Pesca",
  dunes: "Dunas",
  adventure: "Aventura",
  history: "História",
  culture: "Cultura",
  gastronomy: "Gastronomia",
  sports: "Esportes",
  sunset: "Pôr do sol",
  beach_clubs: "Beach clubs",
};

type Beach = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  region: string;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  characteristics: string[] | null;
  infrastructure: string[] | null;
  wave_intensity: string | null;
  sand_type: string | null;
  best_season: string | null;
  difficulty_access: string | null;
  length_meters: number | null;
};

const Beaches = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Todas");
  const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const { data: beaches, isLoading } = useQuery({
    queryKey: ["beaches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beaches")
        .select("*")
        .order("region")
        .order("name");
      if (error) throw error;
      return data as Beach[];
    },
  });

  const filtered = useMemo(() => {
    if (!beaches) return [];
    return beaches.filter((b) => {
      const matchesSearch =
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description?.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = region === "Todas" || b.region === region;
      return matchesSearch && matchesRegion;
    });
  }, [beaches, search, region]);

  const regionCounts = useMemo(() => {
    if (!beaches) return {};
    const counts: Record<string, number> = {};
    beaches.forEach((b) => {
      counts[b.region] = (counts[b.region] || 0) + 1;
    });
    return counts;
  }, [beaches]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Praias de Florianópolis – Guia Completo"
        description="Descubra as 42 praias de Florianópolis: fotos, ondas, infraestrutura, acesso e mapa interativo. Encontre a praia perfeita na Ilha da Magia."
        url="/praias"
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative flex items-end min-h-[65vh] md:min-h-[70vh] pt-20 overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80)" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        {/* Teal accent glow */}
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
                  <Waves className="w-3.5 h-3.5" />
                  {beaches?.length || "42+"} Praias · Ilha da Magia
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight">
                Praias de{" "}
                <span className="italic" style={{ color: "#f4c025" }}>Florianópolis</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl mb-8 max-w-xl">
                De enseadas calmas a ondas perfeitas para surf — encontre sua praia ideal na ilha.
              </p>
            </motion.div>

            {/* Search + Region pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/20 max-w-2xl"
            >
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  placeholder="Buscar praia por nome ou descrição..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 outline-none focus:border-[#26C6A0] transition-colors text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      region === r
                        ? "text-slate-900 shadow-md"
                        : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
                    }`}
                    style={region === r ? { background: "#f4c025" } : {}}
                  >
                    {r}
                    {r !== "Todas" && regionCounts[r] && (
                      <span className="ml-1 opacity-70">({regionCounts[r]})</span>
                    )}
                  </button>
                ))}
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
            {filtered.length} praia{filtered.length !== 1 ? "s" : ""} encontrada
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
          <Suspense fallback={<Skeleton className="h-[500px] rounded-xl" />}>
            <div className="relative">
              <BeachesMap
                beaches={filtered}
                onSelectBeach={(beach) => setSelectedBeach(beach)}
              />
            </div>
          </Suspense>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((beach) => (
                <BeachCard
                  key={beach.id}
                  beach={beach}
                  onClick={() => setSelectedBeach(beach)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Waves className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">Nenhuma praia encontrada</p>
            <p className="text-sm">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </section>

      {/* Beach Detail Modal */}
      <AnimatePresence>
        {selectedBeach && (
          <BeachDetail
            beach={selectedBeach}
            onClose={() => setSelectedBeach(null)}
          />
        )}
      </AnimatePresence>

      <SiteFooter />
      <BottomNav />
    </div>
  );
};

/* ---- Beach Card ---- */
const BeachCard = ({ beach, onClick }: { beach: Beach; onClick: () => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    onClick={onClick}
    className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card"
  >
    <div className="relative h-64 overflow-hidden">
      <img
        src={beach.photo_url || "/placeholder.svg"}
        alt={beach.name}
        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        style={{ transform: "scale(1)", transitionDuration: "700ms" }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute top-3 left-3">
        <span
          className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-slate-900"
          style={{ background: "#f4c025" }}
        >
          {beach.region}
        </span>
      </div>
      {beach.wave_intensity && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
          <Waves className="w-3 h-3 text-cyan-400" />
          <span className="text-xs font-semibold text-white">{WAVE_LABELS[beach.wave_intensity] || beach.wave_intensity}</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-extrabold text-xl leading-tight drop-shadow-md mb-1 group-hover:text-[#f4c025] transition-colors">
          {beach.name}
        </h3>
        <div className="flex items-center gap-3 text-white/60 text-xs">
          {beach.difficulty_access && (
            <span className="flex items-center gap-1">
              <Footprints className="w-3 h-3" />
              {ACCESS_LABELS[beach.difficulty_access] || beach.difficulty_access}
            </span>
          )}
          {beach.length_meters && (
            <span className="flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {beach.length_meters >= 1000
                ? `${(beach.length_meters / 1000).toFixed(1)}km`
                : `${beach.length_meters}m`}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="p-4 space-y-3">
      <p className="text-muted-foreground text-sm line-clamp-2">
        {beach.description}
      </p>
      {beach.characteristics && beach.characteristics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {beach.characteristics.slice(0, 3).map((c) => (
            <Badge key={c} variant="secondary" className="text-xs">
              {CHAR_LABELS[c] || c}
            </Badge>
          ))}
        </div>
      )}
      <Link
        to={`/praias/${beach.slug}`}
        className="text-xs font-bold hover:underline inline-block"
        style={{ color: "#26C6A0" }}
        onClick={(e) => e.stopPropagation()}
      >
        Ver detalhes →
      </Link>
    </div>
  </motion.div>
);

/* ---- Beach Detail Modal ---- */
const BeachDetail = ({
  beach,
  onClose,
}: {
  beach: Beach;
  onClose: () => void;
}) => {
  const mapUrl = beach.latitude && beach.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${beach.longitude! - 0.01},${beach.latitude! - 0.008},${beach.longitude! + 0.01},${beach.latitude! + 0.008}&layer=mapnik&marker=${beach.latitude},${beach.longitude}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Image */}
        <div className="relative h-56 sm:h-72">
          <img
            src={beach.photo_url || "/placeholder.svg"}
            alt={beach.name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-card-hover rounded-t-2xl" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-foreground/30 text-primary-foreground hover:bg-foreground/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-primary text-primary-foreground mb-1">{beach.region}</Badge>
            <h2 className="text-primary-foreground font-display text-2xl sm:text-3xl font-bold drop-shadow-lg">
              {beach.name}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Description */}
          <p className="text-foreground/80 leading-relaxed">{beach.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {beach.wave_intensity && (
              <StatBox
                icon={<Waves className="w-4 h-4" />}
                label="Ondas"
                value={WAVE_LABELS[beach.wave_intensity] || beach.wave_intensity}
              />
            )}
            {beach.difficulty_access && (
              <StatBox
                icon={<Footprints className="w-4 h-4" />}
                label="Acesso"
                value={ACCESS_LABELS[beach.difficulty_access] || beach.difficulty_access}
              />
            )}
            {beach.length_meters && (
              <StatBox
                icon={<Ruler className="w-4 h-4" />}
                label="Extensão"
                value={
                  beach.length_meters >= 1000
                    ? `${(beach.length_meters / 1000).toFixed(1)} km`
                    : `${beach.length_meters} m`
                }
              />
            )}
            {beach.best_season && (
              <StatBox
                icon={<Sun className="w-4 h-4" />}
                label="Melhor época"
                value={
                  beach.best_season === "summer"
                    ? "Verão"
                    : beach.best_season === "all_year"
                    ? "Ano todo"
                    : "Inverno"
                }
              />
            )}
          </div>

          {/* Characteristics */}
          {beach.characteristics && beach.characteristics.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Características</h4>
              <div className="flex flex-wrap gap-2">
                {beach.characteristics.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">
                    {CHAR_LABELS[c] || c}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {mapUrl && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Localização
              </h4>
              <div className="rounded-xl overflow-hidden border border-border h-48">
                <iframe
                  src={mapUrl}
                  className="w-full h-full"
                  title={`Mapa - ${beach.name}`}
                  loading="lazy"
                />
              </div>
              <a
                href={`https://www.google.com/maps?q=${beach.latitude},${beach.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                Abrir no Google Maps →
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatBox = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-muted rounded-lg p-3 text-center">
    <div className="flex justify-center text-primary mb-1">{icon}</div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-semibold text-foreground">{value}</p>
  </div>
);

export default Beaches;
