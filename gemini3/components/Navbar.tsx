"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const prog = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setStuck(y > 24);
      if (prog.current) prog.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
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

  return (
    <header className={`bar${stuck ? " is-stuck" : ""}`}>
      <div className="wrap bar__in">
        <Link className="logo" href="/" aria-label="Letsbuildwiser — home">
          Letsbuild<span className="gold">wiser</span>
        </Link>
        <nav aria-label="Primary">
          <Link className="lnk" href="/">
            Home
          </Link>
          <Link className="btn btn--sm btn--gold" href="/#contact">
            Contact Us
          </Link>
        </nav>
      </div>
      <i className="bar__prog" ref={prog} aria-hidden />
    </header>
  );
}
