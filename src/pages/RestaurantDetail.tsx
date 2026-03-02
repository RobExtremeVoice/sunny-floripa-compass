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
  UtensilsCrossed, Phone, Globe, Clock, Truck, BookOpen,
  DollarSign, Instagram,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<string, string> = {
  frutos_do_mar: "Frutos do Mar",
  acoriana: "Açoriana",
  internacional: "Internacional",
  cafes_doces: "Cafés & Doces",
};

const RestaurantDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: ["restaurant-reviews", restaurant?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurant_reviews")
        .select("*")
        .eq("restaurant_id", restaurant!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!restaurant?.id,
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

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Restaurante não encontrado</h1>
          <Link to="/gastronomia" className="text-primary hover:underline">← Voltar para gastronomia</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const mapUrl = restaurant.latitude && restaurant.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${Number(restaurant.longitude) - 0.008},${Number(restaurant.latitude) - 0.006},${Number(restaurant.longitude) + 0.008},${Number(restaurant.latitude) + 0.006}&layer=mapnik&marker=${restaurant.latitude},${restaurant.longitude}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 bg-gradient-sunset text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary-foreground/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to="/gastronomia"
            className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para gastronomia
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              {CATEGORY_LABELS[restaurant.category] || restaurant.category}
            </Badge>
            {avgRating && (
              <span className="flex items-center gap-1 text-primary-foreground/90 text-sm">
                <Star className="w-4 h-4 fill-current text-yellow-300" />
                {avgRating} ({reviews?.length} avaliação{reviews?.length !== 1 ? "ões" : ""})
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold drop-shadow-lg">
            {restaurant.name}
          </h1>
          {restaurant.neighborhood && (
            <p className="flex items-center gap-1.5 text-primary-foreground/70 mt-2">
              <MapPin className="w-4 h-4" /> {restaurant.neighborhood}, {restaurant.region}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">Sobre</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">{restaurant.description}</p>
            </div>

            {/* Specialties */}
            {restaurant.specialties && restaurant.specialties.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {(restaurant.specialties as string[]).map((s: string) => (
                    <Badge key={s} variant="secondary" className="px-3 py-1.5 text-sm">
                      {s}
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
              <ReviewForm restaurantId={restaurant.id} />
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
            {/* Info Card */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-4">
              <h3 className="font-semibold text-foreground">Informações</h3>
              <div className="space-y-3 text-sm">
                {restaurant.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <a href={`tel:${restaurant.phone}`} className="text-foreground/80 hover:text-primary transition-colors">
                      {restaurant.phone}
                    </a>
                  </div>
                )}
                {restaurant.opening_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground/80">{restaurant.opening_hours}</span>
                  </div>
                )}
                {restaurant.price_range && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary shrink-0" />
                    <PriceIndicator level={restaurant.price_range} />
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  {restaurant.has_delivery && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Truck className="w-3 h-3" /> Delivery
                    </Badge>
                  )}
                  {restaurant.has_reservation && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <BookOpen className="w-3 h-3" /> Reservas
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            {mapUrl && (
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Localização
                  </h3>
                </div>
                <div className="h-64">
                  <iframe src={mapUrl} className="w-full h-full" title={`Mapa - ${restaurant.name}`} loading="lazy" />
                </div>
                <div className="p-4">
                  <a
                    href={`https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Abrir no Google Maps →
                  </a>
                </div>
              </div>
            )}

            {/* Similar Restaurants */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-card">
              <h3 className="font-semibold text-foreground mb-3">Outros na mesma categoria</h3>
              <SimilarRestaurants currentSlug={slug!} category={restaurant.category} />
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
      <DollarSign
        key={n}
        className={`w-3.5 h-3.5 ${n <= level ? "text-foreground" : "text-muted-foreground/30"}`}
      />
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

const ReviewForm = ({ restaurantId }: { restaurantId: string }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("restaurant_reviews").insert({
        restaurant_id: restaurantId,
        author_name: name || "Visitante",
        rating,
        comment: comment || null,
        visit_date: new Date().toISOString().split("T")[0],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-reviews", restaurantId] });
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

const SimilarRestaurants = ({ currentSlug, category }: { currentSlug: string; category: string }) => {
  const { data: similar } = useQuery({
    queryKey: ["similar-restaurants", category, currentSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("name, slug, neighborhood, price_range")
        .eq("category", category)
        .neq("slug", currentSlug)
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-2">
      {similar?.map((r) => (
        <Link
          key={r.slug}
          to={`/gastronomia/${r.slug}`}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.neighborhood}</p>
          </div>
        </Link>
      ))}
      {(!similar || similar.length === 0) && (
        <p className="text-sm text-muted-foreground">Nenhum restaurante similar.</p>
      )}
    </div>
  );
};

export default RestaurantDetail;
