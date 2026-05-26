/**
 * Concept F — Musica Viva
 * Directly references Müller-Brockmann's 1959 concert poster series.
 * Large concentric circles anchor to the right; text anchors to the left.
 * Circles draw in with a slow, deliberate ease (3s for the main ring).
 * Scroll parallax: circle group drifts upward at 0.45× speed while text stays fixed.
 */
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

// Circle system: concentric, anchored to (CX, CY) in a 1440×720 viewBox.
// Main circle is large enough to partially bleed off-screen right/top.
const CX = 1080, CY = 380;

const CIRCLES = [
  { r: 420, sw: 1.4, op: 0.72, dash: "",    delay: 0.05, dur: 3.0 },
  { r: 318, sw: 0.9, op: 0.52, dash: "5 9", delay: 0.55, dur: 2.2 },
  { r: 210, sw: 0.7, op: 0.44, dash: "",    delay: 0.90, dur: 1.8 },
  { r: 118, sw: 0.6, op: 0.38, dash: "3 7", delay: 1.15, dur: 1.4 },
  { r:  48, sw: 1.2, op: 0.65, dash: "",    delay: 1.35, dur: 1.0 },
];

// Supplementary marks: horizontal tangent line, small accent dots
const TANGENT_Y = CY; // bisects the circle system horizontally

const EASE = [0.16, 1, 0.3, 1] as const;
const SP = { stiffness: 45, damping: 14 };

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
};
const fadeUp = (y = 22) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.88, ease: EASE } },
});

export function HeroF() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Scroll-driven vertical parallax for the circle layer
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Circle group moves up at 0.45× scroll speed → sense of depth
  const circleY = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]),
    SP,
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex flex-col overflow-hidden"
      style={{ background: "#D8CFC4" }}
      id="top"
    >
      {/* Circle composition — scroll parallax layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ y: rm ? 0 : circleY }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 720"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          {/* Very faint horizontal tangent line */}
          <motion.line
            x1={0} y1={TANGENT_Y} x2={1440} y2={TANGENT_Y}
            stroke="#2a2a28" strokeWidth="0.5" opacity="0.12"
            initial={rm ? undefined : { pathLength: 0 }}
            animate={rm ? undefined : { pathLength: 1 }}
            transition={rm ? undefined : { pathLength: { duration: 2.0, delay: 1.4, ease: [0.4, 0, 0.2, 1] } }}
          />

          {/* Concentric circles — innermost to outermost (so outermost renders first) */}
          {[...CIRCLES].reverse().map((c, i) => (
            <motion.circle
              key={c.r}
              cx={CX} cy={CY} r={c.r}
              fill="none"
              stroke="#2a2a28"
              strokeWidth={c.sw}
              opacity={c.op}
              strokeDasharray={c.dash || undefined}
              initial={rm ? undefined : { pathLength: 0 }}
              animate={rm ? undefined : { pathLength: 1 }}
              transition={rm ? undefined : {
                pathLength: {
                  duration: c.dur,
                  delay: c.delay,
                  ease: [0.2, 0, 0.8, 1], // slow start, slow end — very deliberate
                },
              }}
            />
          ))}

          {/* Accent: small solid circles at key positions */}
          <motion.circle
            cx={CX} cy={CY - CIRCLES[0].r} r="6"
            fill="#0e3b2e"
            initial={rm ? undefined : { opacity: 0, scale: 0 }}
            animate={rm ? undefined : { opacity: 1, scale: 1 }}
            transition={rm ? undefined : { duration: 0.5, delay: 1.6, ease: EASE }}
          />
          <motion.circle
            cx={CX + CIRCLES[2].r} cy={CY} r="4"
            fill="#8a101e"
            initial={rm ? undefined : { opacity: 0, scale: 0 }}
            animate={rm ? undefined : { opacity: 1, scale: 1 }}
            transition={rm ? undefined : { duration: 0.5, delay: 1.8, ease: EASE }}
          />

          {/* Fine crosshair through circle center (very faint) */}
          <line x1={CX} y1={0} x2={CX} y2={720} stroke="#2a2a28" strokeWidth="0.4" opacity="0.08" />
        </svg>
      </motion.div>

      {/* Text — fixed, not in parallax layer */}
      <div className="max-grid relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 pt-28 pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-[480px] space-y-9"
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
            className="text-[15px] leading-[1.78] max-w-[360px]"
            style={{ color: "#4a4845" }}
          >
            Machine learning and data science for complex systems; pragmatic
            methods, ambitious abstractions.
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(42,42,40,0.18)" }} />
    </section>
  );
}
