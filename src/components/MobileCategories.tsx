const categories = [
  { icon: "beach_access", label: "Praias", href: "/praias", active: true },
  { icon: "restaurant", label: "Gastronomia", href: "/gastronomia" },
  { icon: "hiking", label: "Aventura", href: "/entretenimento" },
  { icon: "nightlife", label: "Noite", href: "/entretenimento" },
  { icon: "hotel", label: "Hospedagem", href: "/hospedagem" },
];

const MobileCategories = () => {
  return (
    <section className="md:hidden py-8">
      <div className="px-6 mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">Categorias Rápidas</h3>
        <a className="text-primary text-sm font-semibold" href="/praias">Ver Tudo</a>
      </div>
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-none">
        {categories.map((cat) => (
          <a
            key={cat.label}
            href={cat.href}
            className="flex-shrink-0 flex flex-col items-center gap-3"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm transition-all ${
                cat.active
                  ? "bg-primary/20 border-2 border-primary/30"
                  : "bg-primary/10 border border-transparent"
              }`}
            >
              <span className="material-symbols-outlined text-primary text-2xl">{cat.icon}</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{cat.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default MobileCategories;
