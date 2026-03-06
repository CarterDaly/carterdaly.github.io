/**
 * Concept E — Sparse Grid + Cursor Spotlight
 * Engineering graph-paper grid draws in sequentially.
 * A cursor-following radial spotlight subtly illuminates the grid from behind,
 * making the structure feel alive without being noisy.
 * Three domain cells breathe gently; the nearest cell to the cursor brightens.
 * Text anchored to the bottom-left — negative space does the heavy lifting.
 */
import React, { useCallback, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const W = 1440, H = 640;
const COL = 180, ROW = 128;

const V_LINES = Array.from({ length: 7 }, (_, i) => (i + 1) * COL);
const H_LINES = Array.from({ length: 4 }, (_, i) => (i + 1) * ROW);

const CELLS = [
  { x: 2 * COL, y: 1 * ROW, label: "FUSION",       stroke: "#0e3b2e", fill: "rgba(14,59,46,0.08)"   },
  { x: 4 * COL, y: 2 * ROW, label: "F1",            stroke: "#8a101e", fill: "rgba(138,16,30,0.07)"  },
  { x: 6 * COL, y: 3 * ROW, label: "FORECASTING",   stroke: "#0e3b2e", fill: "rgba(14,59,46,0.08)"   },
];

const DIAG = {
  x1: CELLS[0].x + COL / 2, y1: CELLS[0].y + ROW / 2,
  x2: CELLS[2].x + COL / 2, y2: CELLS[2].y + ROW / 2,
};

const SP = { stiffness: 55, damping: 16 };
const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.95 } },
};
const fadeUp = (y = 20) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.78, ease: EASE } },
});

function cellCenter(cell: typeof CELLS[0]) {
  return { x: cell.x + COL / 2, y: cell.y + ROW / 2 };
}

export function HeroE() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [nearestCell, setNearestCell] = useState<number | null>(null);

  // Spotlight center in percentage
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const sX = useSpring(spotX, SP);
  const sY = useSpring(spotY, SP);

  // Grid parallax — the whole grid drifts slightly
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const gx = useSpring(useTransform(mx, [0, 1], [8, -8]), SP);
  const gy = useSpring(useTransform(my, [0, 1], [5, -5]), SP);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (rm || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mx.set(nx);
      my.set(ny);
      spotX.set(nx * 100);
      spotY.set(ny * 100);

      // Which cell is nearest to cursor (in SVG viewBox coordinates)
      const svgX = nx * W;
      const svgY = ny * H;
      let minDist = Infinity, minIdx = -1;
      CELLS.forEach((cell, i) => {
        const c = cellCenter(cell);
        const d = Math.hypot(svgX - c.x, svgY - c.y);
        if (d < minDist) { minDist = d; minIdx = i; }
      });
      setNearestCell(minDist < 200 ? minIdx : null);
    },
    [rm],
  );

  // Cursor spotlight gradient — follows mouse smoothly
  const spotGradient = useTransform(
    [sX, sY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(14,59,46,0.09) 0%, rgba(14,59,46,0.04) 18%, transparent 44%)`,
  );

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex flex-col overflow-hidden cursor-default"
      style={{ background: "#D8CFC4" }}
      id="top"
      onMouseMove={handleMouseMove}
    >
      {/* Grid + spotlight layer */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Cursor spotlight */}
        <motion.div
          className="absolute inset-0"
          style={{ background: spotGradient }}
        />

        {/* SVG grid with gentle parallax */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
        >
          <motion.g style={{ x: gx, y: gy }}>
            {/* Vertical lines — draw top to bottom */}
            {V_LINES.map((x, i) => (
              <motion.path
                key={`v-${i}`}
                d={`M ${x},0 L ${x},${H}`}
                fill="none"
                stroke="rgba(42,42,40,0.1)"
                strokeWidth="0.75"
                initial={rm ? undefined : { pathLength: 0, opacity: 0 }}
                animate={rm ? undefined : { pathLength: 1, opacity: 1 }}
                transition={rm ? undefined : {
                  pathLength: { duration: 1.1, delay: 0.18 + i * 0.055, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.22, delay: 0.18 + i * 0.055 },
                }}
              />
            ))}

            {/* Horizontal lines — draw left to right */}
            {H_LINES.map((y, i) => (
              <motion.path
                key={`h-${i}`}
                d={`M 0,${y} L ${W},${y}`}
                fill="none"
                stroke="rgba(42,42,40,0.1)"
                strokeWidth="0.75"
                initial={rm ? undefined : { pathLength: 0, opacity: 0 }}
                animate={rm ? undefined : { pathLength: 1, opacity: 1 }}
                transition={rm ? undefined : {
                  pathLength: { duration: 1.5, delay: 0.46 + i * 0.08, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.22, delay: 0.46 + i * 0.08 },
                }}
              />
            ))}

            {/* Dot at every grid intersection — delay is deterministic to avoid SSR mismatch */}
            {V_LINES.flatMap((x, xi) =>
              H_LINES.map((y, yi) => (
                <motion.circle
                  key={`dot-${x}-${y}`}
                  cx={x} cy={y} r="1.2"
                  fill="rgba(42,42,40,0.2)"
                  initial={rm ? undefined : { opacity: 0, scale: 0 }}
                  animate={rm ? undefined : { opacity: 1, scale: 1 }}
                  transition={rm ? undefined : { duration: 0.32, delay: 0.9 + ((xi * 7 + yi * 13) % 10) * 0.038 }}
                />
              ))
            )}

            {/* Domain cells — breathe, and brighten when cursor is near */}
            {CELLS.map((cell, i) => {
              const active = nearestCell === i;
              return (
                <motion.rect
                  key={`cell-${i}`}
                  x={cell.x} y={cell.y} width={COL} height={ROW}
                  fill={active ? cell.fill.replace(/0\.\d+\)$/, "0.2)") : cell.fill}
                  stroke={cell.stroke}
                  strokeWidth={active ? 1.0 : 0.6}
                  opacity={active ? 1 : undefined}
                  animate={rm ? undefined : {
                    opacity: active ? [1] : [1, 0.65, 1],
                    strokeWidth: active ? 1.0 : 0.6,
                  }}
                  transition={rm ? undefined : {
                    opacity: { duration: 3.2 + i * 0.8, repeat: active ? 0 : Infinity, ease: "easeInOut", delay: i * 0.6 },
                    strokeWidth: { duration: 0.2 },
                  }}
                  initial={rm ? undefined : { opacity: 0 }}
                />
              );
            })}

            {/* Cell labels */}
            {CELLS.map((cell, i) => (
              <motion.text
                key={`lbl-${i}`}
                x={cell.x + 8} y={cell.y + 16}
                fill={cell.stroke}
                opacity={0.7}
                fontSize="7.5"
                fontFamily="var(--font-mono)"
                letterSpacing="3"
                initial={rm ? undefined : { opacity: 0 }}
                animate={rm ? undefined : { opacity: 0.7 }}
                transition={rm ? undefined : { duration: 0.45, delay: 1.1 + i * 0.14 }}
              >
                {cell.label}
              </motion.text>
            ))}

            {/* Trajectory line — FUSION to FORECASTING */}
            <motion.path
              d={`M ${DIAG.x1},${DIAG.y1} L ${DIAG.x2},${DIAG.y2}`}
              fill="none"
              stroke="rgba(14,59,46,0.25)"
              strokeWidth="0.65"
              strokeDasharray="4 8"
              initial={rm ? undefined : { pathLength: 0, opacity: 0 }}
              animate={rm ? undefined : { pathLength: 1, opacity: 1 }}
              transition={rm ? undefined : {
                pathLength: { duration: 1.1, delay: 1.45, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.25, delay: 1.45 },
              }}
            />
          </motion.g>
        </svg>
      </div>

      {/* Text — bottom-left, enters after grid */}
      <div className="max-grid relative z-10 flex flex-col justify-end flex-1 px-6 sm:px-10 md:px-12 lg:px-16 pb-12 pt-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-[520px] space-y-7"
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
              fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)",
              color: "#0b0c0d",
              lineHeight: 1.02,
              letterSpacing: "-0.022em",
            }}
          >
            pursuing models
            <br />
            that solve
            <br />
            impossible problems.
          </motion.h1>

          <motion.p
            variants={fadeUp(12)}
            className="text-[15px] leading-[1.78] max-w-[390px]"
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
