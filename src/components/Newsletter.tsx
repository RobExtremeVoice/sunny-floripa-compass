import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-primary/30">
        <div className="text-center md:text-left md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Receba o Sol de Floripa
          </h2>
          <p className="text-slate-800 text-lg font-medium">
            Junte-se a mais de 50.000 amantes da ilha e receba as melhores dicas de viagem, lugares secretos e ofertas
            exclusivas.
          </p>
        </div>
        <div className="w-full md:w-auto">
          {submitted ? (
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg justify-center">
              <span className="material-symbols-outlined">check_circle</span>
              Inscrição realizada com sucesso!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                className="px-6 py-4 rounded-xl border-none focus:ring-4 focus:ring-white/50 min-w-[300px] text-slate-900 outline-none"
                placeholder="Seu melhor e-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                type="submit"
              >
                Inscrever-se
              </button>
            </form>
          )}
          <p className="text-xs text-slate-800 mt-3 font-medium text-center md:text-left">
            Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
