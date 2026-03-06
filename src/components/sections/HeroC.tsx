/**
 * Concept C — Depth Type
 * Giant H1 where each word lives at a different z-depth.
 * Mouse movement drives per-word spring parallax — words closer to the viewer
 * shift more than words further away, simulating layered type in 3D space.
 * A bold diagonal tension line cuts across the composition.
 * Swiss editorial: type alone carries the design.
 */
import React, { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

const SP = { stiffness: 60, damping: 18 };
const EASE = [0.16, 1, 0.3, 1] as const;

// Depth multiplier per word — 1.0 = closest (moves most), 0.2 = furthest (moves least)
const WORDS = [
  { text: "pursuing",   depth: 0.9,  outlined: false, br: false },
  { text: "models",     depth: 0.35, outlined: false, br: true  },
  { text: "that",       depth: 0.65, outlined: false, br: false },
  { text: "solve",      depth: 0.2,  outlined: false, br: true  },
  { text: "impossible", depth: 1.0,  outlined: true,  br: false },
  { text: "problems.",  depth: 0.5,  outlined: false, br: false },
];

const META = [
  { idx: "01", label: "FUSION",       desc: "Plasma dynamics & nuclear modeling" },
  { idx: "02", label: "F1 STRATEGY",  desc: "Time-series & race simulation" },
  { idx: "03", label: "FORECASTING",  desc: "Uncertainty-aware prediction" },
];

interface ParallaxWordProps {
  text: string;
  depth: number;
  outlined: boolean;
  delay: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function ParallaxWord({ text, depth, outlined, delay, mouseX, mouseY }: ParallaxWordProps) {
  const rm = useReducedMotion();
  const range = 28 * depth;
  const px = useSpring(useTransform(mouseX, [0, 1], [-range, range]), SP);
  const py = useSpring(useTransform(mouseY, [0, 1], [-range * 0.55, range * 0.55]), SP);

  return (
    <motion.span
      className="inline-block"
      style={{
        x: rm ? 0 : px,
        y: rm ? 0 : py,
        color: outlined ? "transparent" : "inherit",
        WebkitTextStroke: outlined ? "1.5px rgba(42,42,40,0.5)" : undefined,
      }}
      initial={rm ? undefined : { opacity: 0, y: 30 }}
      animate={rm ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.72, delay, ease: EASE }}
    >
      {text}
    </motion.span>
  );
}

export function HeroC() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (rm || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    },
    [rm],
  );

  // Diagonal tension line — starts off-screen and draws in
  const diag = "M -40,680 L 960,-40";

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col overflow-hidden cursor-default"
      style={{ background: "#D8CFC4" }}
      id="top"
      onMouseMove={handleMouseMove}
    >
      {/* Diagonal tension line (structural Swiss element) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 920 680" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <motion.path
            d={diag}
            fill="none"
            stroke="#2a2a28"
            strokeWidth="0.6"
            opacity="0.2"
            initial={rm ? undefined : { pathLength: 0 }}
            animate={rm ? undefined : { pathLength: 1 }}
            transition={rm ? undefined : { pathLength: { duration: 1.6, delay: 0.8, ease: [0.4, 0, 0.2, 1] } }}
          />
        </svg>
      </div>

      <div className="max-grid relative z-10 flex-1 flex flex-col px-6 sm:px-10 md:px-12 lg:px-16 pt-24 pb-0">
        {/* Eyebrow */}
        <motion.p
          className="text-[11px] uppercase tracking-[0.3em] font-medium mt-4 mb-10 lg:mb-14"
          style={{ color: "#0e3b2e" }}
          initial={rm ? undefined : { opacity: 0 }}
          animate={rm ? undefined : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          data & ml
        </motion.p>

        {/* Main row: parallax H1 + vertical rule + meta */}
        <div className="flex-1 flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-0">

          {/* Giant H1 — each word at its own parallax depth */}
          <div className="flex-1 min-w-0">
            <h1
              className="leading-[0.94] tracking-[-0.036em]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 8.5vw, 7.5rem)",
                color: "#0b0c0d",
              }}
            >
              {WORDS.map((word, i) => (
                <React.Fragment key={i}>
                  <ParallaxWord
                    text={word.text}
                    depth={word.depth}
                    outlined={word.outlined}
                    delay={0.1 + i * 0.075}
                    mouseX={mx}
                    mouseY={my}
                  />
                  {word.br ? <br /> : " "}
                </React.Fragment>
              ))}
            </h1>
          </div>

          {/* Vertical rule + meta — desktop only */}
          <div className="hidden lg:block w-[210px] xl:w-[228px] ml-10 xl:ml-16 shrink-0 pt-1">
            <div className="relative pl-7">
              {/* Rule grows top → bottom */}
              <motion.div
                className="absolute left-0 inset-y-0 w-px"
                style={{ background: "rgba(42,42,40,0.22)", transformOrigin: "top" }}
                initial={rm ? undefined : { scaleY: 0 }}
                animate={rm ? undefined : { scaleY: 1 }}
                transition={{ duration: 1.4, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
              />

              <div className="space-y-8">
                {META.map((item, i) => (
                  <motion.div
                    key={item.idx}
                    initial={rm ? undefined : { opacity: 0, x: 10 }}
                    animate={rm ? undefined : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, delay: 0.8 + i * 0.1, ease: EASE }}
                  >
                    <p
                      className="text-[9px] tracking-[0.34em] mb-1.5 font-medium"
                      style={{ fontFamily: "var(--font-mono)", color: "rgba(42,42,40,0.35)" }}
                    >
                      {item.idx}
                    </p>
                    <p
                      className="text-[10.5px] uppercase tracking-[0.2em] font-medium mb-1.5"
                      style={{ fontFamily: "var(--font-mono)", color: "#0b0c0d" }}
                    >
                      {item.label}
                    </p>
                    <p className="text-[12px] leading-[1.58]" style={{ color: "#6b6660" }}>
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile meta */}
        <div className="lg:hidden mt-10 grid grid-cols-3 gap-4">
          {META.map((item) => (
            <div key={item.idx}>
              <p className="text-[9px] tracking-[0.28em] mb-1" style={{ fontFamily: "var(--font-mono)", color: "rgba(42,42,40,0.38)" }}>
                {item.idx}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ fontFamily: "var(--font-mono)", color: "#0b0c0d" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Hairline + subtext strip */}
        <motion.div
          className="mt-10 py-6 flex items-center"
          style={{ borderTop: "1px solid rgba(42,42,40,0.14)" }}
          initial={rm ? undefined : { opacity: 0 }}
          animate={rm ? undefined : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <p className="text-[11px] tracking-[0.06em]" style={{ color: "#6b6660" }}>
            Machine learning for complex systems.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
