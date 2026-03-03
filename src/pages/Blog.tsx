import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BottomNav from "@/components/BottomNav";
import SEO from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { value: "all", label: "Todos" },
  { value: "praias", label: "Praias" },
  { value: "gastronomia", label: "Gastronomia" },
  { value: "aventura", label: "Aventura" },
  { value: "roteiros", label: "Roteiros" },
  { value: "dicas", label: "Dicas" },
  { value: "vida-noturna", label: "Vida Noturna" },
] as const;

const CATEGORY_COLOR: Record<string, string> = {
  praias: "#0EA5E9",
  gastronomia: "#FF6F61",
  aventura: "#26C6A0",
  roteiros: "#8B5CF6",
  dicas: "#f4c025",
  "vida-noturna": "#EC4899",
};

const CATEGORY_LABEL: Record<string, string> = {
  praias: "Praias",
  gastronomia: "Gastronomia",
  aventura: "Aventura",
  roteiros: "Roteiros",
  dicas: "Dicas",
  "vida-noturna": "Vida Noturna",
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  tags: string[] | null;
  author_name: string;
  read_time_minutes: number | null;
  published_at: string | null;
};

const Blog = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, category, tags, author_name, read_time_minutes, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const filtered = useMemo(() => {
    if (!posts) return [];
    return posts.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "all" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-[#f8f8f5]">
      <SEO
        title="Blog – Dicas de Viagem para Florianópolis"
        description="Artigos, roteiros e dicas de viagem para Florianópolis. Praias, gastronomia, trilhas e vida noturna na Ilha da Magia."
        url="/blog"
      />
      <SiteHeader />

      {/* Hero with photo background */}
      <section
        className="relative flex items-end min-h-[65vh] pt-20 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80')" }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-10">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-[#f4c025] text-slate-900 text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Blog de Viagem
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-3 drop-shadow-lg">
            Dicas & Roteiros<br />
            <span className="text-[#f4c025] italic">da Ilha da Magia</span>
          </h1>
          <p className="text-white/75 text-lg mb-8 max-w-xl">
            Tudo que você precisa para planejar a viagem perfeita para Florianópolis.
          </p>

          {/* Search + filters glass panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-2xl">
            <div className="relative mb-3">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-lg">search</span>
              <input
                type="text"
                placeholder="Buscar artigo, destino, dica..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 text-sm outline-none focus:border-[#f4c025] transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={
                    category === c.value
                      ? { background: "#f4c025", color: "#1a1a1a" }
                      : { background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-28 md:pb-12">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-bold text-slate-600">Nenhum artigo encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros de busca.</p>
          </div>
        ) : (
          <div className="space-y-10">

            {/* Featured Post */}
            {featured && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Link to={`/blog/${featured.slug}`} className="group block">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl h-[420px] md:h-[480px]">
                    {/* Background image */}
                    <img
                      src={featured.cover_image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"}
                      alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-slate-900"
                          style={{ background: CATEGORY_COLOR[featured.category] || "#f4c025" }}
                        >
                          {CATEGORY_LABEL[featured.category] || featured.category}
                        </span>
                        <span className="text-white/60 text-xs font-bold uppercase tracking-wider">Destaque</span>
                        {featured.read_time_minutes && (
                          <span className="text-white/60 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {featured.read_time_minutes} min
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3 max-w-2xl">
                        {featured.title}
                      </h2>
                      <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-xl mb-5">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full text-slate-900 group-hover:opacity-90 transition-opacity"
                          style={{ background: "#f4c025" }}
                        >
                          Ler artigo <ArrowRight className="w-4 h-4" />
                        </span>
                        {featured.published_at && (
                          <span className="text-white/50 text-xs">
                            {new Date(featured.published_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </section>

      <SiteFooter />
      <BottomNav />
    </div>
  );
};

const PostCard = ({ post }: { post: BlogPost }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col">

        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-slate-200 flex-shrink-0">
          <img
            src={post.cover_image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category badge */}
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-slate-900"
            style={{ background: CATEGORY_COLOR[post.category] || "#f4c025" }}
          >
            {CATEGORY_LABEL[post.category] || post.category}
          </span>

          {/* Read time */}
          {post.read_time_minutes && (
            <span className="absolute bottom-3 right-3 flex items-center gap-1 text-white/90 text-xs font-semibold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
              <Clock className="w-3 h-3" /> {post.read_time_minutes} min
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-extrabold text-slate-800 text-base leading-snug group-hover:text-[#c9950a] transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
            <span className="font-medium text-slate-500">{post.author_name}</span>
            {post.published_at && (
              <span>
                {new Date(post.published_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default Blog;
