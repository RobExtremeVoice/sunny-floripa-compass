import type { Database } from "@/integrations/supabase/types";

type FlightStatus = Database["public"]["Enums"]["flight_status"];

const statusConfig: Record<FlightStatus, { label: string; className: string }> = {
  scheduled: {
    label: "Programado",
    className: "bg-muted text-muted-foreground",
  },
  boarding: {
    label: "Embarque",
    className: "bg-ocean/15 text-ocean-deep",
  },
  departed: {
    label: "Decolou",
    className: "bg-tropical-light text-tropical",
  },
  in_air: {
    label: "Em Voo",
    className: "bg-ocean-light text-ocean-deep",
  },
  landed: {
    label: "Pousou",
    className: "bg-tropical-light text-tropical",
  },
  arrived: {
    label: "Chegou",
    className: "bg-tropical-light text-tropical",
  },
  delayed: {
    label: "Atrasado",
    className: "bg-sunset/15 text-sunset",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-destructive/15 text-destructive",
  },
};

const FlightStatusBadge = ({ status }: { status: FlightStatus }) => {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default FlightStatusBadge;
