import { motion } from "framer-motion";
import { Sun, Droplets, Wind, Thermometer } from "lucide-react";

const highlights = [
  {
    icon: Sun,
    stat: "300+",
    label: "Dias de sol por ano",
  },
  {
    icon: Droplets,
    stat: "42",
    label: "Praias para explorar",
  },
  {
    icon: Wind,
    stat: "100+",
    label: "Trilhas ecológicas",
  },
  {
    icon: Thermometer,
    stat: "25°C",
    label: "Temperatura média",
  },
];

const StatsBar = () => {
  return (
    <section className="bg-primary py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
        >
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.label} className="text-center">
                <Icon className="w-7 h-7 text-ocean-light mx-auto mb-3" />
                <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  {h.stat}
                </p>
                <p className="text-primary-foreground/70 text-sm font-body">
                  {h.label}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsBar;
