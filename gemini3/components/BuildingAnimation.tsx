"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BuildingAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=1000%", // Moderate scroll length
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // --- TEXT ANIMATION SETUP (Left to Right Flow) ---
            // Helper to animate text blocks: Enter from Left, Exit to Right
            const animateText = (selector: string, startTime: number, duration: number) => {
                // Enter
                tl.fromTo(selector,
                    { opacity: 0, x: -100 },
                    { opacity: 1, x: 0, duration: duration * 0.2, ease: "power2.out" },
                    startTime
                );
                // Hold (implicit)
                // Exit
                tl.to(selector,
                    { opacity: 0, x: 100, duration: duration * 0.2, ease: "power2.in" },
                    startTime + duration * 0.8
                );
            };

            // --- CONSTRUCTION ANIMATION ---

            // 1. Site Prep & Foundation
            tl.fromTo(".ground-line", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
            tl.fromTo(".foundation-block", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 1 }, 0.5);

            animateText(".text-1", 0.5, 2); // "Foundation" text

            // 2. Ground Floor Structure (Columns & Slab)
            tl.fromTo(".gf-column",
                { scaleY: 0, transformOrigin: "bottom" },
                { scaleY: 1, duration: 1, stagger: 0.1 },
                1.5
            );
            tl.fromTo(".gf-slab", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 2.5);

            animateText(".text-2", 2.5, 2); // "Structure" text

            // 3. First Floor & Roof
            tl.fromTo(".ff-column",
                { scaleY: 0, transformOrigin: "bottom" },
                { scaleY: 1, duration: 1, stagger: 0.1 },
                3.5
            );
            tl.fromTo(".roof-slab", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 4.5);

            animateText(".text-3", 4.5, 2); // "Design" text

            // 4. Walls & Windows (Fill in)
            tl.fromTo(".wall-fill", { opacity: 0 }, { opacity: 1, duration: 2 }, 5.5);
            tl.fromTo(".window-glass",
                { scaleY: 0, transformOrigin: "top" },
                { scaleY: 1, duration: 1.5, stagger: 0.1 },
                6
            );

            // 5. Landscape & Details
            tl.fromTo(".landscape-tree",
                { scale: 0, transformOrigin: "bottom" },
                { scale: 1, duration: 1.5, stagger: 0.2, ease: "elastic.out(1, 0.5)" },
                7.5
            );
            tl.fromTo(".pool-water", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 8);

            animateText(".text-4", 7.5, 2.5); // "Final" text

            // Keep final state for a bit
            tl.to({}, { duration: 1 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">

            {/* --- TEXT OVERLAYS (Fixed Position, Animated via GSAP) --- */}
            <div className="absolute inset-0 pointer-events-none z-40 flex flex-col items-center justify-center text-center px-6">

                <div className="text-1 absolute opacity-0 max-w-4xl">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">Solid Foundations</h2>
                    <p className="text-2xl text-gray-300 font-light leading-relaxed">
                        Every masterpiece begins with a plan. We lay the groundwork for luxury living.
                    </p>
                </div>

                <div className="text-2 absolute opacity-0 max-w-4xl">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">Modern Structure</h2>
                    <p className="text-2xl text-gray-300 font-light leading-relaxed">
                        Open spaces, clean lines. Engineering that supports your lifestyle.
                    </p>
                </div>

                <div className="text-3 absolute opacity-0 max-w-4xl">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">Elegant Design</h2>
                    <p className="text-2xl text-gray-300 font-light leading-relaxed">
                        Form meets function. A home designed to inspire and endure.
                    </p>
                </div>

                <div className="text-4 absolute opacity-0 max-w-4xl">
                    <h2 className="text-6xl md:text-8xl font-bold text-[var(--color-gold)] mb-4 tracking-tighter drop-shadow-lg">Lets Build Wiser</h2>
                    <p className="text-3xl text-white font-light">
                        Crafting Your Dream Villa.
                    </p>
                </div>

            </div>

            {/* --- SVG SCENE --- */}
            <svg
                ref={svgRef}
                viewBox="0 0 1200 800"
                className="w-full h-full max-w-[95vw] max-h-[80vh] z-10"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#000" />
                    </linearGradient>
                    <linearGradient id="glass-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(135, 206, 235, 0.6)" />
                        <stop offset="100%" stopColor="rgba(0, 100, 200, 0.3)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Ground */}
                <line x1="0" y1="600" x2="1200" y2="600" stroke="#444" strokeWidth="2" className="ground-line" />

                {/* Foundation */}
                <rect x="200" y="600" width="800" height="40" fill="#222" stroke="#333" className="foundation-block" />

                {/* --- GROUND FLOOR --- */}
                <g className="gf-group">
                    {/* Columns */}
                    <rect x="220" y="450" width="20" height="150" fill="#333" className="gf-column" />
                    <rect x="400" y="450" width="20" height="150" fill="#333" className="gf-column" />
                    <rect x="600" y="450" width="20" height="150" fill="#333" className="gf-column" />
                    <rect x="960" y="450" width="20" height="150" fill="#333" className="gf-column" />

                    {/* Walls (Fill) */}
                    <rect x="240" y="450" width="160" height="150" fill="#1a1a1a" className="wall-fill" />
                    <rect x="620" y="450" width="340" height="150" fill="#1a1a1a" className="wall-fill" />

                    {/* Slab */}
                    <rect x="200" y="430" width="800" height="20" fill="#444" className="gf-slab" />
                </g>

                {/* --- FIRST FLOOR --- */}
                <g className="ff-group">
                    {/* Columns */}
                    <rect x="220" y="280" width="20" height="150" fill="#333" className="ff-column" />
                    <rect x="600" y="280" width="20" height="150" fill="#333" className="ff-column" />
                    <rect x="960" y="280" width="20" height="150" fill="#333" className="ff-column" />

                    {/* Walls (Fill) */}
                    <rect x="240" y="280" width="360" height="150" fill="#1a1a1a" className="wall-fill" />
                    <rect x="620" y="280" width="340" height="150" fill="#1a1a1a" className="wall-fill" />

                    {/* Roof Slab (Overhang) */}
                    <rect x="180" y="260" width="840" height="20" fill="#555" className="roof-slab" />
                </g>

                {/* --- WINDOWS --- */}
                <g className="windows-group">
                    {/* GF Windows */}
                    <rect x="440" y="460" width="140" height="120" fill="url(#glass-grad)" className="window-glass" />

                    {/* FF Windows */}
                    <rect x="260" y="300" width="120" height="110" fill="url(#glass-grad)" className="window-glass" />
                    <rect x="440" y="300" width="140" height="110" fill="url(#glass-grad)" className="window-glass" />
                    <rect x="640" y="300" width="300" height="110" fill="url(#glass-grad)" className="window-glass" />
                </g>

                {/* --- LANDSCAPE --- */}
                <g className="landscape-group">
                    {/* Pool (Left) */}
                    <rect x="50" y="610" width="150" height="10" fill="#00d4ff" className="pool-water" opacity="0.6" />

                    {/* Trees (Right) */}
                    <g transform="translate(1050, 600)" className="landscape-tree">
                        <line x1="0" y1="0" x2="0" y2="-60" stroke="#4a3728" strokeWidth="4" />
                        <circle cx="0" cy="-80" r="30" fill="#2d4a3e" />
                    </g>
                    <g transform="translate(1120, 600)" className="landscape-tree">
                        <line x1="0" y1="0" x2="0" y2="-40" stroke="#4a3728" strokeWidth="3" />
                        <circle cx="0" cy="-50" r="20" fill="#2d4a3e" />
                    </g>
                </g>

            </svg>
        </div>
    );
}
