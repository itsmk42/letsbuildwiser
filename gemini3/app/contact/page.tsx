import ContactSection from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <ContactSection
      page
      heading={
        <>
          Let&apos;s Build <span className="gold">Wiser</span>
        </>
      }
      lede="Ready to start your next project? Get in touch with us for a consultation."
    />
  );
}
