import type { Database } from "@/integrations/supabase/types";

type FlightStatus = Database["public"]["Enums"]["flight_status"];

const statusConfig: Record<FlightStatus, { label: string; bg: string; color: string; dot: string }> = {
  scheduled: {
    label: "Programado",
    bg: "rgba(100,116,139,0.12)",
    color: "#64748b",
    dot: "#94a3b8",
  },
  boarding: {
    label: "Embarque",
    bg: "rgba(0,168,232,0.12)",
    color: "#00A8E8",
    dot: "#00A8E8",
  },
  departed: {
    label: "Decolou",
    bg: "rgba(38,198,160,0.12)",
    color: "#26C6A0",
    dot: "#26C6A0",
  },
  in_air: {
    label: "Em Voo",
    bg: "rgba(0,168,232,0.12)",
    color: "#00A8E8",
    dot: "#00A8E8",
  },
  landed: {
    label: "Pousou",
    bg: "rgba(38,198,160,0.12)",
    color: "#26C6A0",
    dot: "#26C6A0",
  },
  arrived: {
    label: "Chegou",
    bg: "rgba(38,198,160,0.15)",
    color: "#1aad8c",
    dot: "#26C6A0",
  },
  delayed: {
    label: "Atrasado",
    bg: "rgba(255,111,97,0.12)",
    color: "#FF6F61",
    dot: "#FF6F61",
  },
  cancelled: {
    label: "Cancelado",
    bg: "rgba(239,68,68,0.12)",
    color: "#ef4444",
    dot: "#ef4444",
  },
};

const FlightStatusBadge = ({ status }: { status: FlightStatus }) => {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
};

export default FlightStatusBadge;
