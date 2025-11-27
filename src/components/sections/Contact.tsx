import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../primitives/Button";

export function ContactSection() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    // assemble email client-side to reduce static scraping
    const parts = ["daly", "carter", "w", "gmail", "com"];
    const assembled = `${parts[0]}.${parts[1]}.${parts[2]}@${parts[3]}.${parts[4]}`;
    setEmail(assembled);
  }, []);

  return (
    <section id="contact" className="section-padding bg-[#111111]">
      <div className="max-grid border border-[rgba(216,207,196,0.2)] p-8 md:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-start gap-8 md:gap-10 lg:gap-10">
        <div className="flex flex-col">
          <span className="eyebrow mb-4">Contact</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-6">Let’s collaborate.</h2>
          <a
            href={email ? `mailto:${email}` : undefined}
            aria-label={email || "email"}
            className="inline-flex text-base md:text-lg text-[var(--color-text)] tracking-normal border-b border-transparent hover:border-[var(--color-text)] transition-colors pb-[2px] mb-8"
          >
            {email || "••••••••"}
          </a>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-start gap-5 lg:gap-5 lg:self-start lg:translate-y-[2px] w-full max-w-none"
        >
          <Button
            variant="primaryRed"
            href="https://github.com/carterdaly"
            target="_blank"
            rel="noreferrer"
            className="tracking-[0.18em] justify-center px-6 py-2.5 w-[220px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
          >
            GitHub
          </Button>
          <Button
            variant="primary"
            href="https://www.linkedin.com/in/carterwdaly/"
            target="_blank"
            rel="noreferrer"
            className="tracking-[0.18em] justify-center px-6 py-2.5 w-[220px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
          >
            LinkedIn
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
