import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Activity = {
  id: string;
  name: string;
  slug: string;
  category: string;
  region: string;
  is_free: boolean | null;
  price_range: number | null;
  photo_url: string | null;
};

export default function AdminEntertainment() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("activities")
      .select("id, name, slug, category, region, is_free, price_range, photo_url")
      .order("category")
      .order("name")
      .then(({ data }) => {
        const rows = data ?? [];
        setItems(rows);
        const cats = Array.from(new Set(rows.map((r) => r.category))).sort();
        setCategories(cats);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.region.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || a.category === category;
    return matchSearch && matchCat;
  });

  const categoryLabel: Record<string, string> = {
    esportes_aquaticos: "Esportes Aquáticos",
    trilhas: "Trilhas",
    cultura: "Cultura",
    aventura: "Aventura",
    passeios: "Passeios",
    life_style: "Life Style",
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Entretenimento</h2>
        <p className="text-slate-500 text-sm">{items.length} atividades cadastradas</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar atividade ou região..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>{categoryLabel[c] ?? c}</option>
          ))}
        </select>
      </div>

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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Atividade</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Região</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Entrada</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {a.photo_url && (
                          <img src={`${a.photo_url}&w=80&q=60`} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block" />
                        )}
                        <p className="font-medium text-slate-900 dark:text-white">{a.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {categoryLabel[a.category] ?? a.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell capitalize">{a.region}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${a.is_free ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-600"}`}>
                        {a.is_free ? "Gratuito" : a.price_range ? "R$".repeat(a.price_range) : "Pago"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <a
                          href={`/entretenimento/${a.slug}`}
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
