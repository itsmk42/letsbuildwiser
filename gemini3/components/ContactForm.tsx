"use client";

import { useState } from "react";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "balleryonline@gmail.com";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const busy = status === "submitting";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Record<string, FormDataEntryValue> = {};
    new FormData(e.currentTarget).forEach((value, key) => {
      data[key] = value;
    });
    if (data._honey) return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === "false" || result.success === false) {
        throw new Error(result.message || "Failed to submit inquiry.");
      }
      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="formok" role="status">
        <svg viewBox="-30 -30 60 60" aria-hidden>
          <circle r="27" fill="none" stroke="#FFE100" strokeWidth="1.5" />
          <path d="M-11 0l8 8 15-17" fill="none" stroke="#FFE100" strokeWidth="2" />
        </svg>
        <h4>Inquiry Received</h4>
        <p>Thank you! We have received your message and will get back to you as soon as possible.</p>
        <button className="btn" type="button" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="_subject" value="New Letsbuildwiser inquiry" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="text" name="_honey" hidden tabIndex={-1} autoComplete="off" aria-hidden />

      <div className="row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required disabled={busy} autoComplete="name" placeholder="John Doe" />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" required disabled={busy} autoComplete="tel" placeholder="+91 XXXXX XXXXX" />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required disabled={busy} autoComplete="email" placeholder="john@example.com" />
        </div>
        <div className="field">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" required disabled={busy} placeholder="Bengaluru, Karnataka" />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="plot-size">
            Plot Size <em>(optional)</em>
          </label>
          <input type="text" id="plot-size" name="plot_size" disabled={busy} placeholder="Example: 30x40 ft" />
        </div>
        <fieldset className="field" disabled={busy}>
          <legend>Type of Requirement</legend>
          <div className="seg">
            <label>
              <input type="radio" name="requirement_type" value="Online Consultation" required />
              Online Consultation
            </label>
            <label>
              <input type="radio" name="requirement_type" value="On-site Consultation" />
              On-site Consultation
            </label>
          </div>
        </fieldset>
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          disabled={busy}
          placeholder="Share current stage, issues, expected timeline, and budget context."
        />
      </div>

      {status === "error" && (
        <p className="formerr" role="alert">
          {errorMessage}
        </p>
      )}

      <button className="btn btn--gold submit" type="submit" disabled={busy}>
        {busy ? (
          "Sending Inquiry…"
        ) : (
          <>
            Submit Inquiry{" "}
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M2 8h11M9 3.5L13.5 8 9 12.5" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
