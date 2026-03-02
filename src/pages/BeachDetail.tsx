import { useState } from "react";
import SEO from "@/components/SEO";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin, Waves, Footprints, Ruler, Sun, Star, ArrowLeft,
  ChevronLeft, ChevronRight, Send, User, Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const WAVE_LABELS: Record<string, string> = { calm: "Calmas", moderate: "Moderadas", strong: "Fortes" };
const ACCESS_LABELS: Record<string, string> = { easy: "Fácil", moderate: "Moderado", hard: "Trilha" };
const SAND_LABELS: Record<string, string> = { fine_white: "Areia fina e branca", coarse: "Areia grossa", dark: "Areia escura" };
const SEASON_LABELS: Record<string, string> = { summer: "Verão", all_year: "Ano todo", winter: "Inverno" };
const CHAR_LABELS: Record<string, string> = {
  surf: "Surf", calm: "Calma", family: "Família", nature: "Natureza", urban: "Urbana",
  wild: "Selvagem", trails: "Trilhas", nightlife: "Vida noturna", fishing: "Pesca",
  dunes: "Dunas", adventure: "Aventura", history: "História", culture: "Cultura",
  gastronomy: "Gastronomia", sports: "Esportes", sunset: "Pôr do sol", beach_clubs: "Beach clubs",
  naturism: "Naturismo", snorkeling: "Snorkeling",
};
const INFRA_LABELS: Record<string, string> = {
  parking: "Estacionamento", restaurants: "Restaurantes", showers: "Chuveiros",
  lifeguard: "Salva-vidas", beach_clubs: "Beach clubs",
};

const BeachDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data: beach, isLoading } = useQuery({
    queryKey: ["beach", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beaches")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: ["beach-reviews", beach?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beach_reviews")
        .select("*")
        .eq("beach_id", beach!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!beach?.id,
  });

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-20 container mx-auto px-4">
          <Skeleton className="h-96 w-full rounded-2xl mb-8" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </div>
    );
  }

  if (!beach) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Praia não encontrada</h1>
          <Link to="/praias" className="text-primary hover:underline">← Voltar para praias</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const mapUrl = beach.latitude && beach.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Number(beach.longitude) - 0.012},${Number(beach.latitude) - 0.009},${Number(beach.longitude) + 0.012},${Number(beach.latitude) + 0.009}&layer=mapnik&marker=${beach.latitude},${beach.longitude}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${beach.name} – Praia em Florianópolis`}
        description={beach.description || `Conheça a Praia ${beach.name} em Florianópolis: fotos, ondas, infraestrutura e avaliações de visitantes.`}
        image={beach.photo_url || undefined}
        url={`/praias/${slug}`}
      />
      <SiteHeader />

      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={beach.photo_url || "/placeholder.svg"}
          alt={beach.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <Link
              to="/praias"
              className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para praias
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary text-primary-foreground">{beach.region}</Badge>
              {avgRating && (
                <span className="flex items-center gap-1 text-primary-foreground/90 text-sm">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  {avgRating} ({reviews?.length} avaliação{reviews?.length !== 1 ? "ões" : ""})
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-lg">
              {beach.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">Sobre a praia</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">{beach.description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {beach.wave_intensity && (
                <StatCard icon={<Waves className="w-5 h-5" />} label="Ondas" value={WAVE_LABELS[beach.wave_intensity] || beach.wave_intensity} />
              )}
              {beach.difficulty_access && (
                <StatCard icon={<Footprints className="w-5 h-5" />} label="Acesso" value={ACCESS_LABELS[beach.difficulty_access] || beach.difficulty_access} />
              )}
              {beach.length_meters && (
                <StatCard icon={<Ruler className="w-5 h-5" />} label="Extensão" value={beach.length_meters >= 1000 ? `${(beach.length_meters / 1000).toFixed(1)} km` : `${beach.length_meters} m`} />
              )}
              {beach.best_season && (
                <StatCard icon={<Sun className="w-5 h-5" />} label="Melhor época" value={SEASON_LABELS[beach.best_season] || beach.best_season} />
              )}
            </div>

            {/* Sand & Details */}
            {beach.sand_type && (
              <div className="bg-muted rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-2">Tipo de Areia</h3>
                <p className="text-muted-foreground">{SAND_LABELS[beach.sand_type] || beach.sand_type}</p>
              </div>
            )}

            {/* Characteristics */}
            {beach.characteristics && beach.characteristics.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {beach.characteristics.map((c: string) => (
                    <Badge key={c} variant="secondary" className="px-3 py-1.5 text-sm">
                      {CHAR_LABELS[c] || c}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Infrastructure */}
            {beach.infrastructure && beach.infrastructure.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Infraestrutura</h3>
                <div className="flex flex-wrap gap-2">
                  {beach.infrastructure.map((i: string) => (
                    <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm">
                      {INFRA_LABELS[i] || i}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Avaliações {reviews?.length ? `(${reviews.length})` : ""}
              </h3>
              <ReviewForm beachId={beach.id} />
              <div className="mt-6 space-y-4">
                {reviews?.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                {(!reviews || reviews.length === 0) && (
                  <p className="text-muted-foreground text-sm py-4">Nenhuma avaliação ainda. Seja o primeiro!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            {mapUrl && (
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Localização
                  </h3>
                </div>
                <div className="h-64">
                  <iframe src={mapUrl} className="w-full h-full" title={`Mapa - ${beach.name}`} loading="lazy" />
                </div>
                <div className="p-4">
                  <a
                    href={`https://www.google.com/maps?q=${beach.latitude},${beach.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Abrir no Google Maps →
                  </a>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-4">
              <h3 className="font-semibold text-foreground">Informações Rápidas</h3>
              <div className="space-y-3 text-sm">
                <InfoRow label="Região" value={beach.region} />
                {beach.wave_intensity && <InfoRow label="Ondas" value={WAVE_LABELS[beach.wave_intensity] || beach.wave_intensity} />}
                {beach.difficulty_access && <InfoRow label="Acesso" value={ACCESS_LABELS[beach.difficulty_access] || beach.difficulty_access} />}
                {beach.sand_type && <InfoRow label="Areia" value={SAND_LABELS[beach.sand_type] || beach.sand_type} />}
                {beach.best_season && <InfoRow label="Época" value={SEASON_LABELS[beach.best_season] || beach.best_season} />}
                {beach.length_meters && (
                  <InfoRow label="Extensão" value={beach.length_meters >= 1000 ? `${(beach.length_meters / 1000).toFixed(1)} km` : `${beach.length_meters} m`} />
                )}
              </div>
            </div>

            {/* Other beaches */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-card">
              <h3 className="font-semibold text-foreground mb-3">Praias próximas</h3>
              <NearbyBeaches currentSlug={slug!} region={beach.region} />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

/* ---- Sub Components ---- */

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-card rounded-xl border border-border p-4 text-center shadow-card">
    <div className="flex justify-center text-primary mb-2">{icon}</div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-bold text-foreground">{value}</p>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

const Stars = ({ count, interactive, onChange }: { count: number; interactive?: boolean; onChange?: (n: number) => void }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className={`w-4 h-4 ${n <= count ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
        onClick={interactive ? () => onChange?.(n) : undefined}
      />
    ))}
  </div>
);

const ReviewForm = ({ beachId }: { beachId: string }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("beach_reviews").insert({
        beach_id: beachId,
        author_name: name || "Visitante",
        rating,
        comment: comment || null,
        visit_date: new Date().toISOString().split("T")[0],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beach-reviews", beachId] });
      setName("");
      setComment("");
      setRating(5);
      toast.success("Avaliação enviada com sucesso!");
    },
    onError: () => toast.error("Erro ao enviar avaliação."),
  });

  return (
    <div className="bg-muted rounded-xl p-5 space-y-3">
      <h4 className="font-semibold text-foreground text-sm">Deixe sua avaliação</h4>
      <Stars count={rating} interactive onChange={setRating} />
      <Input placeholder="Seu nome (opcional)" value={name} onChange={(e) => setName(e.target.value)} className="bg-card" />
      <textarea
        placeholder="Conte como foi sua experiência..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px] resize-none"
      />
      <Button size="sm" onClick={() => mutation.mutate()} disabled={mutation.isPending} className="gap-1">
        <Send className="w-3 h-3" /> {mutation.isPending ? "Enviando..." : "Enviar"}
      </Button>
    </div>
  );
};

const ReviewCard = ({ review }: { review: any }) => (
  <div className="bg-card rounded-xl border border-border p-4 space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{review.author_name}</p>
          {review.visit_date && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(review.visit_date).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
      <Stars count={review.rating} />
    </div>
    {review.comment && <p className="text-sm text-foreground/80">{review.comment}</p>}
  </div>
);

const NearbyBeaches = ({ currentSlug, region }: { currentSlug: string; region: string }) => {
  const { data: nearby } = useQuery({
    queryKey: ["nearby-beaches", region, currentSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beaches")
        .select("name, slug, photo_url, wave_intensity")
        .eq("region", region)
        .neq("slug", currentSlug)
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-2">
      {nearby?.map((b) => (
        <Link
          key={b.slug}
          to={`/praias/${b.slug}`}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
        >
          <img
            src={b.photo_url || "/placeholder.svg"}
            alt={b.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{b.name}</p>
            {b.wave_intensity && (
              <p className="text-xs text-muted-foreground">{WAVE_LABELS[b.wave_intensity] || b.wave_intensity}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BeachDetail;
