"use client";

import { useEffect, useRef, useState } from "react";
import HouseDrawing from "./HouseDrawing";

/** Readout per step: title, caption and (line-drawing fallback only) camera transform. */
const FIGURE = [
  { t: "The plan", cap: "The floor plan. Scroll to start building.", view: "none" },
  { t: "Structural Safety", cap: "Footings, columns and the plinth go in first.", view: "scale(1.14) translateY(-6%)" },
  { t: "Cost Optimization", cap: "Ground-floor walls rise and the first slab is cast.", view: "scale(1.06) translateY(-3%)" },
  { t: "Regulatory Compliance", cap: "Setbacks and height limits frame the first floor.", view: "none" },
  { t: "Timely Delivery", cap: "Roof, doors and windows follow the programme.", view: "none" },
  { t: "Quality Assurance", cap: "Finishes go on, and each stage is checked.", view: "scale(1.05)" },
  { t: "Sustainable Design", cap: "Pool, garden and palms complete the home.", view: "none" },
];

const PRINCIPLES = [
  {
    kicker: "Foundation & frame",
    title: "Structural Safety",
    lead: "We prioritize your safety above all.",
    body: "Rigorous calculations and stress testing ensure a home that stands strong for generations.",
  },
  {
    kicker: "Slabs & dimensions",
    title: "Cost Optimization",
    lead: "Smart engineering saves money.",
    body: "We optimize material usage and construction methods to deliver premium quality within budget.",
  },
  {
    kicker: "Setbacks & approvals",
    title: "Regulatory Compliance",
    lead: "Navigate approvals with ease.",
    body: "Our designs adhere strictly to all local building codes and zoning regulations.",
  },
  {
    kicker: "Walls & programme",
    title: "Timely Delivery",
    lead: "Efficient project management means no delays.",
    body: "We respect your time and ensure your dream home is ready when promised.",
  },
  {
    kicker: "Finishes & checks",
    title: "Quality Assurance",
    lead: "Every detail matters.",
    body: "Our rigorous site supervision and quality control protocols ensure flawless execution from foundation to finishing.",
  },
  {
    kicker: "Sun, shade & water",
    title: "Sustainable Design",
    lead: "Building for tomorrow.",
    body: "We integrate energy-efficient solutions and eco-friendly materials for a home that respects the environment.",
  },
];

type Part = { el: SVGElement; s: number };
type SceneApi = {
  setStage(s: number): void;
  resize(): void;
  setActive(on: boolean): void;
  dispose(): void;
};

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const gl = useRef<HTMLCanvasElement>(null);
  const parts = useRef<Part[]>([]);
  const scene = useRef<SceneApi | null>(null);
  const position = useRef(0); // continuous story position: 0 = plan … 7 = finished home … 8 = logo

  const [step, setStep] = useState(0);
  const [is3d, setIs3d] = useState(false);
  const [finale, setFinale] = useState(false);

  /* 3D build. If WebGL is unavailable the line drawing below stays visible instead. */
  useEffect(() => {
    const canvas = gl.current;
    const stageEl = stage.current;
    if (!canvas || !stageEl) return;

    let cancelled = false;
    let api: SceneApi | null = null;
    let io: IntersectionObserver | undefined;

    import("./houseScene")
      .then((m) => {
        if (cancelled) return;
        api = m.createHouseScene(canvas, { assets: "/scene/" }) as SceneApi;
        scene.current = api;
        api.setStage(position.current);
        setIs3d(true);
        if ("IntersectionObserver" in window) {
          io = new IntersectionObserver((entries) => entries.forEach((e) => api?.setActive(e.isIntersecting)));
          io.observe(stageEl);
        }
      })
      .catch((err) => console.warn("3D scene unavailable, using the line drawing instead.", err));

    const onResize = () => api?.resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      io?.disconnect();
      api?.dispose();
      scene.current = null;
    };
  }, []);

  /* Index the fallback drawing's parts once, then follow the scroll position. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const list: Part[] = [];
    el.querySelectorAll<SVGGElement>("#house [data-s]").forEach((g) => {
      const s = Number(g.dataset.s);
      g.querySelectorAll<SVGElement>(".d, .f").forEach((node, i) => {
        if (node.classList.contains("d")) node.setAttribute("pathLength", "1");
        node.style.setProperty("--i", String(i));
        list.push({ el: node, s });
      });
    });
    parts.current = list;

    const stepEls = Array.from(el.querySelectorAll<HTMLElement>(".step"));
    const hud = el.querySelector<HTMLElement>(".hud");
    const bar = document.querySelector<HTMLElement>(".bar");
    const desktop = window.matchMedia("(min-width:1024px)");
    let ticking = false;

    const update = () => {
      ticking = false;
      // fallback grid drifts with the scroll
      if (grid.current) grid.current.style.transform = `translateY(${-(window.scrollY * 0.12) % 48}px)`;

      // a step starts once its card has entered the lower part of the screen;
      // each card fades in at the bottom and fades out as it reaches the top
      const vh = window.innerHeight;
      const line = vh * (desktop.matches ? 0.78 : 0.82);
      const fadeTop = desktop.matches
        ? (bar?.offsetHeight ?? 68) + 12
        : (hud?.getBoundingClientRect().bottom ?? 136) + 6;
      let s = 0;
      for (const stepEl of stepEls) {
        const r = stepEl.getBoundingClientRect();
        if (r.top <= line) s = Number(stepEl.dataset.step) + Math.min(1, (line - r.top) / r.height);
        const card = stepEl.firstElementChild as HTMLElement | null;
        if (card) {
          const o = Math.max(0, Math.min(1, (vh - r.top) / 140, (r.top - fadeTop) / 70));
          card.style.opacity = String(o);
          card.style.pointerEvents = o < 0.2 ? "none" : "";
        }
      }
      position.current = s;
      setStep(Math.min(6, Math.floor(s)));

      // the 3D build follows the scroll; the logo lock-up reveals over the closing shot
      scene.current?.setStage(s);
      const fin = Math.max(0, Math.min(1, (s - 7.12) / 0.55));
      stage.current?.style.setProperty("--fin", fin.toFixed(3));
      setFinale(fin > 0.6);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Fallback line drawing: draw everything up to the current step; the newest work is gold. */
  useEffect(() => {
    for (const p of parts.current) {
      p.el.classList.toggle("on", p.s <= step);
      p.el.classList.toggle("cur", step > 0 && p.s === step);
    }
    const house = root.current?.querySelector<SVGSVGElement>("#house");
    if (house) house.style.transform = FIGURE[step].view;
  }, [step]);

  const fig = FIGURE[step];
  const stageClass = `stage${is3d ? " is-3d" : ""}${finale ? " is-finale" : ""}`;

  return (
    <section ref={root} className="story" id="story" aria-label="How we build: six principles">
      <div className={stageClass} ref={stage}>
        <div className="grid-bg" ref={grid} aria-hidden />
        <canvas className="stage__gl" ref={gl} aria-hidden />

        <div className="finale">
          <p className="finale__mark">
            Letsbuild<span className="gold">wiser</span>
          </p>
          <i className="finale__rule" aria-hidden />
          <p className="finale__tag">Civil Engineering Consultation &amp; Construction</p>
          <a className="btn btn--gold finale__cta" href="#contact" tabIndex={finale ? undefined : -1}>
            Get in Touch
          </a>
        </div>

        <div className="hud" aria-hidden>
          <div className="hud__row">
            <span className="hud__n">
              <b>0{step}</b> / 06
            </span>
            <span className="hud__t">{fig.t}</span>
          </div>
          <div className="segs">
            {PRINCIPLES.map((_, i) => (
              <i key={i} className={i < step ? "on" : undefined} />
            ))}
          </div>
          <p className="hud__cap">{fig.cap}</p>
        </div>

        <div className="stage__draw" aria-hidden>
          <HouseDrawing />
        </div>
      </div>

      <div className="flow wrap">
        <article className={`step${step === 0 ? " is-active" : ""}`} data-step="0">
          <div className="step__card">
            <p className="eyebrow">
              <span className="num">00</span>The build
            </p>
            <h2>Six principles. One home.</h2>
            <p>Scroll, and watch one home go up — from blueprint to build.</p>
          </div>
        </article>

        {PRINCIPLES.map((p, i) => {
          const n = i + 1;
          return (
            <article key={n} className={`step${step === n ? " is-active" : ""}`} id={`step-${n}`} data-step={n}>
              <div className="step__card">
                <p className="eyebrow">
                  <span className="num">0{n}</span>
                  {p.kicker}
                </p>
                <h3>{p.title}</h3>
                <p className="lead">{p.lead}</p>
                <p>{p.body}</p>
              </div>
            </article>
          );
        })}

        {/* scroll room for the closing shot and logo reveal */}
        <div className="step step--finale" data-step="7" aria-hidden />
      </div>
    </section>
  );
}
