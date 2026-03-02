import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import heroBeach from "@/assets/hero-beach.jpg";
import heroBridge from "@/assets/hero-bridge.jpg";

const slides = [
  {
    image: heroBeach,
    title: "Descubra a Ilha da Magia",
    subtitle: "Praias paradisíacas, natureza exuberante e cultura vibrante esperam por você em Florianópolis",
    cta: "Explorar Praias",
  },
  {
    image: heroBridge,
    title: "Sua Viagem Começa Aqui",
    subtitle: "Voos em tempo real, hotéis incríveis e roteiros personalizados para sua aventura perfeita",
    cta: "Ver Voos ao Vivo",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-hero-overlay" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-20 md:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-card leading-tight mb-4">
              {slides[current].title}
            </h1>
            <p className="text-card/85 text-lg md:text-xl mb-8 max-w-xl font-body">
              {slides[current].subtitle}
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-gradient-ocean text-primary-foreground px-8 py-4 rounded-lg text-base font-semibold hover:opacity-90 transition-opacity"
            >
              {slides[current].cta}
              <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-10 bg-card" : "w-4 bg-card/40"
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
