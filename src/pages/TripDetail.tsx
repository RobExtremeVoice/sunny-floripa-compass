import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import AddItemDialog from "@/components/trip/AddItemDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Plus, Trash2, Calendar, Users, Waves, UtensilsCrossed, Compass, GripVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ITEM_TYPE_CONFIG = {
  beach: { label: "Praia", icon: Waves, color: "bg-ocean/10 text-ocean-deep border-ocean/20" },
  restaurant: { label: "Restaurante", icon: UtensilsCrossed, color: "bg-sunset/10 text-sunset border-sunset/20" },
  activity: { label: "Atividade", icon: Compass, color: "bg-tropical/10 text-tropical border-tropical/20" },
} as const;

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [addItemType, setAddItemType] = useState<"beach" | "restaurant" | "activity">("beach");

  const { data: trip, isLoading: tripLoading } = useQuery({
    queryKey: ["trip", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ["trip-items", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trip_items")
        .select("*")
        .eq("trip_id", id!)
        .order("day_number", { ascending: true, nullsFirst: false })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  // Fetch names for each item
  const { data: itemDetails } = useQuery({
    queryKey: ["trip-item-details", items],
    queryFn: async () => {
      if (!items || items.length === 0) return {};
      const details: Record<string, { name: string; slug: string }> = {};

      const beachIds = items.filter((i) => i.item_type === "beach").map((i) => i.item_id);
      const restaurantIds = items.filter((i) => i.item_type === "restaurant").map((i) => i.item_id);
      const activityIds = items.filter((i) => i.item_type === "activity").map((i) => i.item_id);

      const [beaches, restaurants, activities] = await Promise.all([
        beachIds.length > 0
          ? supabase.from("beaches").select("id, name, slug").in("id", beachIds)
          : { data: [] },
        restaurantIds.length > 0
          ? supabase.from("restaurants").select("id, name, slug").in("id", restaurantIds)
          : { data: [] },
        activityIds.length > 0
          ? supabase.from("activities").select("id, name, slug").in("id", activityIds)
          : { data: [] },
      ]);

      (beaches.data ?? []).forEach((b) => (details[b.id] = { name: b.name, slug: `/praias/${b.slug}` }));
      (restaurants.data ?? []).forEach((r) => (details[r.id] = { name: r.name, slug: `/gastronomia/${r.slug}` }));
      (activities.data ?? []).forEach((a) => (details[a.id] = { name: a.name, slug: `/entretenimento/${a.slug}` }));

      return details;
    },
    enabled: !!items && items.length > 0,
  });

  const deleteItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("trip_items").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-items", id] });
      queryClient.invalidateQueries({ queryKey: ["trip-item-count"] });
      toast.success("Item removido");
    },
  });

  const openAddItem = (type: "beach" | "restaurant" | "activity") => {
    setAddItemType(type);
    setAddItemOpen(true);
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : null;

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-28 container mx-auto px-4">
          <Skeleton className="h-40 w-full rounded-xl mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-28 container mx-auto px-4 text-center py-20">
          <p className="text-muted-foreground">Viagem não encontrada.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/planejar")}>
            Voltar
          </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // Group items by day
  const groupedItems: Record<string, typeof items> = {};
  (items ?? []).forEach((item) => {
    const key = item.day_number ? `Dia ${item.day_number}` : "Sem dia definido";
    if (!groupedItems[key]) groupedItems[key] = [];
    groupedItems[key]!.push(item);
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO title={trip.name} url={`/planejar/${trip.id}`} noIndex />
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-20 pb-10 md:pt-28 md:pb-14 bg-gradient-to-br from-foreground to-foreground/80 text-primary-foreground">
        <div className="container mx-auto px-4 relative z-10">
          <button
            onClick={() => navigate("/planejar")}
            className="flex items-center gap-1 text-primary-foreground/60 hover:text-primary-foreground mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Minhas Viagens
          </button>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{trip.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/70">
            {trip.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(trip.start_date)}
                {trip.end_date && ` — ${formatDate(trip.end_date)}`}
              </span>
            )}
            {trip.num_travelers && (
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {trip.num_travelers} viajante{trip.num_travelers > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Add buttons */}
      <section className="container mx-auto px-4 -mt-5 relative z-20">
        <div className="flex flex-wrap gap-2">
          {(["beach", "restaurant", "activity"] as const).map((type) => {
            const cfg = ITEM_TYPE_CONFIG[type];
            const Icon = cfg.icon;
            return (
              <Button
                key={type}
                variant="outline"
                onClick={() => openAddItem(type)}
                className="bg-card shadow-card hover:shadow-card-hover"
              >
                <Icon className="w-4 h-4 mr-2" />
                Adicionar {cfg.label}
              </Button>
            );
          })}
        </div>
      </section>

      {/* Items list */}
      <section className="container mx-auto px-4 py-8">
        {itemsLoading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : !items || items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Compass className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Nenhum lugar adicionado</p>
            <p className="text-sm">Use os botões acima para adicionar praias, restaurantes e atividades.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([day, dayItems]) => (
              <div key={day}>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">{day}</h2>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {dayItems!.map((item) => {
                      const cfg = ITEM_TYPE_CONFIG[item.item_type as keyof typeof ITEM_TYPE_CONFIG];
                      const Icon = cfg.icon;
                      const detail = itemDetails?.[item.item_id];
                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-3 bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-card transition-shadow"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                          <Badge className={`text-xs border shrink-0 ${cfg.color}`}>
                            <Icon className="w-3 h-3 mr-1" />
                            {cfg.label}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            {detail ? (
                              <a
                                href={detail.slug}
                                className="font-medium text-foreground hover:text-primary transition-colors"
                              >
                                {detail.name}
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-sm">Carregando...</span>
                            )}
                            {item.notes && (
                              <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>
                            )}
                            {item.time_slot && (
                              <span className="text-xs text-muted-foreground">{item.time_slot}</span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteItem.mutate(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AddItemDialog
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        tripId={id!}
        itemType={addItemType}
      />
      <SiteFooter />
    </div>
  );
};

export default TripDetail;
