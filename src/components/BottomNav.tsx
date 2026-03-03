import { useLocation } from "react-router-dom";

const navItems = [
  { icon: "home", label: "Início", href: "/" },
  { icon: "explore", label: "Guia", href: "/praias" },
  { icon: "favorite", label: "Salvos", href: "/auth" },
  { icon: "person", label: "Perfil", href: "/auth" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/10 flex justify-around items-center py-3 px-2 z-[60]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <a
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-opacity ${isActive ? "text-primary" : "opacity-50"}`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

export default BottomNav;
