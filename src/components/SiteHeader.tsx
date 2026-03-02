import { useState, useEffect } from "react";
import { Menu, X, Plane, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Voos", href: "/flights", icon: Plane },
  { label: "Hospedagem", href: "/hospedagem" },
  { label: "Praias", href: "/praias" },
  { label: "Gastronomia", href: "/gastronomia" },
  { label: "Entretenimento", href: "/entretenimento" },
  { label: "Blog", href: "/blog" },
  { label: "Planeje sua Viagem", href: "#planejar", highlight: true },
];

const SiteHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-card border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span
            className={`font-display text-xl md:text-2xl font-bold tracking-tight transition-colors ${
              isScrolled ? "text-primary" : "text-card"
            }`}
          >
            Visite<span className="font-light">Floripa</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                item.highlight
                  ? "bg-gradient-ocean text-primary-foreground hover:opacity-90"
                  : isScrolled
                  ? "text-foreground/80 hover:text-primary hover:bg-muted"
                  : "text-card/90 hover:text-card hover:bg-card/10"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Language + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            className={`hidden md:flex items-center gap-1 text-sm font-medium transition-colors ${
              isScrolled ? "text-muted-foreground" : "text-card/80"
            }`}
          >
            PT <ChevronDown className="w-3 h-3" />
          </button>
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "text-foreground" : "text-card"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    item.highlight
                      ? "bg-gradient-ocean text-primary-foreground text-center"
                      : "text-foreground/80 hover:text-primary hover:bg-muted"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteHeader;
