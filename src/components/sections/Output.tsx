import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { SectionHeader } from "../primitives/SectionHeader";

const domains: {
  title: string;
  description: string;
  href?: string;
}[] = [
  {
    title: "Fusion modeling",
    description: "Data-driven plasma insights and uncertainty-aware modeling for complex, noisy systems.",
  },
  {
    title: "Race strategy & FastF1",
    description: "Real-time, time-series tactics grounded in interpretable signals and pace modelling.",
  },
  {
    title: "Forecasting systems",
    description: "A no-code front-end to Nixtla's forecasting stack. Benchmark statistical, ML, and neural models in one UI.",
    href: "/work/nixtla",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function OutputSection() {
  return (
    <section id="output" className="grain-panel section-padding bg-[#0f0f0f]">
      <div className="max-grid space-y-8">
        <SectionHeader
          label="Output"
          title="Selected work"
          description="A selection of projects I’ve enjoyed building: scientific prediction, strategic modeling, and practical analytics solutions."
        />
        <div className="grid md:grid-cols-3 gap-6 md:gap-0 border border-[rgba(216,207,196,0.2)] divide-y md:divide-y-0 md:divide-x divide-[rgba(216,207,196,0.14)]">
          {domains.map((domain, idx) => {
            const Card = domain.href ? motion.a : motion.div;
            return (
              <Card
                key={domain.title}
                {...(domain.href ? { href: domain.href } : {})}
                className={clsx(
                  "group p-6 md:p-7 flex flex-col gap-3 transition-colors duration-200",
                  domain.href
                    ? "hover:bg-[rgba(255,255,255,0.02)] cursor-pointer"
                    : "cursor-default",
                )}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                custom={idx}
              >
                <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.24em] text-[var(--accent-tertiary)]">
                  <span className="text-[var(--accent-secondary)]">0{idx + 1}</span>
                  <span className="h-px flex-1 bg-[rgba(216,207,196,0.25)]" />
                  {domain.href ? (
                    <span
                      className="text-[var(--accent-tertiary)] opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  ) : null}
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] leading-tight">{domain.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed text-base">{domain.description}</p>
                {domain.href ? (
                  <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[var(--accent-tertiary)] opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" style={{ fontFamily: "var(--font-mono)" }}>
                    View project
                  </span>
                ) : null}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
