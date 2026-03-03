import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import cardFlights from "@/assets/card-flights.jpg";
import cardBeaches from "@/assets/card-beaches.jpg";
import cardHotels from "@/assets/card-hotels.jpg";
import cardDining from "@/assets/card-dining.jpg";

const features = [
  {
    image: cardFlights,
    title: "Voos em Tempo Real",
    description: "Acompanhe chegadas e partidas do Aeroporto de Florianópolis ao vivo",
    tag: "Ao Vivo",
    tagColor: "bg-coral",
    href: "/flights",
  },
  {
    image: cardBeaches,
    title: "Melhores Praias",
    description: "42 praias paradisíacas para todos os estilos — das mais calmas às ideais para surf",
    tag: "Top 10",
    tagColor: "bg-ocean",
    href: "/praias",
  },
  {
    image: cardHotels,
    title: "Hotéis Recomendados",
    description: "Encontre a hospedagem perfeita com os melhores preços e avaliações",
    tag: "Ofertas",
    tagColor: "bg-tropical",
    href: "/hospedagem",
  },
  {
    image: cardDining,
    title: "Restaurantes Populares",
    description: "Frutos do mar frescos, culinária açoriana e gastronomia internacional",
    tag: "Novo",
    tagColor: "bg-sunset",
    href: "/gastronomia",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const FeaturedCards = () => {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-ocean mb-3 font-body">
            Explore Florianópolis
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            De voos em tempo real a praias secretas — planeje cada detalhe da sua viagem perfeita
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feat) => (
            <motion.a
              key={feat.title}
              variants={item}
              href={feat.href}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Image */}
              <img
                src={feat.image}
                alt={feat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent transition-opacity duration-300 group-hover:from-foreground/80" />

              {/* Tag */}
              <span
                className={`absolute top-4 left-4 ${feat.tagColor} text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-md`}
              >
                {feat.tag}
              </span>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-display text-xl font-bold text-card mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-card/70 text-sm font-body mb-3 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  {feat.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-card text-sm font-semibold group-hover:gap-2.5 transition-all duration-300">
                  Explorar <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCards;
