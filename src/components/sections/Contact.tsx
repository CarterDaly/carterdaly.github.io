import React from "react";
import { motion } from "framer-motion";
import { Button } from "../primitives/Button";

export function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-[#111111]">
      <div className="max-grid border border-[rgba(216,207,196,0.2)] p-8 md:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="space-y-3">
          <span className="eyebrow">Contact</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)]">Let’s collaborate.</h2>
          <p className="text-[var(--color-muted)] leading-relaxed max-w-xl">
            Open to research-focused ML roles, strategy collaborations, and projects where clarity and speed matter.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-wrap gap-4"
        >
          <Button href="mailto:hello@carterdaly.com">Email me</Button>
          <Button variant="secondary" href="/cv.pdf">View résumé</Button>
        </motion.div>
      </div>
    </section>
  );
}
