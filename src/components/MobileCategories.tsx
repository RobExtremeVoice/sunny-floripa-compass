const categories = [
  { icon: "flight",       label: "Voos",        href: "/flights" },
  { icon: "hotel",        label: "Hospedagens",  href: "/hospedagem" },
  { icon: "restaurant",   label: "Gastronomia",  href: "/gastronomia" },
  { icon: "beach_access", label: "Praias",       href: "/praias" },
  { icon: "hiking",       label: "Aventura",     href: "/entretenimento" },
  { icon: "nightlife",    label: "Noite",        href: "/entretenimento" },
];

const MobileCategories = () => {
  return (
    <section className="md:hidden py-8 px-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-bold">Categorias Rápidas</h3>
        <a className="text-primary text-sm font-semibold" href="/praias">Ver Tudo</a>
      </div>

      {/* 2 rows × 3 columns grid */}
      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat) => (
          <a
            key={cat.label}
            href={cat.href}
            className="flex flex-col items-center gap-2.5 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-primary text-2xl">{cat.icon}</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{cat.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default MobileCategories;
