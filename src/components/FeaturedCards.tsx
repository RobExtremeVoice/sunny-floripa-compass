import { motion } from "framer-motion";
import { Plane, Star, ArrowRight } from "lucide-react";
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
    href: "#voos",
  },
  {
    image: cardBeaches,
    title: "Melhores Praias",
    description: "42 praias paradisíacas para todos os estilos — das mais calmas às ideais para surf",
    tag: "Top 10",
    tagColor: "bg-ocean",
    href: "#praias",
  },
  {
    image: cardHotels,
    title: "Hotéis Recomendados",
    description: "Encontre a hospedagem perfeita com os melhores preços e avaliações",
    tag: "Ofertas",
    tagColor: "bg-tropical",
    href: "#hospedagem",
  },
  {
    image: cardDining,
    title: "Restaurantes Populares",
    description: "Frutos do mar frescos, culinária açoriana e gastronomia internacional",
    tag: "Novo",
    tagColor: "bg-sunset",
    href: "#gastronomia",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const FeaturedCards = () => {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase text-ocean mb-3 font-body">
            Explore Florianópolis
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            De voos em tempo real a praias secretas — planeje cada detalhe da sua viagem perfeita
          </p>
        </div>

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
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-card-hover transition-shadow"
            >
              {/* Image */}
              <img
                src={feat.image}
                alt={feat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-card-hover" />

              {/* Tag */}
              <span
                className={`absolute top-4 left-4 ${feat.tagColor} text-primary-foreground text-xs font-bold px-3 py-1 rounded-full`}
              >
                {feat.tag}
              </span>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-xl font-bold text-card mb-1">
                  {feat.title}
                </h3>
                <p className="text-card/75 text-sm font-body mb-3 line-clamp-2">
                  {feat.description}
                </p>
                <span className="inline-flex items-center gap-1 text-card text-sm font-semibold group-hover:gap-2 transition-all">
                  Explorar <ArrowRight className="w-4 h-4" />
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
