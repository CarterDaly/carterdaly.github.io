import React from "react";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-[#121212]">
      <div className="max-grid">
        <div className="grid md:grid-cols-[1fr_3fr] gap-8 md:gap-12 items-start border border-[rgba(216,207,196,0.12)] bg-[rgba(255,255,255,0.02)] p-7 md:p-9">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">About</span>
            <div className="w-12 h-px bg-[var(--accent-primary)] opacity-80" />
          </div>
          <motion.div
            className="relative pl-6 border-l border-[rgba(216,207,196,0.12)] space-y-5"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="text-[var(--color-text)] opacity-90 leading-[1.72] text-base md:text-lg">
              I’ve always been drawn to puzzles because if you pay attention long enough, their shape eventually <strong>reveals</strong> itself. That pull leads me to building tools for <strong> messy systems</strong>, forecasting, pattern-finding, anything that doesn’t resolve easily. I like problems that feel slightly <strong>too big</strong>.
            </p>
            <p className="text-[var(--color-text)] opacity-90 leading-[1.72] text-base md:text-lg">
              That chase for the complex doesn’t stop outside of work. I revere <strong>music</strong>, both listening to and producing it. <strong>Skiing</strong> at the first hint of snowfall, dialing in the perfect shot of espresso, and the late nights and early mornings spent watching <strong>Formula 1</strong> all scratch the same part of my brain... and being a Ferrari fan teaches a different kind of patience.
            </p>
            <p className="text-[var(--color-text)] opacity-90 leading-[1.72] text-base md:text-lg">
              What I want, ultimately, is to work on things that push the frontier forward <strong>without forgetting the cost of moving too fast</strong>. Nuclear fusion, meticulous <strong>AGI</strong> advances, useful systems that <strong>reduce harm</strong>. I care about elegance, but I care more about whether something actually helps. If I can understand a problem well enough to build something meaningful around it, that, to me, is life pointed towards the right horizon.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
