import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Nav */}
          <div className="flex items-center gap-10">
            <a className="flex items-center gap-2 group" href="/">
              <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:scale-110">sailing</span>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Visit<span className="text-primary">Floripa</span>
              </span>
            </a>
            <nav className="hidden md:flex space-x-8">
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="/praias">Destinos</a>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="/entretenimento">O que fazer</a>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="/planejar">Planeje sua viagem</a>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-primary/10 rounded-full px-4 py-2 border border-primary/20">
              <span className="material-symbols-outlined text-primary mr-2" style={{ fontSize: '18px' }}>search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-40 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none"
                placeholder="Buscar experiências..."
                type="text"
              />
            </div>
            <a
              href="/planejar"
              className="bg-primary text-slate-900 px-6 py-2.5 rounded-full font-bold text-sm hover:brightness-105 transition-all shadow-lg shadow-primary/20"
            >
              Reserve Agora
            </a>
            <button
              className="md:hidden text-slate-900 dark:text-slate-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
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
              {[
                { label: "Destinos", href: "/praias" },
                { label: "O que fazer", href: "/entretenimento" },
                { label: "Planeje sua viagem", href: "/planejar" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-sm font-semibold rounded-lg hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  {item.label}
                </a>
              ))}
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
