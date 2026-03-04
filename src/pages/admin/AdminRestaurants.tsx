import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  cuisine_type: string | null;
  neighborhood: string | null;
  price_range: number | null;
  rating: number | null;
  is_featured: boolean | null;
  photo_url: string | null;
};

export default function AdminRestaurants() {
  const [items, setItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("restaurants")
      .select("id, name, slug, cuisine_type, neighborhood, price_range, rating, is_featured, photo_url")
      .order("name")
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  async function toggleFeatured(item: Restaurant) {
    setToggling(item.id);
    await supabase.from("restaurants").update({ is_featured: !item.is_featured }).eq("id", item.id);
    setItems((prev) => prev.map((r) => (r.id === item.id ? { ...r, is_featured: !r.is_featured } : r)));
    setToggling(null);
  }

  const filtered = items.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.neighborhood ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (r.cuisine_type ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const priceLabel = (p: number | null) => {
    if (!p) return "—";
    return "R$".repeat(p);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Restaurantes</h2>
        <p className="text-slate-500 text-sm">{items.length} restaurantes cadastrados</p>
      </div>

      <input
        type="text"
        placeholder="Buscar restaurante, bairro ou culinária..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 mb-6"
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Culinária</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Preço</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Nota</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Destaque</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.photo_url && (
                          <img src={`${r.photo_url}&w=80&q=60`} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{r.name}</p>
                          {r.neighborhood && <p className="text-xs text-slate-400">{r.neighborhood}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                        {r.cuisine_type ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-amber-600 font-medium text-xs hidden lg:table-cell">{priceLabel(r.price_range)}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {r.rating ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                          <span className="material-symbols-outlined text-amber-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {r.rating.toFixed(1)}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(r)}
                        disabled={toggling === r.id}
                        className={`p-1.5 rounded-lg transition-colors ${r.is_featured ? "text-amber-500 hover:bg-amber-50" : "text-slate-300 hover:bg-slate-100"}`}
                      >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: r.is_featured ? "'FILL' 1" : "'FILL' 0" }}>
                          {toggling === r.id ? "refresh" : "star"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <a
                          href={`/gastronomia/${r.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </a>
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
