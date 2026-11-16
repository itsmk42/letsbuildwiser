import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";

export const metadata: Metadata = {
  title: {
    default: "Letsbuildwiser | Civil Engineering Consultation in Bengaluru",
    template: "%s | Letsbuildwiser",
  },
  description:
    "Expert civil engineering consultation & residential construction in Bengaluru. Structural design, regulatory compliance, cost optimization, and quality construction — from blueprint to build.",
  keywords: [
    "civil engineering consultation",
    "construction company Bengaluru",
    "structural design Karnataka",
    "residential construction Bangalore",
    "building consultation India",
    "Letsbuildwiser",
    "house construction Bengaluru",
    "civil engineer near me",
  ],
  metadataBase: new URL("https://letsbuildwiser.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://letsbuildwiser.com",
    siteName: "Letsbuildwiser",
    title: "Letsbuildwiser | Civil Engineering Consultation in Bengaluru",
    description:
      "Expert civil engineering consultation & residential construction in Bengaluru. From blueprint to build.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Letsbuildwiser — Civil Engineering Consultation & Construction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Letsbuildwiser | Civil Engineering Consultation in Bengaluru",
    description:
      "Expert civil engineering consultation & residential construction in Bengaluru. From blueprint to build.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru",
    "geo.position": "13.0604;77.5906",
  },
};

// JSON-LD Structured Data for Local Business
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Letsbuildwiser",
  description:
    "Expert civil engineering consultation and residential construction services in Bengaluru, Karnataka.",
  url: "https://letsbuildwiser.com",
  telephone: "+919019707029",
  email: "hello@letsbuildwiser.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, 584, A Block, 20th Main Road, Sahakar Nagar",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560092",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 13.0604,
    longitude: 77.5906,
  },
  image: "https://letsbuildwiser.com/og-image.png",
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="color-scheme" content="dark" />
        {/* lets the stylesheet hide draw-on elements only when scripts can reveal them */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ScrollEffects />
        <noscript>
          <div style={{ padding: "2rem", textAlign: "center", color: "#fff", backgroundColor: "#000" }}>
            <h1>Letsbuildwiser</h1>
            <p>Civil Engineering Consultation &amp; Construction in Bengaluru</p>
            <p>Please enable JavaScript to view this website.</p>
            <p>Call us: <a href="tel:+919019707029" style={{ color: "#ffd700" }}>+91 90197 07029</a></p>
            <p>Email: <a href="mailto:hello@letsbuildwiser.com" style={{ color: "#ffd700" }}>hello@letsbuildwiser.com</a></p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
