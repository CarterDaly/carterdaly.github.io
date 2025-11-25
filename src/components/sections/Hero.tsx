import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "../primitives/Button";
import { HeroGraphic } from "./HeroGraphic";

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

        <div className="lg:col-span-7 flex justify-center items-center px-0">
          <div className="w-full max-w-[1500px] aspect-[4/3]">
            <HeroGraphic />
          </div>
        </div>
      </div>
    </section>
  );
}
