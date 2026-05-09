export default function HomePage() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center" data-test="hero-section">
      <h1
        data-test="hero-display"
        className="font-serif font-bold leading-[1.05] text-[clamp(4rem,12vw,6rem)]"
      >
        Braeden
      </h1>
    </section>
  );
}
