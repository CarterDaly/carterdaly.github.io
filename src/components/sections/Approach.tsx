import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Research & data",
    copy: "Curate, clean, and interrogate signals; establish baselines with rigorous exploratory analysis.",
  },
  {
    title: "Modeling & uncertainty",
    copy: "Choose architectures that respect variance; quantify uncertainty and communicate trade-offs.",
  },
  {
    title: "Evaluation & iteration",
    copy: "Tight feedback loops with domain-aligned metrics; iterate quickly without sacrificing clarity.",
  },
  {
    title: "Communication & storytelling",
    copy: "Narratives and visuals that make decisions obvious to stakeholders without hiding nuance.",
  },
];

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ApproachSection() {
  return (
    <section className="section-padding border-t border-[rgba(216,207,196,0.18)] bg-[#101010]">
      <div className="max-grid grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-4 space-y-4">
          <span className="eyebrow">Approach</span>
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] leading-tight">
            Systems built with clarity and intent.
          </h2>
          <p className="text-[var(--color-muted)] leading-relaxed">
            A measured path from research to delivery — balancing rigor, tempo, and communication.
          </p>
        </div>

        <div className="lg:col-span-8 border border-[rgba(216,207,196,0.2)] divide-y divide-[rgba(216,207,196,0.12)]">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              className="p-6 md:p-7 flex flex-col gap-2"
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={idx}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">{step.title}</h3>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--accent-tertiary)]">Step {idx + 1}</span>
              </div>
              <p className="text-[var(--color-muted)] leading-relaxed">{step.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
