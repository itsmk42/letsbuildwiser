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
                    end: "+=1000%", // Very long scroll for cinematic experience
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // --- Dynamic Camera Movement (The "Change View") ---
            // Start: Flat front view
            // Middle: Tilt up and rotate right
            // End: High angle, rotated left (Flyover feel)
            tl.to(sceneRef.current, {
                rotationX: 45, // Tilt up
                rotationY: 20, // Rotate right
                scale: 1.2,    // Zoom in
                y: 100,
                duration: 4,
                ease: "power1.inOut",
            }, 0);

            tl.to(sceneRef.current, {
                rotationX: 60, // Tilt more
                rotationY: -20, // Rotate to left
                scale: 1.4,    // Zoom more
                y: 150,
                duration: 6,
                ease: "power1.inOut",
            }, 4);

            // --- Phase 1: The Blueprint (Wireframe Foundation) ---
            tl.to(".text-phase-1", { opacity: 1, y: 0, duration: 1 }, 0);
            // Grid appears
            tl.fromTo(".grid-floor", { opacity: 0, scale: 2 }, { opacity: 0.3, scale: 1, duration: 2 }, 0);
            // Wireframe lines draw
            tl.fromTo(
                ".wireframe-base",
                { strokeDasharray: 1000, strokeDashoffset: 1000 },
                { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" },
                0.5
            );
            // Reality fills in (Solid Foundation)
            tl.fromTo(
                ".reality-base",
                { opacity: 0 },
                { opacity: 1, duration: 1.5 },
                1.5
            );
            tl.to(".text-phase-1", { opacity: 0, y: -20, duration: 1 }, 2.5);

            // --- Phase 2: Structural Skeleton (Wireframe Rising) ---
            tl.to(".text-phase-2", { opacity: 1, y: 0, duration: 1 }, 3);
            // Wireframe Columns & Core
            tl.fromTo(
                ".wireframe-structure",
                { scaleY: 0, transformOrigin: "bottom" },
                { scaleY: 1, duration: 3, stagger: 0.1, ease: "linear" },
                3
            );
            // Glowing Nodes (Joints)
            tl.fromTo(
                ".structure-node",
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1, stagger: 0.05 },
                3.5
            );
            tl.to(".text-phase-2", { opacity: 0, y: -20, duration: 1 }, 5.5);

            // --- Phase 3: The Skin (Reality Manifesting) ---
            tl.to(".text-phase-3", { opacity: 1, y: 0, duration: 1 }, 6);
            // Wireframe Facade Grid
            tl.fromTo(
                ".wireframe-facade",
                { opacity: 0 },
                { opacity: 0.5, duration: 1 },
                6
            );
            // Reality Glass Panels (Glitch/Fade in effect)
            tl.fromTo(
                ".reality-glass",
                { opacity: 0, scale: 0.8 },
                { opacity: 0.9, scale: 1, duration: 2, stagger: { amount: 1.5, grid: [10, 5], from: "center" } },
                6.5
            );
            // Skybridge Reality
            tl.fromTo(
                ".reality-bridge",
                { scaleX: 0, transformOrigin: "center" },
                { scaleX: 1, duration: 1.5, ease: "expo.out" },
                7.5
            );
            tl.to(".text-phase-3", { opacity: 0, y: -20, duration: 1 }, 8.5);

            // --- Phase 4: Final Polish (Lighting & Atmosphere) ---
            tl.to(".text-phase-4", { opacity: 1, y: 0, duration: 1 }, 9);
            // Lights turn on
            tl.fromTo(
                ".building-lights",
                { opacity: 0 },
                { opacity: 1, duration: 1, stagger: 0.1 },
                9
            );
            // Environment reflection
            tl.to(".reality-glass", { fillOpacity: 0.8, duration: 1 }, 9);

            // Keep final text visible
            tl.to({}, { duration: 2 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden perspective-[1000px]">
            {/* Text Overlay - Fixed z-index high */}
            <div className="absolute inset-0 pointer-events-none z-40 flex flex-col items-center justify-center text-center px-6">
                <div className="text-phase-1 absolute opacity-0 translate-y-10 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 tracking-tight font-mono">01_BLUEPRINT</h2>
                    <p className="text-xl text-cyan-100/80 max-w-xl font-light">Every reality starts with a vision. Mapping the impossible.</p>
                </div>
                <div className="text-phase-2 absolute opacity-0 translate-y-10 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 tracking-tight font-mono">02_STRUCTURE</h2>
                    <p className="text-xl text-cyan-100/80 max-w-xl font-light">The skeleton rises. Precision engineering meets raw strength.</p>
                </div>
                <div className="text-phase-3 absolute opacity-0 translate-y-10 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4 tracking-tight font-mono">03_MANIFEST</h2>
                    <p className="text-xl text-cyan-100/80 max-w-xl font-light">From wireframe to world. The facade seals the legacy.</p>
                </div>
                <div className="text-phase-4 absolute opacity-0 translate-y-10 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h2 className="text-5xl md:text-7xl font-bold text-[var(--color-gold)] mb-4 tracking-tighter">Lets Build Wiser</h2>
                    <p className="text-2xl text-white max-w-xl font-light">Where digital precision builds physical monuments.</p>
                </div>
            </div>

            {/* 3D Scene Container */}
            <div ref={sceneRef} className="w-full h-full flex items-center justify-center transform-style-3d origin-center will-change-transform">
                <svg
                    ref={svgRef}
                    viewBox="0 0 1200 1000"
                    className="w-full h-full max-w-[95vw] max-h-[90vh] z-10"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ overflow: 'visible' }}
                >
                    <defs>
                        <linearGradient id="wireframe-glow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#00ffff" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="glass-real" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="rgba(200, 240, 255, 0.9)" />
                            <stop offset="50%" stopColor="rgba(100, 180, 255, 0.6)" />
                            <stop offset="100%" stopColor="rgba(50, 100, 200, 0.8)" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <pattern id="grid-floor-pat" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 255, 255, 0.2)" strokeWidth="1" />
                        </pattern>
                    </defs>

                    {/* --- Phase 1: Base & Grid --- */}
                    <g className="phase-1" transform="translate(0, 200)">
                        {/* Infinite Grid Floor - Fixed: Removed invalid rotateX transform from SVG. 
                Using a large rect that covers the view. The 3D feel comes from the scene rotation. */}
                        <rect x="-1000" y="600" width="3200" height="2000" fill="url(#grid-floor-pat)" className="grid-floor" />

                        {/* Wireframe Base Outline */}
                        <path d="M100 700 L1100 700 L1150 800 L50 800 Z" fill="none" stroke="#00ffff" strokeWidth="2" className="wireframe-base" filter="url(#glow)" />
                        <path d="M100 700 L100 650 M1100 700 L1100 650" stroke="#00ffff" strokeWidth="1" className="wireframe-base" />

                        {/* Reality Base (Concrete) */}
                        <path d="M100 700 L1100 700 L1100 800 L100 800 Z" fill="#222" className="reality-base" />
                        <rect x="100" y="650" width="1000" height="50" fill="#333" className="reality-base" />
                    </g>

                    {/* --- Phase 2: Structure (Wireframe) --- */}
                    <g className="phase-2" transform="translate(0, 200)">
                        {/* Left Tower Wireframe */}
                        <g className="wireframe-structure">
                            <rect x="200" y="100" width="250" height="550" fill="none" stroke="url(#wireframe-glow)" strokeWidth="1" />
                            <line x1="200" y1="100" x2="450" y2="650" stroke="rgba(0,255,255,0.3)" strokeWidth="0.5" />
                            <line x1="450" y1="100" x2="200" y2="650" stroke="rgba(0,255,255,0.3)" strokeWidth="0.5" />
                            {/* Nodes */}
                            {[100, 200, 300, 400, 500, 600].map((y, i) => (
                                <circle key={`node-l-${i}`} cx="200" cy={y} r="3" fill="#00ffff" className="structure-node" filter="url(#glow)" />
                            ))}
                            {[100, 200, 300, 400, 500, 600].map((y, i) => (
                                <circle key={`node-r-${i}`} cx="450" cy={y} r="3" fill="#00ffff" className="structure-node" filter="url(#glow)" />
                            ))}
                        </g>

                        {/* Right Tower Wireframe */}
                        <g className="wireframe-structure">
                            <rect x="750" y="100" width="250" height="550" fill="none" stroke="url(#wireframe-glow)" strokeWidth="1" />
                            <line x1="750" y1="100" x2="1000" y2="650" stroke="rgba(0,255,255,0.3)" strokeWidth="0.5" />
                            <line x1="1000" y1="100" x2="750" y2="650" stroke="rgba(0,255,255,0.3)" strokeWidth="0.5" />
                            {/* Nodes */}
                            {[100, 200, 300, 400, 500, 600].map((y, i) => (
                                <circle key={`node-l2-${i}`} cx="750" cy={y} r="3" fill="#00ffff" className="structure-node" filter="url(#glow)" />
                            ))}
                            {[100, 200, 300, 400, 500, 600].map((y, i) => (
                                <circle key={`node-r2-${i}`} cx="1000" cy={y} r="3" fill="#00ffff" className="structure-node" filter="url(#glow)" />
                            ))}
                        </g>
                    </g>

                    {/* --- Phase 3: Reality (Skin) --- */}
                    <g className="phase-3" transform="translate(0, 200)">
                        {/* Left Tower Glass */}
                        {Array.from({ length: 10 }).map((_, row) =>
                            Array.from({ length: 5 }).map((_, col) => (
                                <rect
                                    key={`glass-l-${row}-${col}`}
                                    x={200 + (col * 50)}
                                    y={600 - (row * 55)}
                                    width="50"
                                    height="55"
                                    fill="url(#glass-real)"
                                    stroke="rgba(255,255,255,0.5)"
                                    strokeWidth="0.5"
                                    className="reality-glass"
                                />
                            ))
                        )}

                        {/* Right Tower Glass */}
                        {Array.from({ length: 10 }).map((_, row) =>
                            Array.from({ length: 5 }).map((_, col) => (
                                <rect
                                    key={`glass-r-${row}-${col}`}
                                    x={750 + (col * 50)}
                                    y={600 - (row * 55)}
                                    width="50"
                                    height="55"
                                    fill="url(#glass-real)"
                                    stroke="rgba(255,255,255,0.5)"
                                    strokeWidth="0.5"
                                    className="reality-glass"
                                />
                            ))
                        )}

                        {/* Skybridge Reality */}
                        <rect x="450" y="200" width="300" height="80" fill="#111" stroke="#00ffff" strokeWidth="2" className="reality-bridge" />
                        <rect x="450" y="200" width="300" height="80" fill="rgba(0, 255, 255, 0.1)" className="reality-bridge" />
                    </g>

                    {/* --- Phase 4: Lights --- */}
                    <g className="phase-4" transform="translate(0, 200)">
                        <circle cx="225" cy="125" r="2" fill="white" className="building-lights" filter="url(#glow)" />
                        <circle cx="425" cy="125" r="2" fill="white" className="building-lights" filter="url(#glow)" />
                        <circle cx="775" cy="125" r="2" fill="white" className="building-lights" filter="url(#glow)" />
                        <circle cx="975" cy="125" r="2" fill="white" className="building-lights" filter="url(#glow)" />

                        {/* Skybridge Lights */}
                        <line x1="450" y1="200" x2="750" y2="200" stroke="#00ffff" strokeWidth="2" className="building-lights" filter="url(#glow)" />
                        <line x1="450" y1="280" x2="750" y2="280" stroke="#00ffff" strokeWidth="2" className="building-lights" filter="url(#glow)" />
                    </g>
                </svg>
            </div>
        </div>
    );
}
