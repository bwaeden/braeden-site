export default function HomePage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center" data-test="hero-section">
      <h1
        data-test="hero-display"
        className="font-serif text-[clamp(4rem,12vw,6rem)] leading-[1.05] font-bold"
      >
        Braeden
      </h1>
    </section>
  );
}
