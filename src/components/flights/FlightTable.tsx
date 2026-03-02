import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";
import FlightStatusBadge from "./FlightStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane } from "lucide-react";

type Flight = Tables<"flights">;

interface FlightTableProps {
  flights: Flight[];
  airlineMap: Map<string, string>;
  isLoading: boolean;
  type: "arrival" | "departure" | "all";
}

const FlightTable = ({ flights, airlineMap, isLoading, type }: FlightTableProps) => {
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="p-12 text-center">
        <Plane className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">Nenhum voo encontrado</p>
        <p className="text-muted-foreground/60 text-sm mt-1">Tente ajustar sua busca</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-3">
              Voo
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-3">
              Companhia
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-3">
              {type === "arrival" ? "Origem" : type === "departure" ? "Destino" : "Rota"}
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-3">
              Horário
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-3 hidden md:table-cell">
              Terminal
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-3 hidden md:table-cell">
              Portão
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 md:px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr
              key={flight.id}
              className="border-b border-border/50 hover:bg-muted/20 transition-colors"
            >
              <td className="px-4 md:px-6 py-4 font-semibold text-foreground text-sm">
                {flight.flight_number}
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-foreground/80">
                {airlineMap.get(flight.airline_code) ?? flight.airline_code}
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-foreground/80">
                {type === "all" ? (
                  <span>
                    {flight.origin} → {flight.destination}
                  </span>
                ) : flight.is_arrival ? (
                  flight.origin
                ) : (
                  flight.destination
                )}
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-foreground/80">
                {format(new Date(flight.scheduled_time), "HH:mm", { locale: ptBR })}
                {flight.estimated_time &&
                  flight.estimated_time !== flight.scheduled_time && (
                    <span className="block text-xs text-sunset">
                      Est: {format(new Date(flight.estimated_time), "HH:mm", { locale: ptBR })}
                    </span>
                  )}
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-foreground/80 hidden md:table-cell">
                {flight.terminal ?? "—"}
              </td>
              <td className="px-4 md:px-6 py-4 text-sm text-foreground/80 hidden md:table-cell">
                {flight.gate ?? "—"}
              </td>
              <td className="px-4 md:px-6 py-4">
                <FlightStatusBadge status={flight.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightTable;
