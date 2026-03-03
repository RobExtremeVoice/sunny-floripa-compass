import { Plane, Bed, Waves, UtensilsCrossed, Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  { id: "voos", label: "Voos", icon: Plane, placeholder: "Número do voo ou destino...", href: "/flights" },
  { id: "hoteis", label: "Hotéis", icon: Bed, placeholder: "Nome do hotel ou região...", href: "/hospedagem" },
  { id: "praias", label: "Praias", icon: Waves, placeholder: "Nome da praia...", href: "/praias" },
  { id: "restaurantes", label: "Restaurantes", icon: UtensilsCrossed, placeholder: "Tipo de cozinha ou nome...", href: "/gastronomia" },
];

const QuickSearch = () => {
  const [active, setActive] = useState("voos");
  const activeCategory = categories.find((c) => c.id === active)!;

  return (
    <section className="relative z-20 -mt-14 md:-mt-18 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-card rounded-2xl shadow-elevated p-3 md:p-4 border border-border/50"
        >
          {/* Category Tabs */}
          <div className="flex gap-1 mb-3 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    active === cat.id
                      ? "bg-gradient-ocean text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={activeCategory.placeholder}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all text-sm"
              />
            </div>
            <a
              href={activeCategory.href}
              className="bg-gradient-ocean text-primary-foreground px-6 md:px-8 rounded-xl font-semibold text-sm hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all shrink-0 flex items-center"
            >
              Buscar
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickSearch;
