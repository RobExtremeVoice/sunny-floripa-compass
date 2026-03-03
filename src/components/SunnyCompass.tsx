import { useTravelAssistant } from "@/contexts/TravelAssistantContext";

const COMPASS_PROMPT =
  "Qual a melhor praia de Florianópolis para visitar agora? Leve em conta a hora do dia, a posição do sol e o perfil de viagem. Sugira 3 opções com uma breve descrição de cada.";

const SunnyCompass = () => {
  const { openWithPrompt } = useTravelAssistant();

  const handleOpenCompass = () => openWithPrompt(COMPASS_PROMPT);

  return (
    <>
      {/* ── Mobile: compact yellow card ────────────── */}
      <section className="md:hidden px-6 py-4">
        <div className="bg-primary/90 backdrop-blur-sm rounded-2xl p-6 text-slate-900 border-2 border-primary shadow-xl relative overflow-hidden">
          {/* Decorative bg icon */}
          <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined" style={{ fontSize: "140px" }}>explore</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-slate-900 p-1 rounded">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "12px" }}>explore</span>
              </div>
              <span className="font-bold tracking-[0.2em] text-[10px] uppercase">Sunny Compass</span>
            </div>
            <h3 className="text-2xl font-extrabold mb-2 leading-tight">Encontre sua praia perfeita</h3>
            <p className="text-sm mb-6 font-medium opacity-80 leading-relaxed">
              Escolha sua vibe e nós indicaremos a melhor praia para o clima de hoje.
            </p>
            <button
              onClick={handleOpenCompass}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              Abrir Bússola
            </button>
          </div>
        </div>
      </section>

      {/* ── Desktop: full two-column section ───────── */}
      <section className="hidden md:block bg-primary/5 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Text */}
            <div className="lg:w-1/2 space-y-8 lg:pr-12">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-full font-bold text-xs tracking-widest uppercase">
                <span className="material-symbols-outlined text-sm">sunny</span>
                Sunshine Optimizer
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                Sunny Floripa <span className="text-primary">Compass</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Florianópolis tem uma geografia única. Com a nossa Bússola Solar interativa, você acompanha a trajetória
                do sol na ilha em tempo real. Se você quer um amanhecer na Praia Mole ou o pôr do sol perfeito em Santo
                Antônio de Lisboa, nós ajudamos você.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time sun tracking across 42+ beaches",
                  "Sunset quality prediction engine",
                  '"Golden Hour" alerts for photographers',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleOpenCompass}
                className="bg-primary text-slate-900 px-8 py-4 rounded-xl font-extrabold hover:shadow-xl transition-all shadow-primary/20 hover:brightness-105"
              >
                Testar a Bússola Interativa
              </button>
            </div>

            {/* Right: Compass mockup */}
            <div className="lg:w-1/2 relative lg:pl-12">
              <div className="relative z-10 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-primary/20">
                <div className="aspect-square rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent rotate-45" />
                  </div>
                  <div className="relative z-20 bg-background-light dark:bg-background-dark p-6 rounded-full shadow-lg border border-primary/10">
                    <span className="material-symbols-outlined text-6xl text-primary animate-pulse">explore</span>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-primary text-slate-900 p-4 rounded-2xl shadow-lg font-bold">
                    <div className="text-xs uppercase opacity-70">Sunniest Now</div>
                    <div className="text-lg">Campeche</div>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <div className="text-xs font-bold text-slate-400 uppercase">Morning</div>
                    <div className="font-bold">East Coast</div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/20 border border-primary/30">
                    <div className="text-xs font-bold text-primary uppercase">Noon</div>
                    <div className="font-bold">North Bay</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <div className="text-xs font-bold text-slate-400 uppercase">Evening</div>
                    <div className="font-bold">West Coast</div>
                  </div>
                </div>
              </div>
              {/* Click overlay to open compass */}
              <button
                onClick={handleOpenCompass}
                className="absolute inset-0 z-20 rounded-3xl cursor-pointer opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                style={{ background: "rgba(244,192,37,0.08)" }}
                aria-label="Abrir bússola interativa"
              />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SunnyCompass;
