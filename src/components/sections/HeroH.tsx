/**
 * Concept H — Swiss Planes
 * A bold dark panel slides in from the right on load, occupying 38% of the viewport.
 * The H1 headline straddles the warm/dark boundary — rendered twice with a clip-path
 * so the same text appears dark on warm and light on dark simultaneously.
 * Scroll parallax: the dark panel drifts upward at 0.55× speed, peeling away from text.
 * Highly Swiss: two-colour composition, type at the edge of a hard boundary.
 */
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

const SPLIT = 62; // % from left where the dark panel begins

const EASE = [0.16, 1, 0.3, 1] as const;
const SP = { stiffness: 45, damping: 14 };

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const fadeUp = (y = 20) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.82, ease: EASE } },
});

// Panel labels (inside dark panel, small white mono)
const PANEL_LABELS = ["FUSION", "F1 STRATEGY", "FORECASTING", "—", "2024"];

const H1_TEXT = "pursuing models\nthat solve\nimpossible problems.";

export function HeroH() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Dark panel moves up at 0.55× speed — peels away from static text
  const panelY = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]),
    SP,
  );

  const h1Style: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(2.6rem, 5.4vw, 4.8rem)",
    lineHeight: 1.02,
    letterSpacing: "-0.026em",
    whiteSpace: "pre-line",
    margin: 0,
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex flex-col overflow-hidden"
      style={{ background: "#D8CFC4" }}
      id="top"
    >
      {/* Dark panel — slides in from right, has scroll parallax */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 pointer-events-none"
        style={{
          width: `${100 - SPLIT}%`,
          background: "#0b0c0d",
          y: rm ? 0 : panelY,
        }}
        initial={rm ? undefined : { x: "100%" }}
        animate={rm ? undefined : { x: 0 }}
        transition={rm ? undefined : { duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Panel interior: thin left rule + stacked mono labels */}
        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "rgba(216,207,196,0.12)" }} />
        <motion.div
          className="absolute top-0 left-6 flex flex-col justify-center h-full gap-5"
          initial={rm ? undefined : { opacity: 0 }}
          animate={rm ? undefined : { opacity: 1 }}
          transition={rm ? undefined : { duration: 0.6, delay: 1.4 }}
        >
          {PANEL_LABELS.map((label, i) => (
            <p
              key={i}
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{
                fontFamily: "var(--font-mono)",
                color: label === "—" ? "rgba(216,207,196,0.22)" : "rgba(216,207,196,0.45)",
              }}
            >
              {label}
            </p>
          ))}
        </motion.div>
      </motion.div>

      {/* Content layer — full width, sits above the dark panel */}
      <div className="max-grid relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 pt-28 pb-20">

        {/* Eyebrow */}
        <motion.p
          className="text-[11px] uppercase tracking-[0.3em] font-medium mb-9"
          style={{ color: "#0e3b2e" }}
          initial={rm ? undefined : { opacity: 0 }}
          animate={rm ? undefined : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          data & ml
        </motion.p>

        {/* Straddle H1: same text rendered twice with opposing clip-paths */}
        <motion.div
          className="relative mb-9"
          initial={rm ? undefined : { opacity: 0 }}
          animate={rm ? undefined : { opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.4 }}
        >
          {/* Spacer — establishes height for the absolute positioned twins */}
          <h1 style={{ ...h1Style, visibility: "hidden" }}>{H1_TEXT}</h1>

          {/* Warm side: dark text, clipped to left of split */}
          <h1
            style={{
              ...h1Style,
              color: "#0b0c0d",
              position: "absolute",
              inset: 0,
              clipPath: `inset(0 ${100 - SPLIT}% 0 0)`,
            }}
          >
            {H1_TEXT}
          </h1>

          {/* Dark side: light text, clipped to right of split */}
          <h1
            style={{
              ...h1Style,
              color: "#e8e4dd",
              position: "absolute",
              inset: 0,
              clipPath: `inset(0 0 0 ${SPLIT}%)`,
            }}
          >
            {H1_TEXT}
          </h1>
        </motion.div>

        {/* Subtext — warm side only */}
        <motion.p
          className="text-[15px] leading-[1.78] max-w-[360px]"
          style={{ color: "#4a4845" }}
          initial={rm ? undefined : { opacity: 0, y: 12 }}
          animate={rm ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.6, ease: EASE }}
        >
          Machine learning and data science for complex systems; pragmatic
          methods, ambitious abstractions.
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(42,42,40,0.18)" }} />
    </section>
  );
}
