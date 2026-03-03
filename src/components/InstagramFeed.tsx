const photos = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB_RHzQFGevaQQJeQ6Utr-QP8nYy5bD0ROJsgKNtiVjc8xJYK5w1cw5BRlstNpQ5HZ2A9cZ4wmDS7w6TKkX1dgVz8dTXCcDeLEtWoPYYMwPkQoNBQb7uoln54Hfn8VSUH3Hm0JpJe07PRHkIYhPf8I_djvvgdZUsOomjt8bH4EuZERpBf4l0OXQ1GPbCZc9z_-p8-BuWdDIgDr4CXzqHWMFaR-dFrBuYF9t86vhHk9BVTO_Ws8Rnq7mPZlGpFlBGyiSl9YwpZMJjN0",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAlo4c-XQB_0jnrr6_6vfwSaEWuxK4SBzpFWtV9CBbXK8QRny--k2iUkzZ2caAT_QpEy_oYNSQM2P_YaGxJ6bM84LY48eYb-B3g-Ie5ZnRYURdOoz5LioJpV-SLDoH3OrwuEvHlG_ynxH2Hn4L6FqNrZZxEq0zJnceIZov2TnewlIBAFQnHsqNXcId0ysLz0VoU8DSlRj1aT44kyEzdDrLokixvae23zzyBHbsg7QNfn64Q30gMXULvUPVqJNmHUt_0KAcurLg7GH8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAKFKFReAGi2mi4rCvwClwyPtQ73mK_zHUxSi4ERcza7nLG7ZZFURudevdZ6HBEolpFveQQthEXJckL94QZJc8c5DhNiboFT_Fs2rmjxGZuJ5rbVpTNqy44W3CUqEQGqzLNcKzi3q8whnO1v_w6V_gWDTe9XRT_BiuTDGQamHjBnIjJAGsNQhI7B6rSUdzOu1x371qd50B8Og0pe-CcY3QbMK6bynZKiUUWqba0NwEfOeZs77tqPqtaaRGDlSMVExIWyKybQDm-WsI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbffhyDt0bzdCQRFX89Rb48b15UJVCL9CtVxEMkAnv-N9QlC5xMBzP4SIiMAUkFiTYzZwaaLeEBeOvYnGtugkhfgP643eV3PUgN7p67iNJDegxTJgx94eS3woBjgHsqLvtrFU8TsCar-hFixbztDZT83P80Cdbm5B3JYjkAUvrYaXXM5jSxPtJw_Vof1sTln4uvFJhY8-VCMvj2vjAgjK2ApSrcUfJBXmbcCSbX5coLhCVTwNvIW_CVx-lLzc0Lgvo7K90j9npmOY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ2-KwfIS3yM8IO1W_lP0sOhN-yUX8_b87YyArz3aU7NI28AI77v7BwDxuUDCnubRHrAeNDuVFreZGZu-o-9xfyH8SEZ9opAjLZFrSzeFzM8RozxdpzbrykdKV1zzZ8jIVSG5uKVWmOGMw5DEQvMv66lprTQHbw_eyXPxSoqGUey4rCrfEZTo2Nw9XMEJLoWIR5_ix1HqRNbmo52c7XNCcxoQBM0li-vMKiVVWTtzG9WGAjpps587tAa-gJfzbivBjRL9owcj90xg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAa3Lqj-8oiE-nXgGQp6aOaudweYn3AmWn3qH9XozEVDE3xQGfnyx50k_Dp75JCxfr0sYv0_9hCkpdMcFvI1C5sGeY4pj15kAgB6uOHR38mTnBm26gm5qGRRyw57BKbFrN5apvuBSd8G4HLWejJr8M-XHnBrAoj5aPIrBq1fngXFEFAYGFQCDKaqtluRa3bpNxcWwX4xwNCNSh2cZW0JVrvWtosmzJecWCLiI5FPtLuYr3NfnIG1_G4_AkfAMTEPG1OKIajGDuNUpQ",
];

const InstagramFeed = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-t border-slate-100 dark:border-slate-800">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Floripa no Instagram</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Compartilhe seus momentos usando #VisitFloripa
          </p>
        </div>
        <a
          href="#"
          className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shrink-0"
        >
          <span className="material-symbols-outlined text-xl">photo_camera</span>
          Siga @VisitFloripa
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {photos.map((src, i) => (
          <div key={i} className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
            <img
              src={src}
              alt={`Floripa Social ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramFeed;
