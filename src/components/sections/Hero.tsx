import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "../primitives/Button";

const staggerParent = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = (distance = 18) => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
});

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="section-padding pt-18 md:pt-22 lg:pt-24 bg-[var(--accent-tertiary)] relative overflow-hidden" id="top">
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 1px, transparent 4px)" }}></div>
      <div className="max-grid relative grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="lg:col-span-5 space-y-6"
        >
          <motion.span
            variants={fadeUp()}
            className="eyebrow text-[0.7rem] tracking-[0.32em] font-semibold"
            style={{ color: "#0b0c0d" }}
          >
            DATA & ML
          </motion.span>
          <motion.h1
            variants={fadeUp()}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.08] text-[#0b0c0d]"
          >
            pursuing models
            <br />
            that solve
            <br />
            impossible problems.
          </motion.h1>
          <motion.p variants={fadeUp()} className="text-[16px] text-[#0b0c0d] max-w-xl leading-relaxed">
            Machine learning and data science for complex systems; pragmatic methods, ambitious abstractions.
          </motion.p>
          <motion.p variants={fadeUp()} className="text-[15px] text-[#3a3a3a] max-w-md leading-relaxed">
            Currently crafting resilient modeling approaches that balance rigor, clarity, and pace.
          </motion.p>
          <motion.div variants={fadeUp()} className="flex flex-wrap gap-3 pt-2">
            <Button href="mailto:hello@carterdaly.com">Email me</Button>
            <Button
              variant="ghost"
              className="border-[var(--accent-primary)] text-[var(--accent-primary)] hover:text-[var(--color-text)]"
              href="/cv.pdf"
            >
              View résumé
            </Button>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-7 relative min-h-[420px] md:min-h-[480px] lg:min-h-[540px] border border-[rgba(0,0,0,0.12)]">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((left, i) => (
              <span
                key={i}
                className="absolute top-0 bottom-0 w-px bg-[rgba(0,0,0,0.14)]"
                style={{ left: `${left}%` }}
              />
            ))}
            {[0, 20, 40, 60, 80, 100].map((top, i) => (
              <span
                key={`row-${i}`}
                className="absolute left-0 right-0 h-px bg-[rgba(0,0,0,0.12)]"
                style={{ top: `${top}%` }}
              />
            ))}
          </div>
          <div className="absolute inset-0">
            <div className="absolute inset-[14%] border border-[rgba(0,0,0,0.2)]" />
            <div className="absolute inset-x-[22%] inset-y-[30%] border border-[rgba(0,0,0,0.22)]" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center gap-12 px-10">
            <div className="flex items-center gap-6">
              <span className="h-px flex-1 bg-[rgba(0,0,0,0.26)]" />
              <span className="text-[11px] uppercase tracking-[0.26em] text-[var(--accent-secondary)]">fusion</span>
            </div>
            <div className="flex items-center gap-6 justify-end">
              <span className="text-[11px] uppercase tracking-[0.26em] text-[var(--accent-primary)]">time-series</span>
              <span className="h-px flex-1 bg-[rgba(0,0,0,0.26)]" />
            </div>
          </div>
          <motion.div
            className="absolute left-[22%] top-[26%] w-32 h-32 border border-[rgba(14,59,46,0.5)]"
            animate={
              prefersReducedMotion
                ? {}
                : { x: [0, 3, 0], y: [0, -3, 0] }
            }
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[22%] bottom-[22%] w-14 h-14 border border-[rgba(138,16,30,0.5)]"
            animate={
              prefersReducedMotion
                ? {}
                : { x: [0, -3, 0], y: [0, 3, 0] }
            }
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-[rgba(0,0,0,0.2)]"
            animate={
              prefersReducedMotion
                ? {}
                : { rotate: 360 }
            }
            transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
          />
          <motion.div
            className="absolute right-[32%] top-[24%] w-2 h-2 bg-[var(--accent-primary)]"
            animate={
              prefersReducedMotion
                ? {}
                : { x: [0, 3, 0], y: [0, 2, 0] }
            }
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-[32%] bottom-[24%] w-1.5 h-1.5 bg-[var(--accent-secondary)]"
            animate={
              prefersReducedMotion
                ? {}
                : { y: [0, -2, 0] }
            }
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-10 top-10 h-5 border-l border-[rgba(0,0,0,0.18)]" />
            <div className="absolute right-10 bottom-10 h-5 border-r border-[rgba(0,0,0,0.18)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
