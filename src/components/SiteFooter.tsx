const footerLinks = {
  "Planeje sua viagem": [
    { label: "Hospedagem", href: "/hospedagem" },
    { label: "Como Chegar", href: "/flights" },
    { label: "Mapas e Guias", href: "#" },
    { label: "Planejador de Roteiro", href: "/planejar" },
  ],
  Explorar: [
    { label: "Melhores Praias", href: "/praias" },
    { label: "Vida Noturna", href: "/entretenimento" },
    { label: "Cultura Açoriana", href: "/entretenimento" },
    { label: "Ecoturismo", href: "/entretenimento" },
  ],
  Suporte: [
    { label: "Centro de Ajuda", href: "#" },
    { label: "Contate-nos", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "Privacidade", href: "#" },
  ],
};

const SiteFooter = () => {
  return (
    /* pb-24 on mobile = space for bottom nav bar */
    <footer className="bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 pt-12 pb-24 md:pt-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-4 sm:px-6 lg:px-8">

        {/* Brand row */}
        <div className="mb-10 md:mb-0">
          <a className="flex items-center gap-2 mb-4 md:mb-6" href="/">
            <span className="material-symbols-outlined text-primary text-3xl">sailing</span>
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Visit<span className="text-primary">Floripa</span>
            </span>
          </a>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 italic">
            O guia oficial de turismo de Florianópolis, Santa Catarina. Comece sua jornada aqui na Ilha da Magia.
          </p>
          <div className="flex gap-4">
            {[
              { icon: "public", label: "Website" },
              { icon: "share", label: "Share" },
              { icon: "photo_camera", label: "Instagram" },
            ].map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all"
              >
                <span className="material-symbols-outlined text-lg">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns: 2-col on mobile, 3-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4 mt-10 md:mt-12 mb-10 md:mb-16">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 mb-4 text-sm md:text-lg">{title}</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                {links.map((link) => (
                  <li key={link.label}>
                    <a className="hover:text-primary transition-colors" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <span className="text-xs flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-sm text-primary">location_on</span>
            Florianópolis, SC, Brazil
          </span>
          <div className="flex items-center justify-between md:gap-6">
            <p className="text-xs text-slate-500 font-medium">
              © {new Date().getFullYear()} VisitFloripa.
            </p>
            <button className="text-[10px] bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              PT-BR
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
