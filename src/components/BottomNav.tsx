import { useLocation, useNavigate } from "react-router-dom";
import { useTravelAssistant } from "@/contexts/TravelAssistantContext";

type NavItem = {
  icon: string;
  label: string;
  href?: string;
  action?: "assistant";
};

const navItems: NavItem[] = [
  { icon: "home",         label: "Início",    href: "/" },
  { icon: "explore",      label: "Guia",      href: "/praias" },
  { icon: "auto_awesome", label: "AI Viagem", action: "assistant" },
  { icon: "person",       label: "Perfil",    href: "/auth" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { open: openAssistant } = useTravelAssistant();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/10 flex justify-around items-center py-3 px-2 z-[60]">
      {navItems.map((item) => {
        const isActive = item.href ? location.pathname === item.href : false;

        const handleClick = () => {
          if (item.action === "assistant") {
            openAssistant();
          } else if (item.href) {
            navigate(item.href);
          }
        };

        return (
          <button
            key={item.label}
            onClick={handleClick}
            className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-opacity ${
              isActive ? "text-primary" : "opacity-50"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
