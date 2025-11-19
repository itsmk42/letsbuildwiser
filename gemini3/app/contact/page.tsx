"use client";

import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-navy)] rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-bronze)] rounded-full blur-[120px] opacity-10"></div>
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 z-10">
                {/* Contact Info */}
                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            Let's Build <span className="text-[var(--color-gold)]">Wiser</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Ready to start your next project? Get in touch with us for a consultation.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-gold)]">
                                <FaPhone size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Call Us</p>
                                <p className="text-lg font-medium">+1 (555) 123-4567</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-gold)]">
                                <FaEnvelope size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email Us</p>
                                <p className="text-lg font-medium">hello@letsbuildwiser.com</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[var(--color-gold)]">
                                <FaMapMarkerAlt size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Visit Us</p>
                                <p className="text-lg font-medium">123 Construction Ave, Building City</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-400">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                                placeholder="Tell us about your project..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[var(--color-gold)] text-black font-bold py-4 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-[1.02]"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
