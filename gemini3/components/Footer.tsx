import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative bg-black text-white py-12 overflow-hidden">
            {/* Gold gradient top border */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-40"></div>

            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                    <h2 className="text-2xl font-bold tracking-tighter mb-2">
                        Letsbuild<span className="gold-gradient-text">wiser</span>
                    </h2>
                    <p className="text-gray-500 text-sm tracking-wide font-light">
                        Building the future, step by step.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-500">
                    <Link href="/" className="hover:text-white transition-colors tracking-wide">
                        Home
                    </Link>
                    <Link href="/contact" className="hover:text-[var(--color-gold)] transition-colors tracking-wide">
                        Contact
                    </Link>
                    <span className="text-gray-600">&copy; {new Date().getFullYear()} Letsbuildwiser.</span>
                </div>
            </div>
        </footer>
    );
}
