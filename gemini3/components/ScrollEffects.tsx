"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Page-level motion hooks that the stylesheet keys off:
 *  - body.is-loaded  → hero elevation draws itself
 *  - .rv → .rv.in    → sections fade up the first time they enter the viewport
 */
export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => document.body.classList.add("is-loaded"));
    });

    const targets = document.querySelectorAll<HTMLElement>(".rv:not(.in)");
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io?.unobserve(entry.target);
            }
          }),
        { rootMargin: "0px 0px -10% 0px" },
      );
      targets.forEach((t) => io?.observe(t));
    } else {
      targets.forEach((t) => t.classList.add("in"));
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
