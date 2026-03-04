import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Flight = {
  id: string;
  flight_number: string;
  airline_code: string;
  origin: string;
  destination: string;
  scheduled_time: string;
  status: string;
  is_arrival: boolean;
  gate: string | null;
  terminal: string | null;
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  boarding: "bg-amber-100 text-amber-700",
  departed: "bg-green-100 text-green-700",
  arrived: "bg-slate-100 text-slate-600",
  delayed: "bg-red-100 text-red-600",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabel: Record<string, string> = {
  scheduled: "Programado",
  boarding: "Embarque",
  departed: "Partiu",
  arrived: "Chegou",
  delayed: "Atrasado",
  cancelled: "Cancelado",
};

export default function AdminFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"arrival" | "departure">("arrival");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("flights")
      .select("id, flight_number, airline_code, origin, destination, scheduled_time, status, is_arrival, gate, terminal")
      .eq("is_arrival", tab === "arrival")
      .order("scheduled_time")
      .then(({ data }) => { setFlights(data ?? []); setLoading(false); });
  }, [tab]);

  const filtered = flights.filter((f) =>
    f.flight_number.toLowerCase().includes(search.toLowerCase()) ||
    f.airline_code.toLowerCase().includes(search.toLowerCase()) ||
    f.origin.toLowerCase().includes(search.toLowerCase()) ||
    f.destination.toLowerCase().includes(search.toLowerCase())
  );

  function formatTime(dt: string) {
    return new Date(dt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(dt: string) {
    return new Date(dt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Voos</h2>
        <p className="text-slate-500 text-sm">Painel de chegadas e partidas</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["arrival", "departure"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
              tab === t
                ? "bg-primary text-slate-900"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {t === "arrival" ? "flight_land" : "flight_takeoff"}
            </span>
            {t === "arrival" ? "Chegadas" : "Partidas"}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar voo, companhia, origem..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 mb-6"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">Nenhum voo encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Voo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{tab === "arrival" ? "Origem" : "Destino"}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Horário</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Portão</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{f.flight_number}</p>
                      <p className="text-xs text-slate-400">{f.airline_code}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                      {tab === "arrival" ? f.origin : f.destination}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-medium text-slate-900 dark:text-white">{formatTime(f.scheduled_time)}</p>
                      <p className="text-xs text-slate-400">{formatDate(f.scheduled_time)}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-600 dark:text-slate-400 text-xs">
                      {f.gate ? `Gate ${f.gate}` : "—"}
                      {f.terminal ? ` · T${f.terminal}` : ""}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[f.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {statusLabel[f.status] ?? f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
