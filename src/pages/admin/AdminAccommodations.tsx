import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Accommodation = {
  id: string;
  name: string;
  hotel_type: string | null;
  neighborhood: string | null;
  star_rating: number | null;
  price_per_night: number | null;
  review_score: number | null;
  review_count: number | null;
  photo_url: string | null;
  booking_url: string | null;
};

export default function AdminAccommodations() {
  const [items, setItems] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("accommodations")
      .select("id, name, hotel_type, neighborhood, star_rating, price_per_night, review_score, review_count, photo_url, booking_url")
      .order("name")
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  const filtered = items.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.neighborhood ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (a.hotel_type ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hospedagem</h2>
        <p className="text-slate-500 text-sm">{items.length} propriedades cadastradas</p>
      </div>

      <div className="flex items-center gap-2 mb-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-xs text-blue-700 dark:text-blue-300">
        <span className="material-symbols-outlined text-[16px]">info</span>
        Dados sincronizados via API de parceiros. Edições manuais não são persistidas após re-sincronização.
      </div>

      <input
        type="text"
        placeholder="Buscar hospedagem, bairro ou tipo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-96 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 mb-6"
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Estrelas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Diária</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Avaliação</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {a.photo_url && (
                          <img src={a.photo_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{a.name}</p>
                          {a.neighborhood && <p className="text-xs text-slate-400">{a.neighborhood}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                        {a.hotel_type ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs">
                      {a.star_rating ? "⭐".repeat(a.star_rating) : "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs font-medium text-slate-700 dark:text-slate-300">
                      {a.price_per_night
                        ? `R$ ${a.price_per_night.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {a.review_score ? (
                        <span className="flex items-center gap-1 text-xs text-slate-700 dark:text-slate-300">
                          <span className="material-symbols-outlined text-amber-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {a.review_score.toFixed(1)}
                          <span className="text-slate-400">({a.review_count ?? 0})</span>
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        {a.booking_url && (
                          <a
                            href={a.booking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Ver no Booking"
                          >
                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                          </a>
                        )}
                      </div>
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
