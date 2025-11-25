import React from "react";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-[#0f0f0f]">
      <div className="max-grid">
        <div className="grid md:grid-cols-[1fr_3fr] gap-8 md:gap-12 items-start border border-[rgba(216,207,196,0.2)] p-6 md:p-8">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">About</span>
            <div className="w-12 h-px bg-[var(--accent-primary)]" />
          </div>
          <motion.div
            className="relative pl-6 border-l border-[rgba(216,207,196,0.18)] space-y-4"
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="text-lg text-[var(--color-text)] leading-relaxed">
              Carter Daly is an ML / data science engineer focused on high-leverage modeling for complex systems.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              He works across nuclear fusion modeling, race strategy with FastF1 telemetry, and resilient time-series forecasting —
              with a bias toward interpretable, decision-ready outputs.
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Currently exploring roles and collaborations that blend research rigor with delivery speed, building models that remain legible to the people who rely on them.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
