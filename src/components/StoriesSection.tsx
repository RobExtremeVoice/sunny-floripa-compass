const stories = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_RHzQFGevaQQJeQ6Utr-QP8nYy5bD0ROJsgKNtiVjc8xJYK5w1cw5BRlstNpQ5HZ2A9cZ4wmDS7w6TKkX1dgVz8dTXCcDeLEtWoPYYMwPkQoNBQb7uoln54Hfn8VSUH3Hm0JpJe07PRHkIYhPf8I_djvvgdZUsOomjt8bH4EuZERpBf4l0OXQ1GPbCZc9z_-p8-BuWdDIgDr4CXzqHWMFaR-dFrBuYF9t86vhHk9BVTO_Ws8Rnq7mPZlGpFlBGyiSl9YwpZMJjN0",
    category: "LISTICLE",
    title: "Top 10 Lugares para ver o Pôr do Sol",
    excerpt: "Inspire-se com nossos guias curados da ilha.",
    href: "/blog",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKFKFReAGi2mi4rCvwClwyPtQ73mK_zHUxSi4ERcza7nLG7ZZFURudevdZ6HBEolpFveQQthEXJckL94QZJc8c5DhNiboFT_Fs2rmjxGZuJ5rbVpTNqy44W3CUqEQGqzLNcKzi3q8whnO1v_w6V_gWDTe9XRT_BiuTDGQamHjBnIjJAGsNQhI7B6rSUdzOu1x371qd50B8Og0pe-CcY3QbMK6bynZKiUUWqba0NwEfOeZs77tqPqtaaRGDlSMVExIWyKybQDm-WsI",
    category: "GASTRONOMY",
    title: "A Capital das Ostras: Guia do Ribeirão",
    excerpt: "Inspire-se com nossos guias curados da ilha.",
    href: "/blog",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlo4c-XQB_0jnrr6_6vfwSaEWuxK4SBzpFWtV9CBbXK8QRny--k2iUkzZ2caAT_QpEy_oYNSQM2P_YaGxJ6bM84LY48eYb-B3g-Ie5ZnRYURdOoz5LioJpV-SLDoH3OrwuEvHlG_ynxH2Hn4L6FqNrZZxEq0zJnceIZov2TnewlIBAFQnHsqNXcId0ysLz0VoU8DSlRj1a T44kyEzdDrLokixvae23zzyBHbsg7QNfn64Q30gMXULvUPVqJNmHUt_0KAcurLg7GH8",
    category: "ADVENTURE",
    title: "Lagoas Secretas que você precisa conhecer",
    excerpt: "Inspire-se com nossos guias curados da ilha.",
    href: "/blog",
  },
];

const StoriesSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Histórias de Floripa</h2>
          <p className="text-slate-600 dark:text-slate-400">Inspire-se com nossos guias curados da ilha.</p>
        </div>
        <a
          href="/blog"
          className="text-primary font-bold hover:underline flex items-center gap-1 shrink-0 ml-4"
        >
          Ver todas as histórias{" "}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stories.map((story) => (
          <article
            key={story.title}
            className="group transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-md">
              <img
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                src={story.image}
                alt={story.title}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                {story.category}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
              {story.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{story.excerpt}</p>
            <a
              href={story.href}
              className="inline-flex items-center text-sm font-bold border-b-2 border-primary pb-1"
            >
              LER HISTÓRIA
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StoriesSection;
