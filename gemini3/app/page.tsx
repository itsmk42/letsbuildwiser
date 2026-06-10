import BuildingAnimation from "@/components/BuildingAnimation";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">

      <BuildingAnimation />

      {/* Premium Post-Scroll CTA Section */}
      <section className="relative w-full py-24 md:py-32 bg-black text-center flex flex-col items-center overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[150px] pointer-events-none"></div>

        <h3 className="relative text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Ready to start <span className="gold-gradient-text">your project?</span>
        </h3>
        <p className="relative text-gray-400 text-base md:text-lg max-w-lg mx-auto mb-10 px-6 font-light tracking-wide">
          Let our expert engineers bring your vision to life with precision, quality, and care.
        </p>
        <a
          href="/contact"
          className="relative inline-block px-10 py-4 bg-[var(--color-gold)] text-black font-bold text-base rounded-full hover:shadow-[0_0_40px_rgba(255,215,0,0.45)] hover:scale-105 transition-all duration-300 tracking-wide mb-16"
        >
          Get in Touch
        </a>

        {/* Address Card */}
        <div className="relative glass-card px-8 py-6 max-w-md mx-4 text-center">
          <p className="font-bold text-white text-lg mb-1 tracking-tight">Lets Build Wiser</p>
          <div className="luxury-divider w-12 mx-auto my-3"></div>
          <p className="text-gray-400 text-sm leading-relaxed">2nd Floor, 584, A Block, 20th Main Road</p>
          <p className="text-gray-400 text-sm leading-relaxed">Sahakar Nagar, Bengaluru - 560092, Karnataka</p>
        </div>
      </section>
    </main>
  );
}
