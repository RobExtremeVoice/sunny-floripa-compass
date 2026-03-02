import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Clock, Calendar, User, BookOpen, Tag } from "lucide-react";
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

const CATEGORY_COLORS: Record<string, string> = {
  praias: "bg-ocean/10 text-ocean-deep border-ocean/20",
  gastronomia: "bg-sunset/10 text-sunset border-sunset/20",
  aventura: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  roteiros: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  dicas: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  "vida-noturna": "bg-pink-500/10 text-pink-700 border-pink-500/20",
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
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog – Dicas de Viagem para Florianópolis"
        description="Artigos, roteiros e dicas de viagem para Florianópolis. Praias, gastronomia, trilhas e vida noturna na Ilha da Magia."
        url="/blog"
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 bg-gradient-to-br from-foreground to-foreground/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground/20 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary-foreground/70" />
              <span className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">Blog</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
              Dicas & Roteiros de Florianópolis
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl mb-8">
              Tudo que você precisa saber para planejar a viagem perfeita para a Ilha da Magia.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/50" />
              <Input
                placeholder="Buscar artigo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-primary-foreground/15 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === c.value
                    ? "bg-primary-foreground text-foreground"
                    : "bg-primary-foreground/15 text-primary-foreground/80 hover:bg-primary-foreground/25"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">Nenhum artigo encontrado</p>
            <p className="text-sm">Tente ajustar os filtros de busca.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Post */}
            {featured && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Link to={`/blog/${featured.slug}`} className="group block">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all">
                    <div className="h-64 lg:h-auto overflow-hidden">
                      {featured.cover_image ? (
                        <img
                          src={featured.cover_image}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/5 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 lg:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs border ${CATEGORY_COLORS[featured.category] || "bg-muted text-foreground"}`}>
                          {featured.category}
                        </Badge>
                        {featured.read_time_minutes && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {featured.read_time_minutes} min de leitura
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                        {featured.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-3 mb-4">{featured.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {featured.author_name}</span>
                        {featured.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(featured.published_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Other Posts Grid */}
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
      <div className="rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-card h-full flex flex-col">
        <div className="relative h-48 overflow-hidden bg-muted">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/5">
              <BookOpen className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`text-xs border ${CATEGORY_COLORS[post.category] || "bg-muted text-foreground"}`}>
              {post.category}
            </Badge>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-1">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author_name}</span>
            <div className="flex items-center gap-3">
              {post.read_time_minutes && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time_minutes} min</span>
              )}
              {post.published_at && (
                <span>{new Date(post.published_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default Blog;
