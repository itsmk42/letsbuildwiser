import type { ReactNode } from "react";
import ContactForm from "./ContactForm";

type Props = {
  /** Render as the standalone /contact page (h1, clears the fixed bar). */
  page?: boolean;
  heading?: ReactNode;
  lede?: string;
};

export default function ContactSection({
  page = false,
  heading = (
    <>
      Ready to start <span className="gold">your project?</span>
    </>
  ),
  lede = "Let our expert engineers bring your vision to life with precision, quality, and care.",
}: Props) {
  const Heading = page ? "h1" : "h2";

  return (
    <section className={`contact${page ? " contact--page" : ""}`} id="contact" aria-labelledby="contact-h">
      <div className="wrap contact__grid">
        <div className="contact__copy rv">
          <p className="eyebrow">Get in touch</p>
          <Heading id="contact-h">{heading}</Heading>
          <p className="contact__lede">{lede}</p>
          <dl className="facts">
            <div>
              <dt>Call us</dt>
              <dd>
                <a href="tel:+919019707029">+91 90197 07029</a>
              </dd>
            </div>
            <div>
              <dt>Email us</dt>
              <dd>
                <a href="mailto:hello@letsbuildwiser.com">hello@letsbuildwiser.com</a>
              </dd>
            </div>
            <div>
              <dt>Visit us</dt>
              <dd>
                <a
                  href="https://maps.google.com/?q=2nd+Floor+584+A+Block+20th+Main+Road+Sahakar+Nagar+Bengaluru+560092"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lets Build Wiser
                </a>
                <br />
                <span>
                  2nd Floor, 584, A Block, 20th Main Road
                  <br />
                  Sahakar Nagar, Bengaluru - 560092, Karnataka
                </span>
              </dd>
            </div>
            <div>
              <dt>Open</dt>
              <dd>Monday – Saturday, 9:00 – 18:00</dd>
            </div>
          </dl>
        </div>

        <div className="formcard rv" style={{ "--d": 1 } as React.CSSProperties}>
          <div className="formcard__head">
            <h3>Send us a message</h3>
            <span>Consultation inquiry</span>
          </div>
          <div className="formcard__body">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
