export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="grid-bg" aria-hidden />
      <div className="wrap">
        <div className="hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Bengaluru · Karnataka</p>
            <h1>
              <span>Letsbuild</span>
              <span className="gold">wiser</span>
              <span className="sr"> — Civil Engineering Consultation &amp; Construction in Bengaluru</span>
            </h1>
            <i className="rule" aria-hidden />
            <p className="hero__sub">Civil Engineering Consultation &amp; Construction</p>
            <p className="dek">
              Expert civil engineering consultation &amp; residential construction in Bengaluru. Structural design,
              regulatory compliance, cost optimization, and quality construction — from blueprint to build.
            </p>
            <div className="hero__cta">
              <a className="btn btn--gold" href="#contact">
                Get in Touch{" "}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M2 8h11M9 3.5L13.5 8 9 12.5" />
                </svg>
              </a>
              <a className="btn" href="#principles">
                Our Principles
              </a>
            </div>
          </div>
        </div>

        <a className="scrollcue" href="#story">
          <i aria-hidden />
          Scroll to explore
        </a>
      </div>
    </section>
  );
}
