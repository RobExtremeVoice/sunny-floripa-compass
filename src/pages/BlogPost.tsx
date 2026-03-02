import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Calendar, User, Tag, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

const CATEGORY_COLORS: Record<string, string> = {
  praias: "bg-ocean/10 text-ocean-deep border-ocean/20",
  gastronomia: "bg-sunset/10 text-sunset border-sunset/20",
  aventura: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  roteiros: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  dicas: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  "vida-noturna": "bg-pink-500/10 text-pink-700 border-pink-500/20",
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", post?.category, slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("title, slug, cover_image, category, read_time_minutes, published_at")
        .eq("is_published", true)
        .eq("category", post!.category)
        .neq("slug", slug!)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!post?.category,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-20 container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-80 w-full rounded-2xl mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Artigo não encontrado</h1>
          <Link to="/blog" className="text-primary hover:underline">← Voltar para o blog</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.title}
        description={post.excerpt || `Leia "${post.title}" no blog VisiteFloripa.`}
        image={post.cover_image || undefined}
        url={`/blog/${slug}`}
        type="article"
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-foreground to-foreground/80" />
        )}
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto max-w-4xl">
            <Link to="/blog" className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar para o blog
            </Link>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`text-xs border ${CATEGORY_COLORS[post.category] || "bg-muted text-foreground"}`}>
                {post.category}
              </Badge>
              {post.read_time_minutes && (
                <span className="text-primary-foreground/70 text-sm flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.read_time_minutes} min de leitura
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground drop-shadow-lg">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="container mx-auto px-4 max-w-4xl py-10">
        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{post.author_name}</p>
            {post.published_at && (
              <p className="text-xs text-muted-foreground">
                Publicado em {new Date(post.published_at).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && (post.tags as string[]).length > 0 && (
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {(post.tags as string[]).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group rounded-xl overflow-hidden bg-card border border-border hover:shadow-card transition-all"
                >
                  <div className="h-32 overflow-hidden bg-muted">
                    {related.cover_image ? (
                      <img src={related.cover_image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {related.read_time_minutes} min · {related.published_at && new Date(related.published_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <SiteFooter />
    </div>
  );
};

export default BlogPost;
