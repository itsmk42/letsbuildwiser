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
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-black/50 backdrop-blur-md border-b border-white/10"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
                    Letsbuild<span className="text-[var(--color-gold)]">wiser</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/contact"
                        className="px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white text-2xl focus:outline-none"
                >
                    {isOpen ? <HiX /> : <HiMenuAlt3 />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg border-b border-white/10 py-6 px-6 flex flex-col space-y-4">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-gray-300 hover:text-white"
                    >
                        Home
                    </Link>
                    <Link
                        href="/contact"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-[var(--color-gold)] hover:text-white"
                    >
                        Contact Us
                    </Link>
                </div>
            )}
        </nav>
    );
}
