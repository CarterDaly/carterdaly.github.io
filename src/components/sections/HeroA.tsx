/**
 * Concept A — Giselle
 * Inspired by Müller-Brockmann's 1959 Giselle poster: bold concentric quarter-circle arcs
 * emanating from the bottom-right corner create tension against the left-anchored type.
 * Three parallax layers (inner/mid/outer arcs) respond to mouse with spring physics,
 * producing a genuine sense of volumetric depth.
 */
import React, { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

// Arc system: concentric quarter-circles, center anchored at bottom-right of viewBox
const CX = 1440, CY = 720;

const ARCS = [
  { r: 160,  sw: 4.0,  op: 1.0,  grp: 0 },
  { r: 290,  sw: 2.8,  op: 0.92, grp: 0 },
  { r: 440,  sw: 2.0,  op: 0.82, grp: 0 },
  { r: 610,  sw: 1.4,  op: 0.70, grp: 1, accent: true },
  { r: 800,  sw: 1.05, op: 0.56, grp: 1 },
  { r: 1010, sw: 0.78, op: 0.42, grp: 1 },
  { r: 1240, sw: 0.58, op: 0.28, grp: 2 },
  { r: 1500, sw: 0.44, op: 0.16, grp: 2 },
  { r: 1780, sw: 0.36, op: 0.08, grp: 2 },
];

// Quarter-circle arc sweeping through the top-left quadrant of a circle at (CX, CY)
const arcPath = (r: number) =>
  `M ${CX - r},${CY} A ${r},${r} 0 0 1 ${CX},${CY - r}`;

const SP = { stiffness: 55, damping: 17 };
const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.18 } },
};
const fadeUp = (y = 22) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.82, ease: EASE } },
});

export function HeroA() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Normalized mouse position [0,1]
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // Three depth layers — inner arcs move most, outer arcs move least
  const g0x = useSpring(useTransform(mx, [0, 1], [52, -52]), SP);
  const g0y = useSpring(useTransform(my, [0, 1], [32, -32]), SP);
  const g1x = useSpring(useTransform(mx, [0, 1], [20, -20]), SP);
  const g1y = useSpring(useTransform(my, [0, 1], [12, -12]), SP);
  const g2x = useSpring(useTransform(mx, [0, 1], [ 6,  -6]), SP);
  const g2y = useSpring(useTransform(my, [0, 1], [ 4,  -4]), SP);

  const GX = [g0x, g1x, g2x];
  const GY = [g0y, g1y, g2y];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (rm || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
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
      {/* Arc composition */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 720"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          {([0, 1, 2] as const).map((grp) => (
            <motion.g key={grp} style={{ x: GX[grp], y: GY[grp] }}>
              {ARCS.map((arc, i) =>
                arc.grp === grp ? (
                  <motion.path
                    key={arc.r}
                    d={arcPath(arc.r)}
                    fill="none"
                    stroke={(arc as any).accent ? "#0e3b2e" : "#2a2a28"}
                    strokeWidth={arc.sw}
                    opacity={arc.op}
                    strokeLinecap="round"
                    initial={rm ? undefined : { pathLength: 0 }}
                    animate={rm ? undefined : { pathLength: 1 }}
                    transition={
                      rm
                        ? undefined
                        : {
                            pathLength: {
                              duration: 1.1 + i * 0.1,
                              delay: 0.04 + i * 0.1,
                              ease: [0.4, 0, 0.2, 1],
                            },
                          }
                    }
                  />
                ) : null,
              )}
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Subtle paper grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
          opacity: 0.45,
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />

      {/* Content — left column, vertically centered */}
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
              fontSize: "clamp(2.8rem, 6.4vw, 5.6rem)",
              color: "#0b0c0d",
              lineHeight: 1.0,
              letterSpacing: "-0.028em",
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
            className="text-[15px] leading-[1.78] max-w-[380px]"
            style={{ color: "#4a4845" }}
          >
            Machine learning and data science for complex systems; pragmatic
            methods, ambitious abstractions.
          </motion.p>
        </motion.div>
      </div>

      {/* Hairline rule at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(42,42,40,0.18)" }} />
    </section>
  );
}
