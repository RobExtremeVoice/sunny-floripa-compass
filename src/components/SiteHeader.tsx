import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTravelAssistant } from "@/contexts/TravelAssistantContext";

const oQueFazerItems = [
  { label: "Praias", href: "/praias", icon: "beach_access" },
  { label: "Gastronomia", href: "/gastronomia", icon: "restaurant" },
  { label: "Entretenimento", href: "/entretenimento", icon: "celebration" },
];

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { open: openAssistant } = useTravelAssistant();

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-8">
            <a className="flex items-center gap-2 group shrink-0" href="/">
              <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:scale-110">sailing</span>
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Visit<span className="text-primary">Floripa</span>
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              <a className="text-sm font-semibold px-3 py-2 rounded-lg hover:text-primary hover:bg-primary/5 transition-colors" href="/flights">
                Voos
              </a>
              <a className="text-sm font-semibold px-3 py-2 rounded-lg hover:text-primary hover:bg-primary/5 transition-colors" href="/hospedagem">
                Hospedagens
              </a>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  O que Fazer
                  <span
                    className="material-symbols-outlined transition-transform duration-200"
                    style={{ fontSize: "16px", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    expand_more
                  </span>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                    >
                      {oQueFazerItems.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>
                            {item.icon}
                          </span>
                          {item.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={openAssistant}
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>auto_awesome</span>
                Planeje sua Viagem
              </button>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Desktop search bar */}
            <div className="hidden lg:flex items-center bg-primary/10 rounded-full px-4 py-2 border border-primary/20">
              <span className="material-symbols-outlined text-primary mr-2" style={{ fontSize: "18px" }}>search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-40 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none"
                placeholder="Buscar experiências..."
                type="text"
              />
            </div>

            {/* Desktop CTA */}
            <a
              href="/planejar"
              className="hidden md:inline-flex bg-primary text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm hover:brightness-105 transition-all shadow-lg shadow-primary/20"
            >
              Reserve Agora
            </a>

            {/* Mobile: search circle button */}
            <button
              className="md:hidden p-2 rounded-full bg-primary/10 text-slate-900 dark:text-slate-100"
              aria-label="Buscar"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            {/* Mobile: hamburger */}
            <button
              className="md:hidden p-2 text-slate-900 dark:text-slate-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-3xl">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              <a href="/flights" className="px-4 py-3 text-sm font-semibold rounded-lg hover:text-primary hover:bg-primary/10 transition-colors">
                Voos
              </a>
              <a href="/hospedagem" className="px-4 py-3 text-sm font-semibold rounded-lg hover:text-primary hover:bg-primary/10 transition-colors">
                Hospedagens
              </a>
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">O que Fazer</div>
              {oQueFazerItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 pl-8 pr-4 py-2.5 text-sm font-semibold rounded-lg hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: "16px" }}>{item.icon}</span>
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => { setMobileOpen(false); openAssistant(); }}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg hover:text-primary hover:bg-primary/10 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "16px" }}>auto_awesome</span>
                Planeje sua Viagem
              </button>
              <a
                href="/planejar"
                className="mt-2 bg-primary text-slate-900 px-4 py-3 rounded-lg font-bold text-sm text-center"
              >
                Reserve Agora
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteHeader;
