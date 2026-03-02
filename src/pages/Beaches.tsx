import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Waves, Footprints, Ruler, Sun, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 bg-gradient-ocean text-primary-foreground overflow-hidden">
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
              Praias de Florianópolis
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-xl mb-8">
              Descubra as {beaches?.length || "42+"} praias da Ilha da Magia — de
              enseadas calmas a ondas perfeitas para surf.
            </p>
          </motion.div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
              <Input
                placeholder="Buscar praia..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-primary-foreground/15 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30"
              />
            </div>
          </div>

          {/* Region pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  region === r
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary-foreground/15 text-primary-foreground/80 hover:bg-primary-foreground/25"
                }`}
              >
                {r}
                {r !== "Todas" && regionCounts[r] && (
                  <span className="ml-1 opacity-70">({regionCounts[r]})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-10">
        <p className="text-muted-foreground text-sm mb-6">
          {filtered.length} praia{filtered.length !== 1 ? "s" : ""} encontrada
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
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
    className="group cursor-pointer rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-card"
  >
    <div className="relative h-52 overflow-hidden">
      <img
        src={beach.photo_url || "/placeholder.svg"}
        alt={beach.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-card-hover" />
      <div className="absolute bottom-3 left-3 right-3">
        <Badge
          variant="secondary"
          className="bg-primary-foreground/90 text-primary text-xs mb-1"
        >
          {beach.region}
        </Badge>
        <h3 className="text-primary-foreground font-display text-xl font-bold drop-shadow-md">
          {beach.name}
        </h3>
      </div>
    </div>
    <div className="p-4 space-y-3">
      <p className="text-muted-foreground text-sm line-clamp-2">
        {beach.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {beach.wave_intensity && (
          <Badge variant="outline" className="text-xs gap-1">
            <Waves className="w-3 h-3" />
            {WAVE_LABELS[beach.wave_intensity] || beach.wave_intensity}
          </Badge>
        )}
        {beach.difficulty_access && (
          <Badge variant="outline" className="text-xs gap-1">
            <Footprints className="w-3 h-3" />
            {ACCESS_LABELS[beach.difficulty_access] || beach.difficulty_access}
          </Badge>
        )}
        {beach.length_meters && (
          <Badge variant="outline" className="text-xs gap-1">
            <Ruler className="w-3 h-3" />
            {beach.length_meters >= 1000
              ? `${(beach.length_meters / 1000).toFixed(1)}km`
              : `${beach.length_meters}m`}
          </Badge>
        )}
      </div>
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
