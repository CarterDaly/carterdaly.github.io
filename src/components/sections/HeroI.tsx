/**
 * Concept I — Diagonal Torsion
 * A field of vertical lines draws in on load, then rotates as the user scrolls.
 * Scroll drives a CSS skewX transform on the entire line group — the lines shear
 * from vertical to diagonal as you descend, like the page itself is tilting.
 * Mouse parallax adds a secondary subtle tilt of the text column.
 * Stripped to essentials: type + ruled lines = Swiss graphic design at its core.
 */
import React, { useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

// Vertical lines, centered in the SVG's coordinate space (group is translated to center)
const CENTER_X = 720, CENTER_Y = 360;

const LINES = Array.from({ length: 16 }, (_, i) => {
  const x = -750 + i * 100;
  const major = i % 4 === 0;
  return {
    x,
    sw: major ? 0.85 : 0.45,
    op: major ? 0.16 : 0.09,
  };
});

const EASE = [0.16, 1, 0.3, 1] as const;
const SP = { stiffness: 52, damping: 16 };

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } },
};
const fadeUp = (y = 20) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.82, ease: EASE } },
});

export function HeroI() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Scroll drives shear of the line group
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // skewX: 0deg (vertical) → -26deg (diagonal) as user scrolls
  const skewX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -26]),
    SP,
  );

  // Mouse drives a gentle secondary tilt on the text
  const mx = useMotionValue(0.5);
  const textTiltY = useSpring(useTransform(mx, [0, 1], [2, -2]), SP);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (rm || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width);
    },
    [rm],
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex flex-col overflow-hidden cursor-default"
      style={{ background: "#D8CFC4" }}
      id="top"
      onMouseMove={handleMouseMove}
    >
      {/* Ruled line field */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 720"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          {/*
           * Lines are drawn inside a <g> that is pre-translated to the viewport center.
           * Framer Motion's skewX style is applied to the group, shearing around
           * the translated origin (i.e., the viewport center).
           */}
          <motion.g
            transform={`translate(${CENTER_X} ${CENTER_Y})`}
            style={{ skewX: rm ? 0 : skewX }}
          >
            {LINES.map((line, i) => (
              <motion.line
                key={i}
                x1={line.x} y1={-420}
                x2={line.x} y2={420}
                stroke="#2a2a28"
                strokeWidth={line.sw}
                opacity={line.op}
                initial={rm ? undefined : { pathLength: 0, opacity: 0 }}
                animate={rm ? undefined : { pathLength: 1, opacity: line.op }}
                transition={rm ? undefined : {
                  pathLength: {
                    duration: 1.4,
                    delay: 0.05 + i * 0.06,
                    ease: [0.4, 0, 0.2, 1],
                  },
                  opacity: { duration: 0.3, delay: 0.05 + i * 0.06 },
                }}
              />
            ))}

            {/* A single horizontal accent rule at mid-height */}
            <motion.line
              x1={-720} y1={0} x2={720} y2={0}
              stroke="#0e3b2e"
              strokeWidth="0.6"
              opacity={0.28}
              initial={rm ? undefined : { pathLength: 0 }}
              animate={rm ? undefined : { pathLength: 1 }}
              transition={rm ? undefined : {
                pathLength: { duration: 2.0, delay: 0.8, ease: [0.4, 0, 0.2, 1] },
              }}
            />
          </motion.g>
        </svg>
      </div>

      {/* Text — subtle secondary tilt on mouseX */}
      <div className="max-grid relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 pt-28 pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-[520px] space-y-9"
          style={{ rotateY: rm ? 0 : textTiltY, perspective: "1200px" }}
        >
          <motion.p
            variants={fadeUp(10)}
            className="text-[11px] uppercase tracking-[0.3em] font-medium"
            style={{ color: "#0e3b2e" }}
          >
            data & ml
          </motion.p>

          <motion.h1
            variants={fadeUp()}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 5.8vw, 5.0rem)",
              color: "#0b0c0d",
              lineHeight: 1.02,
              letterSpacing: "-0.026em",
            }}
          >
            pursuing models
            <br />
            that solve
            <br />
            impossible problems.
          </motion.h1>

          <motion.p
            variants={fadeUp(14)}
            className="text-[15px] leading-[1.78] max-w-[370px]"
            style={{ color: "#4a4845" }}
          >
            Machine learning and data science for complex systems; pragmatic
            methods, ambitious abstractions.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeUp(8)}
            className="flex items-center gap-3 pt-2"
          >
            <motion.div
              className="w-8 h-px"
              style={{ background: "#0e3b2e" }}
              animate={rm ? undefined : { scaleX: [1, 0.4, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <p
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(42,42,40,0.38)" }}
            >
              scroll to tilt
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(42,42,40,0.18)" }} />
    </section>
  );
}
