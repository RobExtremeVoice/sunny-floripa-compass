import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      {/* ── Mobile: flat full-width yellow section ── */}
      <section className="md:hidden px-6 py-12 bg-primary">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Receba o Sol de Floripa</h2>
        <p className="text-slate-800 font-medium mb-8">
          Junte-se a mais de 50.000 amantes da ilha e receba as melhores dicas de viagem, lugares secretos e ofertas
          exclusivas.
        </p>
        {submitted ? (
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <span className="material-symbols-outlined">check_circle</span>
            Inscrição realizada com sucesso!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="w-full px-6 py-4 rounded-xl border-none focus:ring-4 focus:ring-white/50 text-slate-900 bg-white outline-none"
              placeholder="Seu melhor e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
              type="submit"
            >
              Inscrever-se
            </button>
          </form>
        )}
        <p className="text-[10px] text-slate-800 mt-4 font-medium opacity-80">
          Respeitamos sua privacidade. Cancele a inscrição a qualquer momento.
        </p>
      </section>

      {/* ── Desktop: card with rounded corners ───── */}
      <section className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary rounded-[2.5rem] p-8 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-primary/30">
          <div className="text-center md:text-left md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Receba o Sol de Floripa</h2>
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
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <input
                  className="px-6 py-4 rounded-xl border-none focus:ring-4 focus:ring-white/50 w-full md:min-w-[300px] text-slate-900 outline-none"
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
    </>
  );
};

export default Newsletter;
