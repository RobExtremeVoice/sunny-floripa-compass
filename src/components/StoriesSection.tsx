const stories = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ5lsClX_skmWbaQMMQr2QHE2udoBjBk7N5zTAavGe5WoyE2zsjroWz-H7annkcMhZT5KUsj7QvvU6xBT5_iJxOfMVadwWa7xOBR4oMrgfa3QE-R3euqj75vWpetmCh5yJQN4aFx_hkDa5cLr84suoxZ3ox9U9FI1g3CONQq1zZ9M6hM_glwLINBDD6o__3uHeHzhPuop4rxTMBUuW-dmBGuY4WQG8bD3ekfICKkqnZTCBcNmKO1kRK7KmHtbpCmPOVzGGYFtXiK0",
    category: "Tesouros Escondidos",
    title: "A Lagoa Secreta da Lagoinha",
    excerpt: "Inspire-se com nossos guias curados da ilha.",
    readTime: "15 min de leitura",
    location: "Leste da Ilha",
    href: "/blog",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDss-Jnyqsb-DpzKpOULaX0IuPPYQVXcBlBERdLW12_CmyEJ_tQ6lSqE6Vuzp9ldWJvnw3dJW21F_8TuYumbVMmnU7DJCHAOCc8ZvkEo1aXMp3NqIO5rCSyPGfvWK8sxH02fCrxzdI3tvKfeHXlPFyU6RGWZSOh6xMDg7u9TxuKbcU4SJTbvcLlnBGPY9cM1GkR7TbUInKpm72akzAB08q33ZSMSIwa7CngPIbzvn1FPdyH9FcmM_JEu_qPnWo9vwPj_JvCDLKN7H0",
    category: "Gastronomia",
    title: "Ostras: Do Mar para a Mesa",
    excerpt: "Inspire-se com nossos guias curados da ilha.",
    readTime: "8 min de leitura",
    location: "Ribeirão da Ilha",
    href: "/blog",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_RHzQFGevaQQJeQ6Utr-QP8nYy5bD0ROJsgKNtiVjc8xJYK5w1cw5BRlstNpQ5HZ2A9cZ4wmDS7w6TKkX1dgVz8dTXCcDeLEtWoPYYMwPkQoNBQb7uoln54Hfn8VSUH3Hm0JpJe07PRHkIYhPf8I_djvvgdZUsOomjt8bH4EuZERpBf4l0OXQ1GPbCZc9z_-p8-BuWdDIgDr4CXzqHWMFaR-dFrBuYF9t86vhHk9BVTO_Ws8Rnq7mPZlGpFlBGyiSl9YwpZMJjN0",
    category: "Listicle",
    title: "Top 10 Lugares para ver o Pôr do Sol",
    excerpt: "Inspire-se com nossos guias curados da ilha.",
    readTime: "10 min de leitura",
    location: "Toda a Ilha",
    href: "/blog",
  },
];

const StoriesSection = () => {
  return (
    <section className="py-8 md:py-32">
      {/* Section header */}
      <div className="px-6 md:max-w-7xl md:mx-auto md:px-4 sm:px-6 lg:px-8 flex items-end justify-between mb-6 md:mb-12">
        <div>
          <h2 className="text-xl md:text-4xl font-extrabold mb-1 md:mb-2">Histórias &amp; Experiências</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 hidden md:block">
            Inspire-se com nossos guias curados da ilha.
          </p>
        </div>
        <a href="/blog" className="text-primary font-bold text-sm hover:underline flex items-center gap-1 shrink-0 ml-4">
          Ver todas <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>

      {/* ── Mobile: vertical feed ─────────────────── */}
      <div className="md:hidden px-6 space-y-8">
        {stories.map((story) => (
          <a key={story.title} href={story.href} className="block group">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
              <img
                className="w-full h-full object-cover"
                src={story.image}
                alt={story.title}
              />
              <button
                onClick={(e) => e.preventDefault()}
                className="absolute top-4 right-4 bg-background-light/90 dark:bg-background-dark/90 p-2 rounded-full shadow-md"
              >
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>favorite</span>
              </button>
            </div>
            <p className="text-primary font-bold text-xs mb-1 uppercase tracking-tighter">{story.category}</p>
            <h4 className="text-xl font-extrabold tracking-tight mb-2">{story.title}</h4>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>schedule</span>
                {story.readTime}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>location_on</span>
                {story.location}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* ── Desktop: 3-column grid ────────────────── */}
      <div className="hidden md:grid md:grid-cols-3 gap-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {stories.map((story) => (
          <article key={story.title} className="group transition-transform duration-300 hover:-translate-y-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md">
              <img
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                src={story.image}
                alt={story.title}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                {story.category.toUpperCase()}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{story.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{story.excerpt}</p>
            <a href={story.href} className="inline-flex items-center text-sm font-bold border-b-2 border-primary pb-1">
              LER HISTÓRIA
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StoriesSection;
