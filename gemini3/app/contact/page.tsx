"use client";

import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "builderonline@gmail.com";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const formEndpoint = `https://formsubmit.co/ajax/${contactEmail}`;
            const response = await fetch(formEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success === "false" || result.success === false) {
                    throw new Error(result.message || "Failed to submit inquiry.");
                }
                setStatus("success");
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to submit inquiry.");
            }
        } catch (error: any) {
            console.error("FormSubmit Error:", error);
            setErrorMessage(error.message || "Something went wrong. Please try again.");
            setStatus("error");
        }
    };

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
                                <p className="text-lg font-medium">Lets Build Wiser</p>
                                <p className="text-sm text-gray-400">2nd Floor, 584, A Block, 20th Main Road</p>
                                <p className="text-sm text-gray-400">Sahakar Nagar, Bengaluru - 560092, Karnataka</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl min-h-[500px] flex flex-col justify-center transition-all duration-500">
                    {status === "success" ? (
                        <div className="text-center py-12 px-4 animate-fadeIn flex flex-col items-center justify-center space-y-6">
                            <div className="w-20 h-20 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 rounded-full flex items-center justify-center text-[var(--color-gold)] mb-4 animate-scaleUp">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 animate-pulse">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Inquiry Received</h2>
                            <p className="text-gray-400 text-lg max-w-sm mx-auto leading-relaxed">
                                Thank you! We have received your message and will get back to you as soon as possible.
                            </p>
                            <div className="pt-4">
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
                                >
                                    Send another message
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <input type="hidden" name="_subject" value="New Letsbuildwiser inquiry" />
                                <input type="hidden" name="_template" value="table" />
                                <input type="hidden" name="_captcha" value="false" />
                                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            disabled={status === "submitting"}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium text-gray-400">Phone</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            disabled={status === "submitting"}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            disabled={status === "submitting"}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="location" className="text-sm font-medium text-gray-400">Location</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            required
                                            disabled={status === "submitting"}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Bengaluru, Karnataka"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="plot-size" className="text-sm font-medium text-gray-400">Plot Size</label>
                                        <input
                                            type="text"
                                            id="plot-size"
                                            name="plot_size"
                                            disabled={status === "submitting"}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Example: 30x40 ft"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="requirement-type" className="text-sm font-medium text-gray-400">Type of Requirement</label>
                                        <select
                                            id="requirement-type"
                                            name="requirement_type"
                                            required
                                            disabled={status === "submitting"}
                                            defaultValue=""
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="" disabled className="bg-black text-gray-400">Select</option>
                                            <option value="Online Consultation" className="bg-black text-white">Online Consultation</option>
                                            <option value="On-site Consultation" className="bg-black text-white">On-site Consultation</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        required
                                        disabled={status === "submitting"}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Share current stage, issues, expected timeline, and budget context."
                                    ></textarea>
                                </div>

                                {status === "error" && (
                                    <div className="text-red-400 bg-red-950/20 border border-red-900/30 p-4 rounded-lg text-sm text-center animate-fadeIn">
                                        {errorMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="w-full bg-[var(--color-gold)] text-black font-bold py-4 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
                                >
                                    {status === "submitting" ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Sending Inquiry...</span>
                                        </span>
                                    ) : (
                                        "Submit Inquiry"
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

