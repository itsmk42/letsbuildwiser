import BuildingAnimation from "@/components/BuildingAnimation";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">


      <BuildingAnimation />

      {/* Additional Content Section (Optional, to allow scrolling past the animation) */}
      <section className="w-full py-20 bg-black text-center flex flex-col items-center">
        <h3 className="text-2xl text-gray-400 mb-8">Ready to start your project?</h3>
        <a href="/contact" className="inline-block px-8 py-4 bg-[var(--color-gold)] text-black font-bold rounded-full hover:bg-yellow-400 transition-colors mb-12">
          Get in Touch
        </a>

        <div className="text-gray-500 text-sm max-w-md px-4 leading-relaxed">
          <p className="font-bold text-gray-400 mb-2">Adigallu Pvt. Ltd.</p>
          <p>Ondu Nirmana Samsthe</p>
          <p>2nd Floor, 584, A Block, 20th Main Road</p>
          <p>Sahakar Nagar, Bengaluru - 560092, Karnataka</p>
        </div>
      </section>
    </main>
  );
}
