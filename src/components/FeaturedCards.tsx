const cards = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2-KwfIS3yM8IO1W_lP0sOhN-yUX8_b87YyArz3aU7NI28AI77v7BwDxuUDCnubRHrAeNDuVFreZGZu-o-9xfyH8SEZ9opAjLZFrSzeFzM8RozxdpzbrykdKV1zzZ8jIVSG5uKVWmOGMw5DEQvMv66lprTQHbw_eyXPxSoqGUey4rCrfEZTo2Nw9XMEJLoWIR5_ix1HqRNbmo52c7XNCcxoQBM0li-vMKiVVWTtzG9WGAjpps587tAa-gJfzbivBjRL9owcj90xg",
    title: "Praias Incríveis",
    description: "Explore turquoise waters and white sands across 42 beaches.",
    href: "/praias",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALoHrAvepP2jnoyxC0s7p6H5vjLQAmjoPUSH3mTgEnEBHKkhhNkfjkC5Xs3whgPE3KToVEWjPMKyqa698uDbN6h8TyXocPhApXR3_98DVBl1yRxScyFD8pKxe3Fa2V8sKmVRUfJNvFFVYBs8odeiWB4qxrU5lkPTw26c-bLMEzmYmTcZdVTPEFSx3Xo2lKh4tXVz8aIKsrwxydFuHngNRIDp377Bw893W3GdnAHlr85698DtnneBQgSrYcT0goeKngNYi3i0Jh7j4",
    title: "Gastronomia Premiada",
    description: "Savor the best seafood in the region at Ribeirão da Ilha.",
    href: "/gastronomia",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbffhyDt0bzdCQRFX89Rb48b15UJVCL9CtVxEMkAnv-N9QlC5xMBzP4SIiMAUkFiTYzZwaaLeEBeOvYnGtugkhfgP643eV3PUgN7p67iNJDegxTJgx94eS3woBjgHsqLvtrFU8TsCar-hFixbztDZT83P80Cdbm5B3JYjkAUvrYaXXM5jSxPtJw_Vof1sTln4uvFJhY8-VCMvj2vjAgjK2ApSrcUfJBXmbcCSbX5coLhCVTwNvIW_CVx-lLzc0Lgvo7K90j9npmOY",
    title: "Trilhas na Mata Atlântica",
    description: "Adventure through lush coastal forests and hidden waterfalls.",
    href: "/entretenimento",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAl-6_iRUherjsOjSi6FG0Hpxy_5oNYXsvqZ5GY1I5w04sKtsKuUW-j7UuEB648B8IsnFMdceZViEMJypHY8rP5xmlBqxENV3CpQ8hUQueLqUYL6iyOmX73kQg-XtLdFCINN2l2kwJ2ztlG1q-W5McnL0L2nrMOSyFUvPcyC9YJIyXFGG4KNwh4-dXCc0S9_ssui83670-CN7FSWMud4RaA71WL_cTGGmt_zRigt8dX_s4PaxHqxX_DVCgz6bnvnMgnW5H7SzkjNMQ",
    title: "Cultura Local",
    description: "Discover the rich history, lace-makers, and Azorean traditions.",
    href: "/entretenimento",
  },
];

const FeaturedCards = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-20">
      <div className="text-center mb-8 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Viva a Ilha</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto italic">
          De picos de surf de classe mundial a vilas coloniais escondidas.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <a key={card.title} href={card.href} className="group cursor-pointer">
            <div className="relative h-[400px] rounded-2xl overflow-hidden mb-4 shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${card.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-xl font-bold mb-1">{card.title}</h3>
                <p className="text-white/80 text-sm line-clamp-2">{card.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCards;
