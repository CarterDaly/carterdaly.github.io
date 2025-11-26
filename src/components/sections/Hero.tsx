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
    <section className="section-padding pt-20 md:pt-24 lg:pt-28 bg-[var(--accent-tertiary)] relative overflow-hidden min-h-[660px]" id="top">
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 1px, transparent 4px)" }}></div>
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="w-full h-full">
          <HeroGraphic />
        </div>
      </div>
      <div className="max-grid relative z-10 grid lg:grid-cols-12 gap-14 lg:gap-20 items-stretch">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="lg:col-span-4 relative flex gap-8 lg:gap-10"
        >
          <div className="absolute left-0 top-0 h-full w-px bg-[rgba(0,0,0,0.14)]" aria-hidden="true" />
          <motion.span
            variants={fadeUp()}
            className="eyebrow text-[0.66rem] tracking-[0.26em] font-semibold"
            style={{ color: "#0b0c0d", writingMode: "vertical-rl", transform: "rotate(180deg)", alignSelf: "flex-start", marginTop: "16px", marginLeft: "-28px" }}
          >
            DATA & ML
          </motion.span>
          <div className="space-y-10 max-w-[32rem] pl-5">
            <motion.h1
              variants={fadeUp()}
              className="text-5xl md:text-6xl lg:text-[4.6rem] font-semibold leading-[1.02] tracking-[-0.01em] text-[#0b0c0d]"
            >
              pursuing models
              <br />
              that solve impossible problems.
            </motion.h1>
            <motion.p variants={fadeUp()} className="text-[16px] text-[#0b0c0d] max-w-[32rem] leading-[1.7] tracking-[0.01em]">
            Machine learning and data science for complex systems; pragmatic methods, ambitious abstractions.
          </motion.p>
          </div>
        </motion.div>

        <div className="lg:col-span-8" />
      </div>
    </section>
  );
}
