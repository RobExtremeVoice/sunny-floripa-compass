import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Trip = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  num_travelers: number | null;
  notes: string | null;
  created_at: string;
};

const TripCard = ({ trip, onDelete }: { trip: Trip; onDelete: () => void }) => {
  const { data: itemCount } = useQuery({
    queryKey: ["trip-item-count", trip.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("trip_items")
        .select("*", { count: "exact", head: true })
        .eq("trip_id", trip.id);
      if (error) throw error;
      return count ?? 0;
    },
  });

  const formatDate = (d: string | null) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" }) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link to={`/planejar/${trip.id}`}>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-all h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {trip.name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive -mr-2 -mt-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {trip.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{trip.notes}</p>
          )}

          <div className="mt-auto flex flex-wrap gap-3 text-xs text-muted-foreground">
            {trip.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(trip.start_date)}
                {trip.end_date && ` — ${formatDate(trip.end_date)}`}
              </span>
            )}
            {trip.num_travelers && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {trip.num_travelers} viajante{trip.num_travelers > 1 ? "s" : ""}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {itemCount ?? 0} lugar{(itemCount ?? 0) !== 1 ? "es" : ""}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TripCard;
