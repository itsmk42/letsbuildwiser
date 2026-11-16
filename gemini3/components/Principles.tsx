const PRINCIPLES = [
  { n: "01", icon: "i-structure", title: "Structural Safety", line: "We prioritize your safety above all." },
  { n: "02", icon: "i-cost", title: "Cost Optimization", line: "Smart engineering saves money." },
  { n: "03", icon: "i-comply", title: "Regulatory Compliance", line: "Navigate approvals with ease." },
  { n: "04", icon: "i-time", title: "Timely Delivery", line: "Efficient project management means no delays." },
  { n: "05", icon: "i-quality", title: "Quality Assurance", line: "Every detail matters." },
  { n: "06", icon: "i-green", title: "Sustainable Design", line: "Building for tomorrow." },
];

export default function Principles() {
  return (
    <section className="sum" id="principles" aria-labelledby="sum-h">
      {/* icon symbols */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <symbol id="i-structure" viewBox="0 0 120 90"><g className="lines" strokeWidth="3"><path d="M8 60H112" /><path d="M52 60V16M68 60V16" /><path d="M34 82H86V72L72 62H48L34 72Z" /><path d="M18 16H102M18 27H102" /></g></symbol>
        <symbol id="i-cost" viewBox="0 0 120 90"><g className="lines" strokeWidth="3"><path d="M16 22H72L104 45L72 68H16Z" /><circle cx="80" cy="45" r="4.5" /></g><text x="32" y="55">₹</text></symbol>
        <symbol id="i-comply" viewBox="0 0 120 90"><g className="lines" strokeWidth="3"><circle cx="60" cy="45" r="34" /><path d="M45 45l11 11 19-22" /></g></symbol>
        <symbol id="i-time" viewBox="0 0 120 90"><g className="lines" strokeWidth="3"><path d="M22 20H98V78H22Z" /><path d="M22 36H98" /><path d="M42 10V26M78 10V26" /><path d="M45 56l10 9 20-19" /></g></symbol>
        <symbol id="i-quality" viewBox="0 0 120 90"><g className="lines" strokeWidth="3"><path d="M60 8L94 21V46C94 65 77 77 60 84C43 77 26 65 26 46V21Z" /><path d="M45 46l11 11 19-22" /></g></symbol>
        <symbol id="i-green" viewBox="0 0 120 90"><g className="lines" strokeWidth="3"><circle cx="92" cy="22" r="10" /><path d="M24 78C22 42 54 26 88 46C84 72 54 86 24 78Z" /><path d="M24 78C42 64 58 56 76 51" /></g></symbol>
      </defs>
      </svg>

      <div className="wrap">
        <div className="sum__head rv">
          <div>
            <p className="eyebrow">At a glance</p>
            <h2 id="sum-h">Six principles</h2>
          </div>
          <p>The principles behind every Letsbuildwiser home. Select one to see it in the drawing.</p>
        </div>

        <div className="cards">
          {PRINCIPLES.map((p, idx) => (
            <a
              key={p.n}
              className="card rv"
              href={`#step-${idx + 1}`}
              style={{ "--d": idx % 3 } as React.CSSProperties}
            >
              <div className="card__n">
                <span>{p.n}</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M4 12L12 4M5.5 4H12v6.5" />
                </svg>
              </div>
              <div className="card__ico">
                <svg viewBox="0 0 120 90" aria-hidden>
                  <use href={`#${p.icon}`} />
                </svg>
              </div>
              <h3>{p.title}</h3>
              <p>{p.line}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
