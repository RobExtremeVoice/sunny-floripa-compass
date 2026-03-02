import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import TripCard from "@/components/trip/TripCard";
import CreateTripDialog from "@/components/trip/CreateTripDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Map, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const TripPlanner = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: trips, isLoading } = useQuery({
    queryKey: ["trips", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteTrip = useMutation({
    mutationFn: async (tripId: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", tripId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Viagem removida");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-28 container mx-auto px-4">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Planeje sua Viagem" url="/planejar" />
        <SiteHeader />
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-4 text-center max-w-lg">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-ocean flex items-center justify-center">
                <Map className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Planeje sua Viagem
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Crie roteiros personalizados salvando praias, restaurantes e atividades favoritas.
                Entre na sua conta para começar.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-ocean text-primary-foreground hover:opacity-90 text-base px-8 py-6"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Entrar ou Criar Conta
              </Button>
            </motion.div>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Minhas Viagens" url="/planejar" />
      <SiteHeader />

      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 bg-gradient-to-br from-foreground to-foreground/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Map className="w-5 h-5 text-primary-foreground/70" />
              <span className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">
                Trip Planner
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-5xl font-bold mb-2">Minhas Viagens</h1>
                <p className="text-primary-foreground/70 text-lg">
                  Organize roteiros com praias, restaurantes e atividades.
                </p>
              </div>
              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 shrink-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Viagem
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : !trips || trips.length === 0 ? (
          <div className="text-center py-20">
            <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">Nenhuma viagem criada ainda</p>
            <p className="text-sm text-muted-foreground mb-6">
              Crie sua primeira viagem e comece a salvar seus lugares favoritos.
            </p>
            <Button
              onClick={() => setCreateOpen(true)}
              className="bg-gradient-ocean text-primary-foreground hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Viagem
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDelete={() => deleteTrip.mutate(trip.id)}
              />
            ))}
          </div>
        )}
      </section>

      <CreateTripDialog open={createOpen} onOpenChange={setCreateOpen} />
      <SiteFooter />
    </div>
  );
};

export default TripPlanner;
