import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Beach = {
  id: string;
  name: string;
  slug: string;
  region: string;
  neighborhood: string | null;
  is_featured: boolean | null;
  wave_intensity: string | null;
  photo_url: string | null;
};

const regions = ["all", "Norte", "Leste", "Sul", "Oeste", "Centro"];

export default function AdminBeaches() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  async function fetchBeaches() {
    setLoading(true);
    let q = supabase
      .from("beaches")
      .select("id, name, slug, region, neighborhood, is_featured, wave_intensity, photo_url")
      .order("region")
      .order("name");
    if (region !== "all") q = q.eq("region", region);
    const { data } = await q;
    setBeaches(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchBeaches(); }, [region]);

  async function toggleFeatured(beach: Beach) {
    setToggling(beach.id);
    await supabase.from("beaches").update({ is_featured: !beach.is_featured }).eq("id", beach.id);
    setBeaches((prev) =>
      prev.map((b) => (b.id === beach.id ? { ...b, is_featured: !b.is_featured } : b))
    );
    setToggling(null);
  }

  const filtered = beaches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.neighborhood ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const regionColors: Record<string, string> = {
    Norte: "bg-blue-100 text-blue-700",
    Leste: "bg-green-100 text-green-700",
    Sul: "bg-amber-100 text-amber-700",
    Oeste: "bg-purple-100 text-purple-700",
    Centro: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Praias</h2>
          <p className="text-slate-500 text-sm">{beaches.length} praias cadastradas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar praia ou bairro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {regions.map((r) => (
            <option key={r} value={r}>{r === "all" ? "Todas as regiões" : r}</option>
          ))}
        </select>
      </div>

      {/* Table */}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Praia</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Região</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Ondas</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Destaque</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((beach) => (
                  <tr key={beach.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {beach.photo_url && (
                          <img
                            src={`${beach.photo_url}&w=80&q=60`}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block"
                          />
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{beach.name}</p>
                          {beach.neighborhood && (
                            <p className="text-xs text-slate-400">{beach.neighborhood}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${regionColors[beach.region] ?? "bg-slate-100 text-slate-600"}`}>
                        {beach.region}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell capitalize">
                      {beach.wave_intensity ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(beach)}
                        disabled={toggling === beach.id}
                        className={`p-1.5 rounded-lg transition-colors ${
                          beach.is_featured
                            ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            : "text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title={beach.is_featured ? "Remover destaque" : "Destacar"}
                      >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: beach.is_featured ? "'FILL' 1" : "'FILL' 0" }}>
                          {toggling === beach.id ? "refresh" : "star"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/praias/${beach.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Ver praia"
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
