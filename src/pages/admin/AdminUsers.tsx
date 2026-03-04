import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, user_id, display_name, avatar_url, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setProfiles(data ?? []); setLoading(false); });
  }, []);

  const filtered = profiles.filter((p) =>
    (p.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    p.user_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Usuários</h2>
        <p className="text-slate-500 text-sm">{profiles.length} perfis cadastrados</p>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome ou ID..."
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
          <div className="py-20 text-center text-slate-500 text-sm">Nenhum usuário encontrado</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-slate-900 font-bold text-sm shrink-0">
                    {(p.display_name?.[0] ?? "U").toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {p.display_name ?? "Usuário sem nome"}
                  </p>
                  <p className="text-xs text-slate-400 font-mono truncate">{p.user_id}</p>
                </div>
                <p className="text-xs text-slate-400 shrink-0">
                  {new Date(p.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
