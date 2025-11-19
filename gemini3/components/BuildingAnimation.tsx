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
                    end: "+=800%",
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
            <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-center items-center">
                <div className="w-full max-w-7xl px-6 md:px-12 relative h-full flex flex-col justify-center">

                    {/* Text 1 */}
                    <div className="text-1 absolute opacity-0 w-full flex justify-center md:justify-start">
                        <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 max-w-xl text-center md:text-left shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                            <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                                Structural<br className="hidden md:block" /> Safety
                            </h2>
                            <div className="w-12 h-1 md:w-20 md:h-2 bg-yellow-500 mb-4 md:mb-6 mx-auto md:mx-0 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                            <p className="text-sm md:text-xl text-white font-medium leading-relaxed">
                                We prioritize your safety above all. Rigorous calculations and stress testing ensure a home that stands strong for generations.
                            </p>
                        </div>
                    </div>

                    {/* Text 2 */}
                    <div className="text-2 absolute opacity-0 w-full flex justify-center md:justify-end">
                        <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 max-w-xl text-center md:text-right flex flex-col items-center md:items-end shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                            <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                                Cost<br className="hidden md:block" /> Optimization
                            </h2>
                            <div className="w-12 h-1 md:w-20 md:h-2 bg-yellow-500 mb-4 md:mb-6 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                            <p className="text-sm md:text-xl text-white font-medium leading-relaxed">
                                Smart engineering saves money. We optimize material usage and construction methods to deliver premium quality within budget.
                            </p>
                        </div>
                    </div>

                    {/* Text 3 */}
                    <div className="text-3 absolute opacity-0 w-full flex justify-center md:justify-start">
                        <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 max-w-xl text-center md:text-left shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                            <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                                Regulatory<br className="hidden md:block" /> Compliance
                            </h2>
                            <div className="w-12 h-1 md:w-20 md:h-2 bg-yellow-500 mb-4 md:mb-6 mx-auto md:mx-0 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                            <p className="text-sm md:text-xl text-white font-medium leading-relaxed">
                                Navigate approvals with ease. Our designs adhere strictly to all local building codes and zoning regulations.
                            </p>
                        </div>
                    </div>

                    {/* Text 4 */}
                    <div className="text-4 absolute opacity-0 w-full flex justify-center md:justify-end">
                        <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 max-w-xl text-center md:text-right flex flex-col items-center md:items-end shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                            <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                                Timely<br className="hidden md:block" /> Delivery
                            </h2>
                            <div className="w-12 h-1 md:w-20 md:h-2 bg-yellow-500 mb-4 md:mb-6 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                            <p className="text-sm md:text-xl text-white font-medium leading-relaxed">
                                Efficient project management means no delays. We respect your time and ensure your dream home is ready when promised.
                            </p>
                        </div>
                    </div>

                    {/* Text 5 */}
                    <div className="text-5 absolute opacity-0 w-full flex flex-col items-center justify-center">
                        <h2 className="text-6xl md:text-9xl font-bold text-white tracking-tighter text-center">
                            Letsbuild <span className="text-yellow-500">wiser</span>
                        </h2>
                        <p className="mt-6 text-xl md:text-2xl text-white max-w-2xl text-center px-4">
                            Civil Engineering Consultation & Construction
                        </p>
                    </div>

                </div>
            </div>

            {/* --- ULTRA-HYPER-REALISTIC SVG SCENE --- */}
            <svg
                ref={svgRef}
                viewBox="0 0 2000 1000"
                className="w-full h-full z-10"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    {/* Hyper-Realistic Concrete */}
                    <pattern id="concrete" patternUnits="userSpaceOnUse" width="200" height="200">
                        <rect width="200" height="200" fill="#444" />
                        <filter id="concrete-noise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" stitchTiles="stitch" />
                            <feColorMatrix type="saturate" values="0" />
                        </filter>
                        <rect width="200" height="200" fill="transparent" opacity="0.15" filter="url(#concrete-noise)" />
                        {/* Micro-cracks/details */}
                        <path d="M20,20 L30,30 M150,150 L160,140" stroke="#333" strokeWidth="0.5" opacity="0.3" />
                    </pattern>

                    {/* Hyper-Realistic Wood */}
                    <pattern id="wood" patternUnits="userSpaceOnUse" width="40" height="200">
                        <rect width="40" height="200" fill="#555" />
                        <line x1="0" y1="0" x2="0" y2="200" stroke="#333" strokeWidth="1" />
                        <line x1="20" y1="0" x2="20" y2="200" stroke="#444" strokeWidth="0.5" opacity="0.5" />
                        {/* Wood grain */}
                        <path d="M5,0 Q10,50 5,100 T5,200" stroke="#444" strokeWidth="0.5" opacity="0.3" fill="none" />
                        <path d="M25,0 Q30,50 25,100 T25,200" stroke="#444" strokeWidth="0.5" opacity="0.3" fill="none" />
                    </pattern>

                    {/* Advanced Glass Reflection */}
                    <linearGradient id="glass-real" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(220,220,220,0.15)" />
                        <stop offset="30%" stopColor="rgba(180,180,180,0.05)" />
                        <stop offset="50%" stopColor="rgba(180,180,180,0.02)" />
                        <stop offset="70%" stopColor="rgba(180,180,180,0.05)" />
                        <stop offset="100%" stopColor="rgba(100,100,100,0.1)" />
                    </linearGradient>

                    {/* Night Sky Gradient */}
                    <linearGradient id="night-sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#050505" />
                        <stop offset="100%" stopColor="#000000" />
                    </linearGradient>

                    {/* Pool Water with Depth */}
                    <pattern id="water" patternUnits="userSpaceOnUse" width="100" height="100">
                        <rect width="100" height="100" fill="#1a1a1a" />
                        <path d="M0,50 Q25,40 50,50 T100,50" stroke="rgba(255,255,255,0.03)" fill="none" strokeWidth="2" />
                        <path d="M0,20 Q25,30 50,20 T100,20" stroke="rgba(255,255,255,0.02)" fill="none" strokeWidth="1" />
                    </pattern>

                    {/* Soft Shadow */}
                    <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                        <feOffset dx="8" dy="8" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.4" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background */}
                <rect width="2000" height="1000" fill="url(#night-sky)" />
                <line x1="0" y1="850" x2="2000" y2="850" stroke="#222" strokeWidth="2" className="ground-line" />

                {/* Foundation */}
                <rect x="100" y="850" width="1800" height="100" fill="url(#concrete)" className="foundation-block" filter="url(#soft-shadow)" />

                {/* --- GROUND FLOOR --- */}
                <g className="gf-group">
                    <rect x="200" y="650" width="300" height="200" fill="url(#concrete)" className="gf-wall" filter="url(#soft-shadow)" />
                    <rect x="220" y="670" width="260" height="180" fill="#1f1f1f" className="gf-wall" /> {/* Garage */}
                    <rect x="550" y="450" width="300" height="400" fill="#1f1f1f" className="gf-wall" /> {/* Entry Void */}
                    <rect x="900" y="600" width="800" height="250" fill="url(#concrete)" className="gf-wall" filter="url(#soft-shadow)" />

                    {/* Columns */}
                    <rect x="550" y="450" width="20" height="400" fill="#333" className="gf-col" />
                    <rect x="830" y="450" width="20" height="400" fill="#333" className="gf-col" />
                    <rect x="900" y="600" width="20" height="250" fill="#333" className="gf-col" />
                    <rect x="1300" y="600" width="20" height="250" fill="#333" className="gf-col" />
                    <rect x="1680" y="600" width="20" height="250" fill="#333" className="gf-col" />

                    <rect x="180" y="630" width="1540" height="20" fill="#555" className="gf-slab" />
                </g>

                {/* --- FIRST FLOOR --- */}
                <g className="ff-group">
                    <rect x="150" y="430" width="450" height="200" fill="url(#concrete)" className="ff-wall" filter="url(#soft-shadow)" />
                    <rect x="150" y="630" width="450" height="15" fill="#666" className="cantilever-beam" />
                    <rect x="950" y="430" width="700" height="200" fill="url(#concrete)" className="ff-wall" filter="url(#soft-shadow)" />

                    <rect x="580" y="430" width="20" height="200" fill="#333" className="ff-col" />
                    <rect x="950" y="430" width="20" height="200" fill="#333" className="ff-col" />
                    <rect x="1630" y="430" width="20" height="200" fill="#333" className="ff-col" />

                    <rect x="150" y="410" width="1500" height="20" fill="#555" className="ff-slab" />
                </g>

                {/* --- SECOND FLOOR --- */}
                <g className="sf-group">
                    <rect x="800" y="210" width="600" height="200" fill="url(#concrete)" className="sf-wall" filter="url(#soft-shadow)" />
                    <rect x="800" y="210" width="15" height="200" fill="#333" className="sf-col" />
                    <rect x="1385" y="210" width="15" height="200" fill="#333" className="sf-col" />
                    <rect x="700" y="190" width="800" height="20" fill="#666" className="roof-slab" />
                </g>

                {/* --- DETAILS --- */}
                <g className="details-group">
                    {/* Glass Panels */}
                    <rect x="570" y="450" width="260" height="400" fill="url(#glass-real)" className="glass-panel" opacity="0.8" />
                    <rect x="920" y="620" width="760" height="230" fill="url(#glass-real)" className="glass-panel" opacity="0.8" />
                    <rect x="150" y="450" width="300" height="160" fill="url(#glass-real)" className="glass-panel" opacity="0.8" />
                    <rect x="820" y="230" width="560" height="160" fill="url(#glass-real)" className="glass-panel" opacity="0.8" />

                    {/* Timber Slats */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <rect key={i} x={460 + i * 10} y="430" width="6" height="200" fill="url(#wood)" className="timber-slat" />
                    ))}
                </g>

                {/* --- LANDSCAPE --- */}
                <g className="landscape-group">
                    <rect x="1200" y="860" width="600" height="40" fill="url(#water)" className="pool-water" opacity="0.6" />

                    {/* Trees */}
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
