import { motion } from "framer-motion";
import { Sun, Droplets, Wind, Thermometer } from "lucide-react";

const highlights = [
  { icon: Sun, stat: "300+", label: "Dias de sol por ano" },
  { icon: Droplets, stat: "42", label: "Praias para explorar" },
  { icon: Wind, stat: "100+", label: "Trilhas ecológicas" },
  { icon: Thermometer, stat: "25°C", label: "Temperatura média" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const StatsBar = () => {
  return (
    <section className="bg-gradient-ocean py-14 md:py-20 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary-foreground/5 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary-foreground/5 blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
        >
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <motion.div key={h.label} variants={item} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-foreground/15 transition-colors">
                  <Icon className="w-7 h-7 text-ocean-light" />
                </div>
                <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                  {h.stat}
                </p>
                <p className="text-primary-foreground/60 text-sm font-body">
                  {h.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsBar;
