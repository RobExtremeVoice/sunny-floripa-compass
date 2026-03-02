import { Plane, Bed, Waves, UtensilsCrossed, Search } from "lucide-react";
import { useState } from "react";

const categories = [
  { id: "voos", label: "Voos", icon: Plane, placeholder: "Número do voo ou destino..." },
  { id: "hoteis", label: "Hotéis", icon: Bed, placeholder: "Nome do hotel ou região..." },
  { id: "praias", label: "Praias", icon: Waves, placeholder: "Nome da praia..." },
  { id: "restaurantes", label: "Restaurantes", icon: UtensilsCrossed, placeholder: "Tipo de cozinha ou nome..." },
];

const QuickSearch = () => {
  const [active, setActive] = useState("voos");
  const activeCategory = categories.find((c) => c.id === active)!;

  return (
    <section className="relative z-20 -mt-12 md:-mt-16 px-4">
      <div className="container mx-auto">
        <div className="bg-card rounded-2xl shadow-elevated p-2 md:p-3">
          {/* Category Tabs */}
          <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    active === cat.id
                      ? "bg-primary text-primary-foreground"
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
            <button className="bg-gradient-ocean text-primary-foreground px-6 md:px-8 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shrink-0">
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickSearch;
