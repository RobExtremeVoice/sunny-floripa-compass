import { Link } from "react-router-dom";
import Newsletter from "./Newsletter";

const footerLinks = {
  "Planeje sua viagem": [
    { label: "Hospedagem", href: "/hospedagem" },
    { label: "Voos", href: "/flights" },
    { label: "Planejador de Roteiro", href: "/planejar" },
    { label: "Blog de Viagem", href: "/blog" },
  ],
  Explorar: [
    { label: "Praias", href: "/praias" },
    { label: "Gastronomia", href: "/gastronomia" },
    { label: "Entretenimento", href: "/entretenimento" },
    { label: "Cultura Açoriana", href: "/entretenimento" },
  ],
  Suporte: [
    { label: "Centro de Ajuda", href: "#" },
    { label: "Contate-nos", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "Privacidade", href: "#" },
  ],
};

const socialLinks = [
  { icon: "photo_camera", label: "Instagram", href: "#" },
  { icon: "facebook", label: "Facebook", href: "#" },
  { icon: "play_circle", label: "YouTube", href: "#" },
];

const SiteFooter = () => {
  return (
    <>
    <Newsletter />
    <footer className="bg-slate-900 text-slate-100 pt-16 pb-24 md:pt-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top section: Brand + links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-14">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary text-3xl">sailing</span>
              <span className="text-xl font-extrabold tracking-tight">
                Visit<span className="text-primary">Floripa</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              O guia completo de turismo de Florianópolis, Santa Catarina. Descubra a Ilha da Magia.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all text-slate-400"
                >
                  <span className="material-symbols-outlined text-base">{icon}</span>
                </a>
              ))}
            </div>

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { num: "42+", label: "Praias" },
                { num: "200+", label: "Restaurantes" },
                { num: "150+", label: "Atividades" },
                { num: "50+", label: "Hospedagens" },
              ].map(({ num, label }) => (
                <div key={label} className="bg-slate-800 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-primary font-extrabold text-lg leading-none">{num}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-extrabold text-sm uppercase tracking-widest text-primary mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-200 rounded-full" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center gap-4">
            <span className="text-xs flex items-center gap-1 text-slate-500">
              <span className="material-symbols-outlined text-sm text-primary">location_on</span>
              Florianópolis, SC, Brasil
            </span>
            <span className="text-slate-700">·</span>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} VisitFloripa. Todos os direitos reservados.
            </p>
            <span className="text-slate-700">·</span>
            <span className="text-xs text-slate-600 font-mono tracking-tight">
              27°35′S 48°33′W
            </span>
          </div>
          <button className="text-[10px] bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:border-slate-500 transition-colors w-fit">
            PT-BR
          </button>
        </div>
      </div>
    </footer>
    </>
  );
};

export default SiteFooter;
