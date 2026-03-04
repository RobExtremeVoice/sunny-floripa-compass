const HeroSection = () => {
  return (
    <>
      {/* ── Mobile Hero ──────────────────────────────── */}
      <section className="md:hidden relative h-[80vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuA66CB3qIJ1QRoQrk85sXjs14xdfCCHP24j0Hup2aCxICBSGbr8Rjxtiw2wAv1lKkPZrjbZoOorGbzdsQls_godsarylmymbSsliteuu8gpCZNzO8UXhjfWtzelnYW31hDPN_SVITbcial9ZQhruH19IjuIjRLF6XpH9GnlXM7eNJiGB5y1tFKjWe3nsiqingtXOVuFdeG7j1qB9Pbc4i4sqq-Id4j4CqYF0KK_CsIl3mxD0-nuG0JSdhyENWrJ7N_wRmkINFGO9Nk')",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12">
          <span className="bg-primary text-slate-900 px-3 py-1 rounded-full text-xs font-bold w-fit mb-4">
            VERÃO 2026
          </span>
          <h2 className="text-white text-5xl font-extrabold leading-[1.1] mb-6 tracking-tighter">
            Viva a Magia de Floripa
          </h2>

          <a
            href="/praias"
            className="bg-primary text-slate-900 w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            Começar a Explorar
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
      </section>

      {/* ── Desktop Hero ─────────────────────────────── */}
      <section className="hidden md:block relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-light dark:to-background-dark z-10" />
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAa3Lqj-8oiE-nXgGQp6aOaudweYn3AmWn3qH9XozEVDE3xQGfnyx50k_Dp75JCxfr0sYv0_9hCkpdMcFvI1C5sGeY4pj15kAgB6uOHR38mTnBm26gm5qGRRyw57BKbFrN5apvuBSd8G4HLWejJr8M-XHnBrAoj5aPIrBq1fngXFEFAYGFQCDKaqtluRa3bpNxcWwX4xwNCNSh2cZW0JVrvWtosmzJecWCLiI5FPtLuYr3NfnIG1_G4_AkfAMTEPG1OKIajGDuNUpQ')",
          }}
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
            Descubra a{" "}
            <span
              className="text-primary italic relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:bg-primary/30 after:rounded-full"
              style={{ textShadow: "0 2px 10px rgba(244,192,37,0.4)" }}
            >
              Ilha da Magia
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 font-medium max-w-2xl">
            Sol, mar e experiências inesquecíveis esperam por você no coração de Santa Catarina.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/praias"
              className="bg-primary text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 justify-center"
            >
              <span className="material-symbols-outlined">explore</span>
              Explorar Floripa
            </a>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2 justify-center">
              <span className="material-symbols-outlined">play_circle</span>
              Ver Vídeo
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
