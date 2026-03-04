import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  beaches: number;
  blog_posts: number;
  restaurants: number;
  activities: number;
  accommodations: number;
  users: number;
};

const statCards = [
  { key: "beaches" as const, label: "Praias", icon: "beach_access", href: "/admin/praias", color: "bg-blue-50 text-blue-600" },
  { key: "blog_posts" as const, label: "Artigos Blog", icon: "article", href: "/admin/blog", color: "bg-amber-50 text-amber-600" },
  { key: "restaurants" as const, label: "Restaurantes", icon: "restaurant", href: "/admin/restaurantes", color: "bg-green-50 text-green-600" },
  { key: "activities" as const, label: "Entretenimento", icon: "local_activity", href: "/admin/entretenimento", color: "bg-purple-50 text-purple-600" },
  { key: "accommodations" as const, label: "Hospedagem", icon: "hotel", href: "/admin/hospedagem", color: "bg-pink-50 text-pink-600" },
  { key: "users" as const, label: "Usuários", icon: "group", href: "/admin/usuarios", color: "bg-slate-100 text-slate-600" },
];

const quickLinks = [
  { label: "Novo artigo no blog", icon: "add_circle", href: "/admin/blog?new=1" },
  { label: "Ver praias publicadas", icon: "beach_access", href: "/admin/praias" },
  { label: "Gerenciar restaurantes", icon: "restaurant", href: "/admin/restaurantes" },
  { label: "Ver usuários cadastrados", icon: "group", href: "/admin/usuarios" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ beaches: 0, blog_posts: 0, restaurants: 0, activities: 0, accommodations: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [beaches, blog_posts, restaurants, activities, accommodations, users] = await Promise.all([
        supabase.from("beaches").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("restaurants").select("id", { count: "exact", head: true }),
        supabase.from("activities").select("id", { count: "exact", head: true }),
        supabase.from("accommodations").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        beaches: beaches.count ?? 0,
        blog_posts: blog_posts.count ?? 0,
        restaurants: restaurants.count ?? 0,
        activities: activities.count ?? 0,
        accommodations: accommodations.count ?? 0,
        users: users.count ?? 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
          Bem-vindo ao Painel
        </h2>
        <p className="text-slate-500 text-sm">Visão geral do portal VisitFloripa</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.key}
            to={card.href}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
              <span className="material-symbols-outlined text-2xl">{card.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {loading ? "—" : stats[card.key].toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-slate-500 font-medium">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wide">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex gap-4">
        <span className="material-symbols-outlined text-amber-500 text-2xl shrink-0">info</span>
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-1">
            Migração de blog pendente
          </p>
          <p className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
            Execute o arquivo{" "}
            <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded font-mono">
              supabase/migrations/20260304100000_blog_fix_duplicates_photos.sql
            </code>{" "}
            no Supabase Dashboard (SQL Editor) para despublicar artigos duplicados e corrigir fotos do blog.
          </p>
        </div>
      </div>
    </div>
  );
}
