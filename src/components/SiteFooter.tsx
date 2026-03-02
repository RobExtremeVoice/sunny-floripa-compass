import { Plane, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  "Descubra": [
    { label: "Praias", href: "/praias" },
    { label: "Gastronomia", href: "/gastronomia" },
    { label: "Entretenimento", href: "/entretenimento" },
    { label: "Hospedagem", href: "/hospedagem" },
  ],
  "Serviços": [
    { label: "Voos ao Vivo", href: "/flights" },
    { label: "Planeje sua Viagem", href: "/planejar" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "#" },
  ],
  "Visite Floripa": [
    { label: "Sobre Nós", href: "#" },
    { label: "Contato", href: "#" },
    { label: "Trabalhe Conosco", href: "#" },
    { label: "Anuncie", href: "#" },
  ],
  "Legal": [
    { label: "Privacidade", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Disclaimers", href: "#" },
  ],
};

const SiteFooter = () => {
  return (
    <footer className="bg-foreground text-card/80 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-display text-2xl font-bold text-card block mb-4">
              Visite<span className="font-light">Floripa</span>
            </span>
            <p className="text-sm text-card/60 mb-6 font-body leading-relaxed">
              Seu guia completo para Florianópolis — voos, praias, hotéis, gastronomia e muito mais.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-card/10 flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="Social"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-sm font-bold text-card mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-card/55 hover:text-card transition-colors font-body">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Airport Info */}
        <div className="border-t border-card/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-card/40 font-body">
            <span className="flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5" /> Aeroporto Hercílio Luz (FLN)
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Florianópolis, SC - Brasil
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> (48) 3331-4000
            </span>
          </div>
          <p className="text-xs text-card/30 font-body">
            © {new Date().getFullYear()} VisiteFloripa. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
