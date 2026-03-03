import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, MapPin } from "lucide-react";
import heroBeach from "@/assets/hero-beach.jpg";
import heroBridge from "@/assets/hero-bridge.jpg";

const slides = [
  {
    image: heroBeach,
    title: "Descubra a Ilha da Magia",
    subtitle: "Praias paradisíacas, natureza exuberante e cultura vibrante esperam por você em Florianópolis",
    cta: "Explorar Praias",
    href: "/praias",
  },
  {
    image: heroBridge,
    title: "Sua Viagem Começa Aqui",
    subtitle: "Voos em tempo real, hotéis incríveis e roteiros personalizados para sua aventura perfeita",
    cta: "Planejar Viagem",
    href: "/planejar",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[640px] overflow-hidden">
      {/* Background Images with Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay — more dramatic */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-foreground/5" />

      {/* Location badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-24 md:top-28 left-4 md:left-auto md:right-8 z-10"
      >
        <span className="inline-flex items-center gap-1.5 bg-card/15 backdrop-blur-md text-card text-xs font-medium px-3 py-1.5 rounded-full border border-card/20">
          <MapPin className="w-3 h-3" />
          Florianópolis, SC — Brasil
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-24 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.h1
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-card leading-[1.1] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              className="text-card/80 text-lg md:text-xl mb-8 max-w-xl font-body leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {slides[current].subtitle}
            </motion.p>
            <motion.a
              href={slides[current].href}
              className="inline-flex items-center gap-2 bg-gradient-ocean text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              {slides[current].cta}
              <ChevronRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-12 bg-card" : "w-5 bg-card/35 hover:bg-card/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
