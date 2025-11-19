import BuildingAnimation from "@/components/BuildingAnimation";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Static Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative z-10 bg-black">
        <h1 className="text-6xl md:text-9xl font-bold text-white tracking-tighter text-center">
          Letsbuild <span className="text-[var(--color-gold)]">wiser</span>
        </h1>
        <p className="mt-6 text-xl text-gray-400 max-w-2xl text-center px-4">
          Civil Engineering Consultation & Construction
        </p>
        <div className="absolute bottom-10 animate-bounce text-gray-500">
          <span className="text-sm">Scroll to build</span>
          <div className="w-6 h-10 border-2 border-gray-500 rounded-full mx-auto mt-2 flex justify-center pt-2">
            <div className="w-1 h-2 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </section>

      <BuildingAnimation />

      {/* Additional Content Section (Optional, to allow scrolling past the animation) */}
      <section className="w-full py-20 bg-black text-center">
        <h3 className="text-2xl text-gray-400 mb-8">Ready to start your project?</h3>
        <a href="/contact" className="inline-block px-8 py-4 bg-[var(--color-gold)] text-black font-bold rounded-full hover:bg-yellow-400 transition-colors">
          Get in Touch
        </a>
      </section>
    </main>
  );
}
