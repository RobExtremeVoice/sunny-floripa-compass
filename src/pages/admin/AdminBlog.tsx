import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  is_published: boolean;
  created_at: string;
  author: string | null;
  cover_image: string | null;
};

const categories = ["all", "praias", "gastronomia", "aventura", "cultura", "dicas", "roteiros", "hospedagem"];

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  async function fetchPosts() {
    setLoading(true);
    let q = supabase
      .from("blog_posts")
      .select("id, slug, title, category, is_published, created_at, author, cover_image")
      .order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("category", filter);
    const { data } = await q;
    setPosts(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, [filter]);

  async function togglePublish(post: Post) {
    setToggling(post.id);
    await supabase.from("blog_posts").update({ is_published: !post.is_published }).eq("id", post.id);
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, is_published: !p.is_published } : p))
    );
    setToggling(null);
  }

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Blog</h2>
          <p className="text-slate-500 text-sm">{posts.length} artigos no total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar artigo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Todas as categorias" : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500">Nenhum artigo encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Artigo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Data</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {post.cover_image && (
                          <img
                            src={post.cover_image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-xs">
                            {post.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">
                      {new Date(post.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          post.is_published
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                        }`}
                      >
                        {post.is_published ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Ver artigo"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </a>
                        <button
                          onClick={() => togglePublish(post)}
                          disabled={toggling === post.id}
                          className={`p-1.5 rounded-lg transition-colors ${
                            post.is_published
                              ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                          title={post.is_published ? "Despublicar" : "Publicar"}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {toggling === post.id ? "refresh" : post.is_published ? "visibility_off" : "visibility"}
                          </span>
                        </button>
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
