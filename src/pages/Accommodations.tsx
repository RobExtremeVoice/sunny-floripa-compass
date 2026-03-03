import { useState } from "react";
import SEO from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { Star, MapPin, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const getDefaultDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
};

const accommodationTypes = [
  {
    icon: "hotel",
    label: "Hotéis & Resorts",
    desc: "Conforto e estrutura completa",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
  },
  {
    icon: "cottage",
    label: "Pousadas",
    desc: "Charme e hospitalidade local",
    img: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80",
  },
  {
    icon: "house",
    label: "Airbnb & Temporada",
    desc: "Casa completa, privacidade total",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    icon: "bunk_bed",
    label: "Hostels & Budget",
    desc: "Econômico e social",
    img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80",
  },
];

const neighborhoods = [
  {
    name: "Jurerê Internacional",
    desc: "Praia sofisticada, vida noturna premiada, hotéis de luxo.",
    // Barcos flutuando na baía azul de Florianópolis
    img: "https://images.unsplash.com/photo-1742614098758-ff24f78a33c7?w=600&q=80",
    tag: "Premium",
    tagColor: "#f4c025",
  },
  {
    name: "Lagoa da Conceição",
    desc: "Charmosa, boêmia, trilhas, kitesurf e ótimos restaurantes.",
    // Grande lâmina d'água com montanha ao fundo — Florianópolis
    img: "https://images.unsplash.com/photo-1673205918089-0db97ee2acd0?w=600&q=80",
    tag: "Alternativo",
    tagColor: "#26C6A0",
  },
  {
    name: "Ingleses",
    desc: "Bairro familiar com praia extensa e opções econômicas.",
    // Praia com cidade ao fundo — Florianópolis
    img: "https://images.unsplash.com/photo-1667323567051-1a04b9a23609?w=600&q=80",
    tag: "Família",
    tagColor: "#00A8E8",
  },
  {
    name: "Centro",
    desc: "Localização central, próximo ao terminal e comércio.",
    // Ponte Hercílio Luz com a cidade de Florianópolis ao fundo
    img: "https://images.unsplash.com/photo-1663001899005-a76fd718e2bf?w=600&q=80",
    tag: "Prático",
    tagColor: "#9b59b6",
  },
  {
    name: "Barra da Lagoa",
    desc: "Vila de pescadores, mar aberto e lagoa lado a lado.",
    // Canal da Barra da Lagoa com mata nativa — foto de Paulo Beckman, Florianópolis
    img: "https://images.unsplash.com/photo-1697032105602-3386d7406434?w=600&q=80",
    tag: "Natureza",
    tagColor: "#e67e22",
  },
  {
    name: "Sul da Ilha",
    desc: "Praias selvagens, Pantano do Sul, tranquilidade total.",
    // Vista de praia selvagem do topo do morro — Sul da Ilha, Florianópolis
    img: "https://images.unsplash.com/photo-1601826387819-231bf0c7d477?w=600&q=80",
    tag: "Tranquilo",
    tagColor: "#2ecc71",
  },
];

const tips = [
  {
    icon: "calendar_month",
    title: "Reserve com Antecedência",
    desc: "No verão (dez–fev) a ilha fica lotada. Reserve meses antes para garantir o melhor preço e disponibilidade.",
    accent: "#f4c025",
  },
  {
    icon: "compare_arrows",
    title: "Compare Plataformas",
    desc: "Verifique Booking, Airbnb e site do hotel. Às vezes reservar direto sai mais barato e com melhores condições.",
    accent: "#00A8E8",
  },
  {
    icon: "star",
    title: "Leia as Avaliações",
    desc: "Avaliações recentes revelam mais do que as fotos. Foque em comentários sobre localização e limpeza.",
    accent: "#26C6A0",
  },
  {
    icon: "cancel",
    title: "Verifique o Cancelamento",
    desc: "Prefira opções com cancelamento gratuito, especialmente fora do verão, quando planos podem mudar.",
    accent: "#FF6F61",
  },
];

const Accommodations = () => {
  const [checkin, setCheckin] = useState(getDefaultDate(1));
  const [checkout, setCheckout] = useState(getDefaultDate(3));
  const [adults, setAdults] = useState("2");
  const [rooms, setRooms] = useState("1");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["accommodations", checkin, checkout, adults, rooms],
    queryFn: async () => {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-accommodations?checkin=${checkin}&checkout=${checkout}&adults=${adults}&rooms=${rooms}`;
      const res = await fetch(url, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      if (!res.ok) throw new Error("Erro ao buscar hospedagens");
      return res.json();
    },
    enabled: searchTriggered,
  });

  const accommodations = data?.data ?? [];

  const handleSearch = () => {
    setSearchTriggered(true);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <SEO
        title="Hospedagem em Florianópolis – Hotéis, Pousadas e Resorts"
        description="Encontre os melhores hotéis, pousadas e resorts em Florianópolis. Compare preços, avaliações e reserve sua estadia na Ilha da Magia."
        url="/hospedagem"
      />
      <SiteHeader />

      <main className="pb-24 md:pb-0">
        {/* ── HERO ──────────────────────────────────────────── */}
        <section
          className="relative flex items-center min-h-[68vh] md:min-h-[62vh] pt-20 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a0e05 0%, #2d1a0a 50%, #1a0e05 100%)" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80)" }}
          />
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, #f4c025 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: "radial-gradient(circle, #FF6F61 0%, transparent 70%)" }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border"
                  style={{ color: "#f4c025", borderColor: "#f4c025", background: "rgba(244,192,37,0.1)" }}
                >
                  <span className="material-symbols-outlined text-sm">hotel</span>
                  Hotéis · Pousadas · Resorts
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                Onde Ficar em{" "}
                <span style={{ color: "#f4c025" }} className="italic">
                  Florianópolis
                </span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl mb-10 max-w-xl">
                Das pousadas à beira-mar aos resorts de luxo em Jurerê. Compare, escolha e reserve sua estadia na Ilha da Magia.
              </p>

              {/* Search form */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 max-w-4xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Check-in</label>
                    <input
                      type="date"
                      value={checkin}
                      min={getDefaultDate(0)}
                      onChange={(e) => setCheckin(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white outline-none focus:border-[#f4c025] transition-colors text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Check-out</label>
                    <input
                      type="date"
                      value={checkout}
                      min={checkin}
                      onChange={(e) => setCheckout(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white outline-none focus:border-[#f4c025] transition-colors text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Hóspedes</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-base">person</span>
                      <input
                        type="number"
                        value={adults}
                        min="1"
                        max="10"
                        onChange={(e) => setAdults(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-3 text-white outline-none focus:border-[#f4c025] transition-colors text-sm w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-wider">Quartos</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-base">bed</span>
                      <input
                        type="number"
                        value={rooms}
                        min="1"
                        max="5"
                        onChange={(e) => setRooms(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-3 text-white outline-none focus:border-[#f4c025] transition-colors text-sm w-full"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-slate-900 transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #f4c025, #e6b020)" }}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-xl">search</span>
                  )}
                  {isLoading ? "Buscando..." : "Buscar Hospedagem"}
                </button>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent" />
        </section>

        {/* ── ACCOMMODATION TYPES ───────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f4c025" }}>
              Tipos de Hospedagem
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-1">Escolha sua Experiência</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {accommodationTypes.map((type) => (
              <button
                key={type.label}
                onClick={handleSearch}
                className="relative rounded-2xl overflow-hidden group text-left h-44 cursor-pointer focus:outline-none"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${type.img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="material-symbols-outlined text-xl mb-1 block" style={{ color: "#f4c025" }}>
                    {type.icon}
                  </span>
                  <p className="text-white font-extrabold text-sm leading-tight">{type.label}</p>
                  <p className="text-white/60 text-xs mt-0.5">{type.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── SEARCH RESULTS ────────────────────────────────── */}
        {(searchTriggered || isLoading) && (
          <section className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
            <div className="mb-6">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-slate-500">Buscando as melhores opções para você…</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold">
                    {accommodations.length > 0
                      ? `${accommodations.length} hospedagens encontradas`
                      : "Nenhuma hospedagem encontrada"}
                  </h2>
                  {data?.source && (
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
                      via {data.source === "cache" ? "Cache" : "Booking.com"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                    <Skeleton className="h-52 w-full rounded-none" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && searchTriggered && accommodations.length === 0 && (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 block mb-4">hotel</span>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                  Nenhuma hospedagem encontrada para as datas selecionadas.
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                  Tente ajustar as datas ou o número de hóspedes.
                </p>
              </div>
            )}

            {!isLoading && accommodations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map((acc: any, i: number) => (
                  <motion.div
                    key={acc.external_id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative h-52 overflow-hidden">
                      {acc.photo_url ? (
                        <img
                          src={acc.photo_url}
                          alt={acc.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">hotel</span>
                        </div>
                      )}
                      {acc.star_rating && (
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-[#f4c025] text-[#f4c025]" />
                          <span className="text-xs font-bold">{acc.star_rating}</span>
                        </div>
                      )}
                      {acc.price_per_night && (
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            R$ {Number(acc.price_per_night).toFixed(0)}
                            <span className="font-medium text-slate-500 dark:text-slate-400">/noite</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                        {acc.name}
                      </h3>
                      <p className="text-sm text-slate-400 flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        Florianópolis, SC
                      </p>
                      {acc.review_score && (
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="text-xs font-extrabold px-2 py-0.5 rounded-lg text-slate-900"
                            style={{ background: "#f4c025" }}
                          >
                            {acc.review_score}
                          </span>
                          <span className="text-xs text-slate-400">
                            {acc.review_count ? `${acc.review_count} avaliações` : "Avaliado"}
                          </span>
                        </div>
                      )}
                      {acc.booking_url ? (
                        <a
                          href={acc.booking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center py-2.5 rounded-xl font-bold text-sm text-slate-900 hover:opacity-90 transition-opacity"
                          style={{ background: "#f4c025" }}
                        >
                          Ver disponibilidade
                        </a>
                      ) : (
                        <div className="py-2.5 text-center text-sm text-slate-400">Consultar preço</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── NEIGHBORHOODS ─────────────────────────────────── */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#26C6A0" }}>
              Onde Ficar
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-1">Os Melhores Bairros para se Hospedar</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base max-w-2xl">
              Florianópolis tem regiões com personalidades muito diferentes. Escolha o bairro que mais combina com seu estilo de viagem.
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {neighborhoods.map((hood) => (
                <div key={hood.name} className="relative rounded-2xl overflow-hidden group cursor-pointer h-48">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${hood.img})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full text-slate-900"
                      style={{ background: hood.tagColor }}
                    >
                      {hood.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-extrabold text-base">{hood.name}</h3>
                    <p className="text-white/70 text-xs mt-0.5 line-clamp-2">{hood.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TIPS ──────────────────────────────────────────── */}
        <section
          className="py-16"
          style={{ background: "linear-gradient(180deg, transparent 0%, rgba(244,192,37,0.04) 100%)" }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#f4c025" }}>
                Dicas de Hospedagem
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-1">Como Reservar com Inteligência</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {tips.map((tip) => (
                <div
                  key={tip.title}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${tip.accent}18` }}
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ color: tip.accent }}>
                      {tip.icon}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base mb-2">{tip.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOOKING CTA ───────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-12">
          <div
            className="rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{ background: "linear-gradient(135deg, #1a0e05 0%, #2d1a0a 100%)" }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#f4c025" }}>
                Pronto para reservar?
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                Encontre a hospedagem perfeita
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-md">
                Use o formulário acima para comparar preços em tempo real via Booking.com e garantir a melhor oferta para sua estadia.
              </p>
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="shrink-0 px-8 py-4 rounded-2xl font-extrabold text-slate-900 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60"
              style={{ background: "#f4c025" }}
            >
              <span className="material-symbols-outlined">search</span>
              Buscar Agora
            </button>
          </div>
        </section>
      </main>

      <SiteFooter />
      <BottomNav />
    </div>
  );
};

export default Accommodations;
