/**
 * Concept G — Character Dissolve
 * Each letter of the headline materialises individually via blur + opacity dissolve.
 * Timing is seeded pseudo-randomly per character index — organic, not mechanical.
 * "impossible" resolves last, treated as the focal word.
 * Background: faint horizontal bands slide in from the right (like a slow scan).
 * Scroll parallax: band layer rises 30% faster than text.
 */
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

// Deterministic pseudo-random in [0, 1) — avoids Math.random() in render
const noise = (i: number) => ((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;

const LINES = [
  "pursuing models",
  "that solve",
  "impossible problems.",
];

// Flatten to array of { char, lineIdx, charInLine, globalIdx, isImpossible }
type CharDef = { char: string; lineIdx: number; globalIdx: number; isImpossible: boolean };
const CHARS: CharDef[] = [];
let g = 0;
LINES.forEach((line, li) => {
  line.split("").forEach((char) => {
    CHARS.push({ char, lineIdx: li, globalIdx: g, isImpossible: li === 2 && LINES[2].indexOf("impossible") <= CHARS.filter(c => c.lineIdx === 2).length && CHARS.filter(c => c.lineIdx === 2).length < 10 });
    g++;
  });
});

// Simpler: just flag chars in "impossible" by position range
// Line 2 ("impossible problems.") starts at the offset after lines 0 and 1
const LINE0_LEN = LINES[0].length; // 15
const LINE1_LEN = LINES[1].length; // 10
const IMPOSSIBLE_START = LINE0_LEN + LINE1_LEN; // 25
const IMPOSSIBLE_END = IMPOSSIBLE_START + 10;   // 35 ("impossible")

const BAND_COUNT = 18;
const BANDS = Array.from({ length: BAND_COUNT }, (_, i) => ({
  y: (i / BAND_COUNT) * 100, // percentage height
  opacity: 0.028 + (i % 3 === 0 ? 0.018 : 0),
  delay: 0.1 + i * 0.06,
}));

const EASE = [0.16, 1, 0.3, 1] as const;
const SP = { stiffness: 48, damping: 15 };

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};
const fadeUp = (y = 16) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: EASE } },
});

export function HeroG() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Band layer rises faster than text — creates depth
  const bandY = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]),
    SP,
  );

  // Build H1 as an array of dissolve spans
  let charCounter = 0;
  const h1Content = LINES.map((line, li) => {
    const lineSpans = line.split("").map((char) => {
      const i = charCounter++;
      const isImp = i >= IMPOSSIBLE_START && i < IMPOSSIBLE_END;
      // "impossible" resolves later with a slightly larger blur
      const baseDelay = isImp
        ? 0.55 + noise(i) * 0.35
        : 0.22 + (i / CHARS.length) * 0.55 + noise(i) * 0.28;
      return (
        <motion.span
          key={i}
          style={{
            display: "inline-block",
            color: isImp ? "transparent" : "inherit",
            WebkitTextStroke: isImp ? "1.5px rgba(42,42,40,0.52)" : undefined,
          }}
          initial={rm ? undefined : { opacity: 0, filter: "blur(14px)", y: 5 }}
          animate={rm ? undefined : { opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={
            rm
              ? undefined
              : {
                  opacity: { duration: 0.9, delay: baseDelay, ease: [0.2, 0.2, 0.2, 1] },
                  filter: { duration: 0.85, delay: baseDelay, ease: [0.2, 0.2, 0.2, 1] },
                  y: { duration: 0.7, delay: baseDelay, ease: EASE },
                }
          }
        >
          {char === " " ? "\u00a0" : char}
        </motion.span>
      );
    });
    return (
      <span key={li} style={{ display: "block" }}>
        {lineSpans}
      </span>
    );
  });

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex flex-col overflow-hidden"
      style={{ background: "#D8CFC4" }}
      id="top"
    >
      {/* Horizontal bands — scroll parallax layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ y: rm ? 0 : bandY }}
        aria-hidden="true"
      >
        {BANDS.map((band, i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top: `${band.y}%`,
              height: "1px",
              background: "#2a2a28",
              opacity: 0,
            }}
            animate={{ opacity: band.opacity, x: [80, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: band.delay },
              x: { duration: 1.4, delay: band.delay, ease: [0.4, 0, 0.2, 1] },
            }}
          />
        ))}
      </motion.div>

      {/* Content */}
      <div className="max-grid relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 pt-28 pb-20">
        <div className="max-w-[580px] space-y-9">
          {/* Eyebrow and subtext fade normally */}
          <motion.p
            className="text-[11px] uppercase tracking-[0.3em] font-medium"
            style={{ color: "#0e3b2e" }}
            initial={rm ? undefined : { opacity: 0 }}
            animate={rm ? undefined : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            data & ml
          </motion.p>

          {/* H1 — character-by-character blur dissolve */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 6.2vw, 5.4rem)",
              color: "#0b0c0d",
              lineHeight: 1.01,
              letterSpacing: "-0.026em",
            }}
          >
            {h1Content}
          </h1>

          <motion.p
            className="text-[15px] leading-[1.78] max-w-[390px]"
            style={{ color: "#4a4845" }}
            initial={rm ? undefined : { opacity: 0, y: 12 }}
            animate={rm ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
          >
            Machine learning and data science for complex systems; pragmatic
            methods, ambitious abstractions.
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(42,42,40,0.18)" }} />
    </section>
  );
}
