import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Letsbuildwiser — Civil Engineering Consultation Bengaluru",
  description:
    "Get in touch with Letsbuildwiser for expert civil engineering consultation in Bengaluru. Call +91 90197 07029 or fill out our inquiry form for residential construction, structural design, and more.",
  openGraph: {
    title: "Contact Letsbuildwiser — Civil Engineering Consultation",
    description:
      "Reach out for expert civil engineering consultation in Bengaluru. Online & on-site consultations available.",
    url: "https://letsbuildwiser.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
