import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Sparkles } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-20 md:py-28 px-4 bg-secondary relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-ocean/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto text-center max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-ocean/10 text-ocean-deep text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Newsletter
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Receba dicas exclusivas de Floripa
          </h2>
          <p className="text-muted-foreground text-lg mb-8 font-body">
            Ofertas de hotéis, eventos especiais e roteiros personalizados direto no seu email
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-tropical font-semibold text-lg"
            >
              <CheckCircle className="w-6 h-6" />
              Inscrição realizada com sucesso!
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                required
                className="flex-1 px-5 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all text-sm shadow-sm"
              />
              <button
                type="submit"
                className="bg-gradient-ocean text-primary-foreground px-7 py-4 rounded-xl font-semibold text-sm hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
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
