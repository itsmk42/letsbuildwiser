"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BuildingAnimation() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!svgRef.current || !containerRef.current || !sceneRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=900%", // Extended scroll for complex wide sequence
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // --- Camera Move (Wide Tilt) ---
            // Tilt up and zoom out slightly to fit the width
            tl.to(sceneRef.current, {
                rotationX: 20,
                y: 50,
                scale: 0.95, // Slight zoom out for width
                ease: "power1.inOut",
                duration: 9,
            }, 0);

            // --- Phase 1: Massive Foundation (Podium Base) ---
            tl.to(".text-phase-1", { opacity: 1, y: 0, duration: 1 }, 0);
            tl.fromTo(
                ".ground-wide",
                { scaleX: 0, transformOrigin: "center" },
                { scaleX: 1, duration: 1.5, ease: "power2.inOut" },
                0
            );
            tl.fromTo(
                ".podium-col",
                { scaleY: 0, transformOrigin: "bottom" },
                { scaleY: 1, duration: 1.5, stagger: 0.05, ease: "power2.out" },
                0.5
            );
            tl.fromTo(
                ".podium-slab",
                { scaleX: 0, transformOrigin: "center" },
                { scaleX: 1, duration: 1.5, ease: "power2.inOut" },
                1
            );
            tl.to(".text-phase-1", { opacity: 0, y: -20, duration: 1 }, 2);

            // --- Phase 2: Dual Towers Rising ---
            tl.to(".text-phase-2", { opacity: 1, y: 0, duration: 1 }, 2.5);
            // Left Tower
            tl.fromTo(
                ".tower-left-core",
                { scaleY: 0, transformOrigin: "bottom" },
                { scaleY: 1, duration: 3, ease: "linear" },
                2.5
            );
            // Right Tower
            tl.fromTo(
                ".tower-right-core",
                { scaleY: 0, transformOrigin: "bottom" },
                { scaleY: 1, duration: 3, ease: "linear" },
                2.5
            );
            // Cranes (Dual)
            tl.fromTo(
                ".crane-left",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1 },
                2.5
            );
            tl.fromTo(
                ".crane-right",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1 },
                2.5
            );
            tl.to(".text-phase-2", { opacity: 0, y: -20, duration: 1 }, 5);

            // --- Phase 3: Skybridge & Structure ---
            tl.to(".text-phase-3", { opacity: 1, y: 0, duration: 1 }, 5.5);
            // Floors
            tl.fromTo(
                ".floor-plate",
                { scaleX: 0, transformOrigin: "center" },
                { scaleX: 1, duration: 2, stagger: 0.1, ease: "power1.out" },
                5.5
            );
            // Skybridge connecting towers
            tl.fromTo(
                ".skybridge",
                { scaleX: 0, transformOrigin: "center" },
                { scaleX: 1, duration: 2, ease: "power2.out" },
                6.5
            );
            // Crane activity
            tl.to(".crane-jib-left", { rotation: 15, duration: 1, yoyo: true, repeat: 2 }, 5.5);
            tl.to(".crane-jib-right", { rotation: -15, duration: 1, yoyo: true, repeat: 2 }, 5.5);
            tl.to(".text-phase-3", { opacity: 0, y: -20, duration: 1 }, 7.5);

            // --- Phase 4: Glass Facade & Plaza ---
            tl.to(".text-phase-4", { opacity: 1, y: 0, duration: 1 }, 8);
            tl.fromTo(
                ".glass-skin",
                { opacity: 0 },
                { opacity: 1, duration: 2, stagger: 0.2 },
                8
            );
            tl.fromTo(
                ".plaza-detail",
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, duration: 1.5, stagger: 0.1 },
                8
            );
            // Cranes depart
            tl.to(".crane-group", { opacity: 0, y: -100, duration: 1 }, 9);

            // Keep final text visible
            tl.to({}, { duration: 2 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden perspective-[1200px]">
            {/* Text Overlay */}
            <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-center text-center px-6">
                <div className="text-phase-1 absolute opacity-0 translate-y-10 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Expansive Foundations</h2>
                    <p className="text-xl text-gray-300 max-w-xl font-light">A massive podium base designed to support twin architectural marvels.</p>
                </div>
                <div className="text-phase-2 absolute opacity-0 translate-y-10 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Twin Ascension</h2>
                    <p className="text-xl text-gray-300 max-w-xl font-light">Simultaneous vertical construction. Synchronized engineering at scale.</p>
                </div>
                <div className="text-phase-3 absolute opacity-0 translate-y-10 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Connected Vision</h2>
                    <p className="text-xl text-gray-300 max-w-xl font-light">Bridging spaces and possibilities. The skybridge unites form and function.</p>
                </div>
                <div className="text-phase-4 absolute opacity-0 translate-y-10 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h2 className="text-5xl md:text-7xl font-bold text-[var(--color-gold)] mb-4 tracking-tighter">Lets Build Wiser</h2>
                    <p className="text-2xl text-white max-w-xl font-light">Creating landmarks that define skylines. Complex, bold, and enduring.</p>
                </div>
            </div>

            {/* 3D Scene Container */}
            <div ref={sceneRef} className="w-full h-full flex items-center justify-center transform-style-3d origin-bottom">
                <svg
                    ref={svgRef}
                    viewBox="0 0 1200 800"
                    className="w-full h-full max-w-[90vw] max-h-[85vh] z-10 opacity-90"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient id="glass-blue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(135, 206, 235, 0.3)" />
                            <stop offset="100%" stopColor="rgba(135, 206, 235, 0.1)" />
                        </linearGradient>
                        <pattern id="grid-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        </pattern>
                    </defs>

                    {/* --- Phase 1: Podium & Ground --- */}
                    <g className="phase-1">
                        <line x1="50" y1="750" x2="1150" y2="750" stroke="#555" strokeWidth="4" className="ground-wide" />

                        {/* Podium Columns */}
                        {Array.from({ length: 20 }).map((_, i) => (
                            <rect key={`pod-col-${i}`} x={100 + (i * 50)} y="650" width="10" height="100" fill="#444" className="podium-col" />
                        ))}

                        {/* Podium Slab */}
                        <rect x="80" y="630" width="1040" height="20" fill="#333" className="podium-slab" />
                        <rect x="80" y="650" width="1040" height="100" fill="url(#grid-pattern)" className="podium-slab" opacity="0.5" />
                    </g>

                    {/* --- Phase 2: Twin Towers Structure --- */}
                    <g className="phase-2">
                        {/* Left Tower Core */}
                        <rect x="200" y="150" width="250" height="480" fill="#222" className="tower-left-core" />
                        {/* Right Tower Core */}
                        <rect x="750" y="150" width="250" height="480" fill="#222" className="tower-right-core" />

                        {/* Cranes */}
                        <g className="crane-group">
                            {/* Left Crane */}
                            <g className="crane-left">
                                <line x1="150" y1="630" x2="150" y2="50" stroke="#ffd700" strokeWidth="3" />
                                <line x1="150" y1="50" x2="350" y2="50" stroke="#ffd700" strokeWidth="3" className="crane-jib-left" />
                            </g>
                            {/* Right Crane */}
                            <g className="crane-right">
                                <line x1="1050" y1="630" x2="1050" y2="50" stroke="#ffd700" strokeWidth="3" />
                                <line x1="1050" y1="50" x2="850" y2="50" stroke="#ffd700" strokeWidth="3" className="crane-jib-right" />
                            </g>
                        </g>
                    </g>

                    {/* --- Phase 3: Floors & Skybridge --- */}
                    <g className="phase-3">
                        {/* Left Tower Floors */}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <rect key={`l-floor-${i}`} x="200" y={630 - (i * 48)} width="250" height="2" fill="#666" className="floor-plate" />
                        ))}
                        {/* Right Tower Floors */}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <rect key={`r-floor-${i}`} x="750" y={630 - (i * 48)} width="250" height="2" fill="#666" className="floor-plate" />
                        ))}

                        {/* Skybridge */}
                        <rect x="450" y="250" width="300" height="60" fill="#1a1a1a" stroke="#cd7f32" strokeWidth="2" className="skybridge" />
                        <line x1="450" y1="250" x2="750" y2="310" stroke="#cd7f32" strokeWidth="1" className="skybridge" opacity="0.5" />
                        <line x1="450" y1="310" x2="750" y2="250" stroke="#cd7f32" strokeWidth="1" className="skybridge" opacity="0.5" />
                    </g>

                    {/* --- Phase 4: Facade & Details --- */}
                    <g className="phase-4">
                        {/* Left Tower Glass */}
                        <rect x="200" y="150" width="250" height="480" fill="url(#glass-blue)" className="glass-skin" />
                        <path d="M200 150 L450 150" stroke="white" strokeWidth="2" className="glass-skin" />

                        {/* Right Tower Glass */}
                        <rect x="750" y="150" width="250" height="480" fill="url(#glass-blue)" className="glass-skin" />
                        <path d="M750 150 L1000 150" stroke="white" strokeWidth="2" className="glass-skin" />

                        {/* Skybridge Glass */}
                        <rect x="450" y="250" width="300" height="60" fill="rgba(255,255,255,0.2)" className="glass-skin" />

                        {/* Plaza Details */}
                        <circle cx="150" cy="700" r="20" fill="#2d4a3e" className="plaza-detail" />
                        <circle cx="1050" cy="700" r="20" fill="#2d4a3e" className="plaza-detail" />
                        <rect x="550" y="700" width="100" height="50" fill="#111" className="plaza-detail" /> {/* Entrance */}
                    </g>
                </svg>
            </div>
        </div>
    );
}
