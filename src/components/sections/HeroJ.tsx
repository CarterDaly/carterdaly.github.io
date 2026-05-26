/**
 * Concept J — The Growing Arc
 * A single quarter-circle arc begins as a small, bold fragment in the corner.
 * As the user scrolls, the arc expands dramatically — radius grows from 260 → 1440,
 * sweeping across the entire composition. The stroke thins as the arc grows,
 * suggesting a form receding into space. Text is fixed; only the arc moves.
 *
 * Scroll-driven radius update is applied via direct SVG DOM mutation (no re-renders).
 * The interplay between the static type and the expanding arc is the entire design.
 */
import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

// Arc: quarter-circle, center at bottom-right corner of the viewBox
const CX = 1440, CY = 720;

function arcPath(r: number): string {
  return `M ${CX - r},${CY} A ${r},${r} 0 0 1 ${CX},${CY - r}`;
}

function strokeWidth(r: number): number {
  // Lerp from 5.5 (small/close) to 0.7 (large/far)
  const t = Math.max(0, Math.min(1, (r - 260) / (1440 - 260)));
  return 5.5 + t * (0.7 - 5.5);
}

const R_MIN = 260;
const R_MAX = 1440;

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const fadeUp = (y = 22) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.88, ease: EASE } },
});

export function HeroJ() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const arcRef = useRef<SVGPathElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scroll-driven radius — direct SVG DOM mutation (zero re-renders)
  useEffect(() => {
    if (rm) return;
    const unsub = scrollYProgress.on("change", (progress) => {
      const r = R_MIN + progress * (R_MAX - R_MIN);
      if (arcRef.current) {
        arcRef.current.setAttribute("d", arcPath(r));
        arcRef.current.setAttribute("stroke-width", strokeWidth(r).toFixed(2));
      }
    });
    return unsub;
  }, [scrollYProgress, rm]);

  // A secondary thin "ghost" arc at R_MAX hints at the destination
  // It's visible from the start as a whisper
  const ghostPath = arcPath(R_MAX * 0.88);

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex flex-col overflow-hidden"
      style={{ background: "#D8CFC4" }}
      id="top"
    >
      {/* Arc layer */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 720"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          {/* Ghost arc — faint outline of the maximum extent */}
          <motion.path
            d={ghostPath}
            fill="none"
            stroke="#2a2a28"
            strokeWidth="0.4"
            initial={rm ? undefined : { opacity: 0 }}
            animate={rm ? undefined : { opacity: 0.1 }}
            transition={rm ? undefined : { duration: 2.4, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* A very fine second ghost arc at 60% of max */}
          <motion.path
            d={arcPath(R_MAX * 0.55)}
            fill="none"
            stroke="#0e3b2e"
            strokeWidth="0.35"
            initial={rm ? undefined : { opacity: 0 }}
            animate={rm ? undefined : { opacity: 0.12 }}
            transition={rm ? undefined : { duration: 1.8, delay: 1.5, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* The main growing arc — updated by scroll event subscription */}
          <motion.path
            ref={arcRef}
            d={arcPath(R_MIN)}
            fill="none"
            stroke="#2a2a28"
            strokeWidth={strokeWidth(R_MIN).toFixed(2)}
            strokeLinecap="round"
            initial={rm ? undefined : { opacity: 0 }}
            animate={rm ? undefined : { opacity: 1 }}
            transition={rm ? undefined : { duration: 1.0, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Small accent dot at the arc's start point — moves with arc */}
          <motion.circle
            cx={CX - R_MIN} cy={CY} r="5"
            fill="#0e3b2e"
            initial={rm ? undefined : { opacity: 0, scale: 0 }}
            animate={rm ? undefined : { opacity: 1, scale: 1 }}
            transition={rm ? undefined : { duration: 0.4, delay: 1.0, ease: EASE }}
          />
        </svg>
      </div>

      {/* Text — fixed, does not participate in scroll parallax */}
      <div className="max-grid relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 pt-28 pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-[500px] space-y-9"
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

          {/* Scroll nudge */}
          <motion.div
            variants={fadeUp(8)}
            className="flex items-center gap-3 pt-1"
          >
            <motion.div
              className="w-1 h-1 rounded-full"
              style={{ background: "#0e3b2e" }}
              animate={rm ? undefined : { scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
            <p
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(42,42,40,0.38)" }}
            >
              scroll to expand
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(42,42,40,0.18)" }} />
    </section>
  );
}
