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
    <section className="section-padding pt-24 md:pt-28 lg:pt-32 bg-[var(--accent-tertiary)] relative overflow-hidden min-h-[68vh]" id="top">
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.12, backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 1px, transparent 4px)" }}></div>
      <div
        className="absolute inset-y-0 right-0 w-[82%] sm:w-[78%] lg:w-[74%] xl:w-[72%] pointer-events-none"
        style={{ opacity: 0.6 }}
      >
        <div className="w-full h-full translate-x-4 sm:translate-x-6 lg:translate-x-10 scale-[1.05]">
          <HeroGraphic />
        </div>
      </div>
      <div className="max-grid relative z-10 grid grid-cols-12 gap-x-10 lg:gap-x-16 gap-y-10 items-stretch">
        <motion.div variants={staggerParent} initial="hidden" animate="show" className="relative col-span-12 lg:col-span-6 xl:col-span-5 space-y-10 lg:space-y-12">
          <motion.h1
            variants={fadeUp()}
            className="text-5xl md:text-6xl lg:text-[4.4rem] font-semibold leading-[1.02] tracking-[-0.01em] text-[#0b0c0d]"
          >
            pursuing models
            <br />
            that solve impossible problems.
          </motion.h1>
          <motion.p variants={fadeUp(14)} className="text-[15.5px] text-[#0b0c0d] max-w-[30rem] leading-[1.68] tracking-[0.01em]">
            Machine learning and data science for complex systems; pragmatic methods, ambitious abstractions.
          </motion.p>
        </motion.div>

        <div className="hidden lg:block lg:col-span-5 xl:col-span-6" />
      </div>
    </section>
  );
}
