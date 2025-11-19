import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-12 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                    <h2 className="text-2xl font-bold tracking-tighter mb-2">
                        Letsbuild<span className="text-[var(--color-gold)]">wiser</span>
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Building the future, step by step.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-sm text-gray-400">
                    <Link href="/" className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="/contact" className="hover:text-white transition-colors">
                        Contact
                    </Link>
                    <span>&copy; {new Date().getFullYear()} Letsbuildwiser.</span>
                </div>
            </div>
        </footer>
    );
}
