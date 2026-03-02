import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CreateTripDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState("Minha Viagem para Floripa");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numTravelers, setNumTravelers] = useState("2");
  const [notes, setNotes] = useState("");

  const createTrip = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Faça login primeiro");
      const { error } = await supabase.from("trips").insert({
        user_id: user.id,
        name,
        start_date: startDate || null,
        end_date: endDate || null,
        num_travelers: parseInt(numTravelers) || 2,
        notes: notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Viagem criada!");
      onOpenChange(false);
      resetForm();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetForm = () => {
    setName("Minha Viagem para Floripa");
    setStartDate("");
    setEndDate("");
    setNumTravelers("2");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Nova Viagem</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createTrip.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="trip-name">Nome da viagem</Label>
            <Input
              id="trip-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start-date">Ida</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Volta</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelers">Número de viajantes</Label>
            <Input
              id="travelers"
              type="number"
              min="1"
              max="20"
              value={numTravelers}
              onChange={(e) => setNumTravelers(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Preferências, orçamento, interesses..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={createTrip.isPending}
            className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-90"
          >
            {createTrip.isPending ? "Criando..." : "Criar Viagem"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTripDialog;
