import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-20 md:py-28 px-4 bg-secondary">
      <div className="container mx-auto text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-ocean mb-3 font-body">
            Fique por dentro
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Receba dicas exclusivas de Floripa
          </h2>
          <p className="text-muted-foreground text-lg mb-8 font-body">
            Ofertas de hotéis, eventos especiais e roteiros personalizados direto no seu email
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-tropical font-semibold">
              <CheckCircle className="w-5 h-5" />
              Inscrição realizada com sucesso!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                required
                className="flex-1 px-5 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all text-sm"
              />
              <button
                type="submit"
                className="bg-gradient-ocean text-primary-foreground px-6 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
              >
                <Send className="w-4 h-4" />
                Inscrever
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
