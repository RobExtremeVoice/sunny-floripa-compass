import { useState } from "react";
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
  MapPin, Star, ArrowLeft, Send, User, Calendar,
  Ticket, Phone, Globe, Clock, DollarSign, TreePine,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<string, string> = {
  trilhas_natureza: "Trilhas & Natureza",
  passeios_barco: "Passeios de Barco",
  esportes_aventura: "Esportes & Aventura",
  vida_noturna: "Vida Noturna",
  cultura_historia: "Cultura & História",
  familia_criancas: "Família & Crianças",
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${m}min` : `${h} horas`;
};

const EntertainmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: ["activity-reviews", activity?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_reviews")
        .select("*")
        .eq("activity_id", activity!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!activity?.id,
  });

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-20 container mx-auto px-4">
          <Skeleton className="h-72 w-full rounded-2xl mb-8" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Atividade não encontrada</h1>
          <Link to="/entretenimento" className="text-primary hover:underline">← Voltar para entretenimento</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const mapUrl = activity.latitude && activity.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Number(activity.longitude) - 0.008},${Number(activity.latitude) - 0.006},${Number(activity.longitude) + 0.008},${Number(activity.latitude) + 0.006}&layer=mapnik&marker=${activity.latitude},${activity.longitude}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[55vh] overflow-hidden">
        {activity.photo_url ? (
          <img src={activity.photo_url} alt={activity.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-ocean" />
        )}
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <Link to="/entretenimento" className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar para entretenimento
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary text-primary-foreground">
                {CATEGORY_LABELS[activity.category] || activity.category}
              </Badge>
              {activity.is_free && <Badge className="bg-emerald-500 text-white">Gratuito</Badge>}
              {avgRating && (
                <span className="flex items-center gap-1 text-primary-foreground/90 text-sm">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  {avgRating} ({reviews?.length} avaliação{reviews?.length !== 1 ? "ões" : ""})
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-lg">
              {activity.name}
            </h1>
            {activity.neighborhood && (
              <p className="flex items-center gap-1.5 text-primary-foreground/70 mt-2">
                <MapPin className="w-4 h-4" /> {activity.neighborhood}, {activity.region}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">Sobre</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">{activity.description}</p>
            </div>

            {activity.highlights && (activity.highlights as string[]).length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Destaques</h3>
                <div className="flex flex-wrap gap-2">
                  {(activity.highlights as string[]).map((h: string) => (
                    <Badge key={h} variant="secondary" className="px-3 py-1.5 text-sm">{h}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">
                Avaliações {reviews?.length ? `(${reviews.length})` : ""}
              </h3>
              <ReviewForm activityId={activity.id} />
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
            <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-4">
              <h3 className="font-semibold text-foreground">Informações</h3>
              <div className="space-y-3 text-sm">
                {activity.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{activity.address}</span>
                  </div>
                )}
                {activity.duration_minutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground/80">Duração: {formatDuration(activity.duration_minutes)}</span>
                  </div>
                )}
                {activity.opening_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground/80">{activity.opening_hours}</span>
                  </div>
                )}
                {activity.difficulty && (
                  <div className="flex items-center gap-2">
                    <TreePine className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground/80">Dificuldade: {activity.difficulty}</span>
                  </div>
                )}
                {activity.best_time && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground/80">Melhor horário: {activity.best_time}</span>
                  </div>
                )}
                {activity.price_range && !activity.is_free && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary shrink-0" />
                    <PriceIndicator level={activity.price_range} />
                  </div>
                )}
                {activity.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <a href={`tel:${activity.phone}`} className="text-foreground/80 hover:text-primary transition-colors">
                      {activity.phone}
                    </a>
                  </div>
                )}
                {activity.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary shrink-0" />
                    <a href={activity.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs truncate">
                      {activity.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {mapUrl && (
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Localização
                  </h3>
                </div>
                <div className="h-64">
                  <iframe src={mapUrl} className="w-full h-full" title={`Mapa - ${activity.name}`} loading="lazy" />
                </div>
                <div className="p-4">
                  <a
                    href={`https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Abrir no Google Maps →
                  </a>
                </div>
              </div>
            )}

            <div className="bg-card rounded-xl border border-border p-5 shadow-card">
              <h3 className="font-semibold text-foreground mb-3">Outras na mesma categoria</h3>
              <SimilarActivities currentSlug={slug!} category={activity.category} />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

/* ---- Sub Components ---- */
const PriceIndicator = ({ level }: { level: number }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4].map((n) => (
      <DollarSign key={n} className={`w-3.5 h-3.5 ${n <= level ? "text-foreground" : "text-muted-foreground/30"}`} />
    ))}
  </span>
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

const ReviewForm = ({ activityId }: { activityId: string }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("activity_reviews").insert({
        activity_id: activityId,
        author_name: name || "Visitante",
        rating,
        comment: comment || null,
        visit_date: new Date().toISOString().split("T")[0],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-reviews", activityId] });
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

const SimilarActivities = ({ currentSlug, category }: { currentSlug: string; category: string }) => {
  const { data: similar } = useQuery({
    queryKey: ["similar-activities", category, currentSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("name, slug, neighborhood, price_range")
        .eq("category", category as any)
        .neq("slug", currentSlug)
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-2">
      {similar?.map((a) => (
        <Link
          key={a.slug}
          to={`/entretenimento/${a.slug}`}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Ticket className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{a.name}</p>
            <p className="text-xs text-muted-foreground">{a.neighborhood}</p>
          </div>
        </Link>
      ))}
      {(!similar || similar.length === 0) && (
        <p className="text-sm text-muted-foreground">Nenhuma atividade similar.</p>
      )}
    </div>
  );
};

export default EntertainmentDetail;
