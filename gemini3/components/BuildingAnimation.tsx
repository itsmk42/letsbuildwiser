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
                    end: "+=1200%",
                    scrub: 0.5,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // --- TEXT ANIMATION (Elegant Fade & Slide) ---
            const animateText = (selector: string, start: number, duration: number) => {
                tl.fromTo(selector,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: duration * 0.3, ease: "power2.out" },
                    start
                );
                tl.to(selector,
                    { opacity: 0, y: -30, duration: duration * 0.3, ease: "power2.in" },
                    start + duration * 0.7
                );
            };

            // --- CONSTRUCTION TIMELINE ---

            // PHASE 1: FOUNDATION (0 - 2)
            tl.fromTo(".ground-line", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
            tl.fromTo(".foundation-block", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 1 }, 0.5);
            animateText(".text-1", 0.2, 2.5);

            // PHASE 2: GROUND FLOOR (2 - 4.5)
            tl.fromTo(".gf-col", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 1, stagger: 0.1 }, 2);
            tl.fromTo(".gf-wall", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 1.5, stagger: 0.2 }, 2.5);
            tl.fromTo(".gf-slab", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 3.5);
            animateText(".text-2", 2.5, 2.5);

            // PHASE 3: FIRST FLOOR (4.5 - 7)
            tl.fromTo(".ff-col", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 1, stagger: 0.1 }, 4.5);
            tl.fromTo(".ff-wall", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 1.5, stagger: 0.2 }, 5);
            tl.fromTo(".cantilever-beam", { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 1 }, 5.5);
            tl.fromTo(".ff-slab", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 6);
            animateText(".text-3", 5, 2.5);

            // PHASE 4: SECOND FLOOR (7 - 9)
            tl.fromTo(".sf-col", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 1, stagger: 0.1 }, 7);
            tl.fromTo(".sf-wall", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 1.5, stagger: 0.2 }, 7.5);
            tl.fromTo(".roof-slab", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 8.5);

            // PHASE 5: ENCLOSURE (9 - 11.5)
            tl.fromTo(".glass-panel", { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 1.5, stagger: 0.05 }, 9);
            tl.fromTo(".timber-slat", { scaleY: 0 }, { scaleY: 1, duration: 1, stagger: 0.02 }, 10);
            animateText(".text-4", 8, 3.5);

            // PHASE 6: LANDSCAPE (11.5 - 13)
            tl.fromTo(".landscape", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, stagger: 0.1, ease: "back.out(1.5)" }, 11.5);
            tl.fromTo(".pool-water", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 12);

            // PHASE 7: FINAL REVEAL (13 - 14)
            animateText(".text-5", 11.5, 3);

            tl.to({}, { duration: 1 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden font-sans">

            {/* --- CIVIL ENGINEER BENEFITS TEXT OVERLAYS --- */}
            <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-center px-4 md:px-32">

                {/* Text 1 */}
                <div className="text-1 absolute opacity-0 w-full text-center md:text-left md:max-w-2xl">
                    <h2 className="text-3xl md:text-8xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                        Structural<br className="hidden md:block" /> Safety
                    </h2>
                    <div className="w-12 h-1 md:w-20 md:h-2 bg-yellow-500 mb-4 md:mb-6 mx-auto md:mx-0"></div>
                    <p className="text-sm md:text-2xl text-gray-300 font-medium leading-relaxed max-w-xs mx-auto md:mx-0 md:max-w-lg">
                        We prioritize your safety above all. Rigorous calculations and stress testing ensure a home that stands strong for generations.
                    </p>
                </div>

                {/* Text 2 */}
                <div className="text-2 absolute opacity-0 w-full text-center md:text-right md:max-w-2xl md:right-32 flex flex-col items-center md:items-end">
                    <h2 className="text-3xl md:text-8xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                        Cost<br className="hidden md:block" /> Optimization
                    </h2>
                    <div className="w-12 h-1 md:w-20 md:h-2 bg-yellow-500 mb-4 md:mb-6"></div>
                    <p className="text-sm md:text-2xl text-gray-300 font-medium leading-relaxed max-w-xs md:max-w-lg">
                        Smart engineering saves money. We optimize material usage and construction methods to deliver premium quality within budget.
                    </p>
                </div>

                {/* Text 3 */}
                <div className="text-3 absolute opacity-0 w-full text-center md:text-left md:max-w-2xl">
                    <h2 className="text-3xl md:text-8xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                        Regulatory<br className="hidden md:block" /> Compliance
                    </h2>
                    <div className="w-12 h-1 md:w-20 md:h-2 bg-yellow-500 mb-4 md:mb-6 mx-auto md:mx-0"></div>
                    <p className="text-sm md:text-2xl text-gray-300 font-medium leading-relaxed max-w-xs mx-auto md:mx-0 md:max-w-lg">
                        Navigate approvals with ease. Our designs adhere strictly to all local building codes and zoning regulations.
                    </p>
                </div>

                {/* Text 4 */}
                <div className="text-4 absolute opacity-0 w-full text-center md:text-right md:max-w-2xl md:right-32 flex flex-col items-center md:items-end">
                    <h2 className="text-3xl md:text-8xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                        Timely<br className="hidden md:block" /> Delivery
                    </h2>
                    <div className="w-12 h-1 md:w-20 md:h-2 bg-yellow-500 mb-4 md:mb-6"></div>
                    <p className="text-sm md:text-2xl text-gray-300 font-medium leading-relaxed max-w-xs md:max-w-lg">
                        Efficient project management means no delays. We respect your time and ensure your dream home is ready when promised.
                    </p>
                </div>

                {/* Text 5 */}
                <div className="text-5 absolute opacity-0 w-full flex flex-col items-center justify-center">
                    <h2 className="text-4xl md:text-9xl font-black text-white mb-4 tracking-tighter text-center uppercase">
                        Lets Build <span className="text-yellow-500">Wiser</span>
                    </h2>
                    <p className="text-lg md:text-3xl text-white font-bold tracking-widest uppercase">
                        Engineering Your Peace of Mind
                    </p>
                </div>

            </div>

            {/* --- ULTRA-REALISTIC SVG SCENE (Grey Theme) --- */}
            <svg
                ref={svgRef}
                viewBox="0 0 2000 1000"
                className="w-full h-full z-10"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    {/* Concrete Texture (Grey) */}
                    <pattern id="concrete" patternUnits="userSpaceOnUse" width="100" height="100">
                        <rect width="100" height="100" fill="#444" /> {/* Lighter Grey */}
                        <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                        </filter>
                        <rect width="100" height="100" fill="transparent" opacity="0.1" filter="url(#noise)" />
                    </pattern>

                    {/* Wood Texture (Desaturated/Greyish) */}
                    <pattern id="wood" patternUnits="userSpaceOnUse" width="20" height="100">
                        <rect width="20" height="100" fill="#555" />
                        <line x1="0" y1="0" x2="0" y2="100" stroke="#333" strokeWidth="1" />
                        <line x1="10" y1="0" x2="10" y2="100" stroke="#444" strokeWidth="0.5" opacity="0.5" />
                    </pattern>

                    {/* Glass Reflection Gradient (Grey/Blue Tint) */}
                    <linearGradient id="glass-real" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(200,200,200,0.2)" />
                        <stop offset="40%" stopColor="rgba(150,150,150,0.1)" />
                        <stop offset="60%" stopColor="rgba(150,150,150,0.05)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                    </linearGradient>

                    {/* Pool Water (Darker/Greyscale) */}
                    <pattern id="water" patternUnits="userSpaceOnUse" width="50" height="50">
                        <rect width="50" height="50" fill="#222" />
                        <path d="M0,25 Q12.5,10 25,25 T50,25" stroke="rgba(255,255,255,0.05)" fill="none" />
                    </pattern>

                    {/* Drop Shadow for Depth */}
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                        <feOffset dx="5" dy="5" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.5" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Ground & Atmosphere (Pure Black) */}
                <rect width="2000" height="1000" fill="#000000" />
                <line x1="0" y1="850" x2="2000" y2="850" stroke="#333" strokeWidth="2" className="ground-line" />

                {/* Foundation */}
                <rect x="100" y="850" width="1800" height="100" fill="url(#concrete)" className="foundation-block" filter="url(#shadow)" />

                {/* --- GROUND FLOOR --- */}
                <g className="gf-group">
                    {/* Walls with Concrete Texture */}
                    <rect x="200" y="650" width="300" height="200" fill="url(#concrete)" className="gf-wall" filter="url(#shadow)" />
                    <rect x="220" y="670" width="260" height="180" fill="#222" className="gf-wall" /> {/* Dark Garage Door */}

                    <rect x="550" y="450" width="300" height="400" fill="#222" className="gf-wall" /> {/* Entry Void */}

                    <rect x="900" y="600" width="800" height="250" fill="url(#concrete)" className="gf-wall" filter="url(#shadow)" />

                    {/* Columns */}
                    <rect x="550" y="450" width="20" height="400" fill="#333" className="gf-col" />
                    <rect x="830" y="450" width="20" height="400" fill="#333" className="gf-col" />
                    <rect x="900" y="600" width="20" height="250" fill="#333" className="gf-col" />
                    <rect x="1300" y="600" width="20" height="250" fill="#333" className="gf-col" />
                    <rect x="1680" y="600" width="20" height="250" fill="#333" className="gf-col" />

                    {/* Slab */}
                    <rect x="180" y="630" width="1540" height="20" fill="#555" className="gf-slab" />
                </g>

                {/* --- FIRST FLOOR --- */}
                <g className="ff-group">
                    <rect x="150" y="430" width="450" height="200" fill="url(#concrete)" className="ff-wall" filter="url(#shadow)" />
                    <rect x="150" y="630" width="450" height="15" fill="#666" className="cantilever-beam" />

                    <rect x="950" y="430" width="700" height="200" fill="url(#concrete)" className="ff-wall" filter="url(#shadow)" />

                    <rect x="580" y="430" width="20" height="200" fill="#333" className="ff-col" />
                    <rect x="950" y="430" width="20" height="200" fill="#333" className="ff-col" />
                    <rect x="1630" y="430" width="20" height="200" fill="#333" className="ff-col" />

                    <rect x="150" y="410" width="1500" height="20" fill="#555" className="ff-slab" />
                </g>

                {/* --- SECOND FLOOR --- */}
                <g className="sf-group">
                    <rect x="800" y="210" width="600" height="200" fill="url(#concrete)" className="sf-wall" filter="url(#shadow)" />
                    <rect x="800" y="210" width="15" height="200" fill="#333" className="sf-col" />
                    <rect x="1385" y="210" width="15" height="200" fill="#333" className="sf-col" />
                    <rect x="700" y="190" width="800" height="20" fill="#666" className="roof-slab" />
                </g>

                {/* --- DETAILS --- */}
                <g className="details-group">
                    {/* Realistic Glass Panels */}
                    <rect x="570" y="450" width="260" height="400" fill="url(#glass-real)" className="glass-panel" opacity="0.6" />
                    <rect x="920" y="620" width="760" height="230" fill="url(#glass-real)" className="glass-panel" opacity="0.7" />
                    <rect x="150" y="450" width="300" height="160" fill="url(#glass-real)" className="glass-panel" opacity="0.7" />
                    <rect x="820" y="230" width="560" height="160" fill="url(#glass-real)" className="glass-panel" opacity="0.7" />

                    {/* Timber Slats */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <rect key={i} x={460 + i * 10} y="430" width="6" height="200" fill="url(#wood)" className="timber-slat" />
                    ))}
                </g>

                {/* --- LANDSCAPE --- */}
                <g className="landscape-group">
                    {/* Pool with Water Texture */}
                    <rect x="1200" y="860" width="600" height="40" fill="url(#water)" className="pool-water" opacity="0.8" />

                    {/* Stylized Trees */}
                    <g transform="translate(50, 850)" className="landscape">
                        <line x1="0" y1="0" x2="0" y2="-120" stroke="#333" strokeWidth="4" />
                        <circle cx="0" cy="-130" r="40" fill="#222" opacity="0.9" />
                        <circle cx="-20" cy="-110" r="30" fill="#1a1a1a" opacity="0.8" />
                        <circle cx="20" cy="-110" r="30" fill="#1a1a1a" opacity="0.8" />
                    </g>
                    <g transform="translate(1900, 850)" className="landscape">
                        <line x1="0" y1="0" x2="0" y2="-100" stroke="#333" strokeWidth="4" />
                        <circle cx="0" cy="-110" r="35" fill="#222" opacity="0.9" />
                    </g>

                    {/* Roof Garden */}
                    <g transform="translate(750, 190)" className="landscape">
                        <path d="M0,0 Q10,-20 20,0 T40,0" stroke="#333" strokeWidth="2" fill="none" />
                        <circle cx="10" cy="-15" r="5" fill="#444" />
                        <circle cx="30" cy="-10" r="8" fill="#444" />
                    </g>
                </g>

            </svg>
        </div>
    );
}
