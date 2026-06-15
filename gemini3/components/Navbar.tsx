"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? "bg-black/60 backdrop-blur-xl border-b border-[var(--color-gold-border)]"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
                    Letsbuild<span className="gold-gradient-text">wiser</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-wide"
                    >
                        Home
                    </Link>
                    <Link
                        href="/contact"
                        className="px-6 py-2.5 text-sm font-semibold text-black bg-[var(--color-gold)] rounded-full hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] hover:scale-105 transition-all duration-300 tracking-wide"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white text-2xl focus:outline-none"
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <HiX /> : <HiMenuAlt3 />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-b border-[var(--color-gold-border)] py-6 px-6 flex flex-col space-y-4">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-semibold text-[var(--color-gold)] hover:text-white transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>
            )}
        </nav>
    );
}
