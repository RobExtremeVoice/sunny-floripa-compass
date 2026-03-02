import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Plus, Waves, UtensilsCrossed, Compass } from "lucide-react";
import { toast } from "sonner";

const TYPE_CONFIG = {
  beach: { label: "Praia", table: "beaches" as const, icon: Waves },
  restaurant: { label: "Restaurante", table: "restaurants" as const, icon: UtensilsCrossed },
  activity: { label: "Atividade", table: "activities" as const, icon: Compass },
};

const AddItemDialog = ({
  open,
  onOpenChange,
  tripId,
  itemType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  itemType: "beach" | "restaurant" | "activity";
}) => {
  const [search, setSearch] = useState("");
  const [dayNumber, setDayNumber] = useState("");
  const queryClient = useQueryClient();
  const cfg = TYPE_CONFIG[itemType];

  const { data: options, isLoading } = useQuery({
    queryKey: [cfg.table, "search", search],
    queryFn: async () => {
      let query = supabase.from(cfg.table).select("id, name").order("name").limit(20);
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const addItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("trip_items").insert({
        trip_id: tripId,
        item_type: itemType,
        item_id: itemId,
        day_number: dayNumber ? parseInt(dayNumber) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip-items", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trip-item-count"] });
      toast.success(`${cfg.label} adicionado(a) ao roteiro!`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const Icon = cfg.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Icon className="w-5 h-5" />
            Adicionar {cfg.label}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Dia da viagem (opcional)</Label>
            <Input
              type="number"
              min="1"
              max="30"
              placeholder="Ex: 1, 2, 3..."
              value={dayNumber}
              onChange={(e) => setDayNumber(e.target.value)}
            />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Buscar ${cfg.label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Carregando...</p>
            ) : !options || options.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum resultado encontrado
              </p>
            ) : (
              options.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addItem.mutate(item.id)}
                  disabled={addItem.isPending}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors text-left"
                >
                  <span className="font-medium">{item.name}</span>
                  <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
