/**
 * Concept B — Orbital Tilt
 * Enhanced orbital diagram with a secondary polar-orbit ellipse and richer detail.
 * Mouse position drives rotateX / rotateY on the graphic container via spring physics,
 * producing a subtle 3D perspective tilt — like examining an instrument panel.
 * Inner elements (spokes, nodes) also drift at a deeper parallax than the ellipses.
 */
import React, { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";

const CX = 300, CY = 255;
const RX = 228, RY = 114;           // primary equatorial orbit
const RX2 = 150, RY2 = 44;          // secondary polar orbit (tilted)

// 12 tick marks on primary ellipse
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  return {
    x: CX + RX * Math.cos(a),
    y: CY + RY * Math.sin(a),
    nx: Math.cos(a),
    ny: Math.sin(a),
    major: i % 3 === 0,
  };
});

// Degree labels at 0°, 90°, 180°, 270°
const LABELS = [
  { a: 0,           label: "0°" },
  { a: Math.PI / 2, label: "90°" },
  { a: Math.PI,     label: "180°" },
  { a: 3*Math.PI/2, label: "270°" },
].map(({ a, label }) => ({
  label,
  x: CX + (RX + 22) * Math.cos(a),
  y: CY + (RY + 22) * Math.sin(a),
}));

const SP = { stiffness: 52, damping: 16 };
const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const fadeUp = (y = 20) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.78, ease: EASE } },
});

export function HeroB() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // 3D perspective tilt for the orbital container
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), SP);
  const rotY = useSpring(useTransform(mx, [0, 1], [-10, 10]), SP);

  // Deeper layer for node elements (spokes + nodes drift more)
  const nodeX = useSpring(useTransform(mx, [0, 1], [18, -18]), SP);
  const nodeY = useSpring(useTransform(my, [0, 1], [10, -10]), SP);

  // Refs for direct SVG DOM mutation
  const n1Ref = useRef<SVGCircleElement>(null);
  const n1GlowRef = useRef<SVGCircleElement>(null);
  const n2Ref = useRef<SVGCircleElement>(null);
  const n3Ref = useRef<SVGCircleElement>(null);
  const l1Ref = useRef<SVGLineElement>(null);
  const l2Ref = useRef<SVGLineElement>(null);
  const l3Ref = useRef<SVGLineElement>(null);
  const coordRef = useRef<SVGTextElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (rm || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    },
    [rm],
  );

  useAnimationFrame((t) => {
    if (rm) return;

    // Primary orbit nodes
    const a1 = t * 0.00042;
    const a2 = -(t * 0.00016) + Math.PI * 0.72;
    const x1 = CX + RX * Math.cos(a1);
    const y1 = CY + RY * Math.sin(a1);
    const x2 = CX + RX * Math.cos(a2);
    const y2 = CY + RY * Math.sin(a2);

    // Secondary polar orbit node
    const a3 = t * 0.00028 + 0.4;
    // Rotate the secondary ellipse 45° by transforming the point
    const px3 = RX2 * Math.cos(a3);
    const py3 = RY2 * Math.sin(a3);
    const cos45 = Math.cos(Math.PI / 4), sin45 = Math.sin(Math.PI / 4);
    const x3 = CX + px3 * cos45 - py3 * sin45;
    const y3 = CY + px3 * sin45 + py3 * cos45;

    n1Ref.current?.setAttribute("cx", x1.toFixed(2));
    n1Ref.current?.setAttribute("cy", y1.toFixed(2));
    n1GlowRef.current?.setAttribute("cx", x1.toFixed(2));
    n1GlowRef.current?.setAttribute("cy", y1.toFixed(2));
    n2Ref.current?.setAttribute("cx", x2.toFixed(2));
    n2Ref.current?.setAttribute("cy", y2.toFixed(2));
    n3Ref.current?.setAttribute("cx", x3.toFixed(2));
    n3Ref.current?.setAttribute("cy", y3.toFixed(2));

    if (l1Ref.current) {
      l1Ref.current.setAttribute("x2", x1.toFixed(2));
      l1Ref.current.setAttribute("y2", y1.toFixed(2));
    }
    if (l2Ref.current) {
      l2Ref.current.setAttribute("x2", x2.toFixed(2));
      l2Ref.current.setAttribute("y2", y2.toFixed(2));
    }
    if (l3Ref.current) {
      l3Ref.current.setAttribute("x2", x3.toFixed(2));
      l3Ref.current.setAttribute("y2", y3.toFixed(2));
    }
    if (coordRef.current) {
      const nx = ((x1 - CX) / RX).toFixed(3);
      const ny = ((y1 - CY) / RY).toFixed(3);
      coordRef.current.textContent = `${nx}  ${ny}`;
    }
  });

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex flex-col overflow-hidden cursor-default"
      style={{ background: "#D8CFC4" }}
      id="top"
      onMouseMove={handleMouseMove}
    >
      <div className="max-grid relative z-10 flex-1 grid grid-cols-12 gap-x-8 items-center px-6 sm:px-10 md:px-12 lg:px-16 pt-24 pb-16">

        {/* Text column */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="col-span-12 lg:col-span-5 space-y-8"
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
              fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
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
            className="text-[15px] leading-[1.78] max-w-[370px]"
            style={{ color: "#4a4845" }}
          >
            Machine learning and data science for complex systems; pragmatic
            methods, ambitious abstractions.
          </motion.p>
        </motion.div>

        {/* Orbital graphic — 3D perspective tilt on mouse */}
        <motion.div
          className="hidden lg:flex col-span-7 items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{ perspective: "1400px" }}
        >
          <motion.div style={{ rotateX: rotX, rotateY: rotY }}>
            <svg
              viewBox="0 0 600 510"
              className="w-full max-w-[520px]"
              aria-hidden="true"
            >
              {/* Fine axis guides */}
              <line x1={CX} y1={40} x2={CX} y2={470} stroke="rgba(42,42,40,0.08)" strokeWidth="0.6" />
              <line x1={28} y1={CY} x2={572} y2={CY} stroke="rgba(42,42,40,0.08)" strokeWidth="0.6" />

              {/* Primary orbit */}
              <ellipse
                cx={CX} cy={CY} rx={RX} ry={RY}
                fill="none"
                stroke="rgba(42,42,40,0.28)"
                strokeWidth="0.9"
              />

              {/* Secondary polar orbit (rotated 45°) */}
              <ellipse
                cx={CX} cy={CY} rx={RX2} ry={RY2}
                fill="none"
                stroke="rgba(14,59,46,0.35)"
                strokeWidth="0.65"
                strokeDasharray="3 8"
                transform={`rotate(45 ${CX} ${CY})`}
              />

              {/* Inner reference circle */}
              <ellipse
                cx={CX} cy={CY} rx={RX * 0.45} ry={RY * 0.45}
                fill="none"
                stroke="rgba(42,42,40,0.1)"
                strokeWidth="0.55"
              />

              {/* Tick marks */}
              {TICKS.map((tk, i) => (
                <line
                  key={i}
                  x1={tk.x - tk.nx * (tk.major ? 9 : 5)}
                  y1={tk.y - tk.ny * (tk.major ? 9 : 5)}
                  x2={tk.x + tk.nx * (tk.major ? 9 : 5)}
                  y2={tk.y + tk.ny * (tk.major ? 9 : 5)}
                  stroke="rgba(42,42,40,0.28)"
                  strokeWidth={tk.major ? 1 : 0.7}
                />
              ))}

              {/* Degree labels */}
              {LABELS.map(({ label, x, y }) => (
                <text
                  key={label}
                  x={x} y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(42,42,40,0.22)"
                  fontSize="7"
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.5"
                >
                  {label}
                </text>
              ))}

              {/* Center point */}
              <circle cx={CX} cy={CY} r="3" fill="rgba(42,42,40,0.4)" />
              <circle cx={CX} cy={CY} r="6" fill="none" stroke="rgba(42,42,40,0.14)" strokeWidth="0.6" />

              {/* Spokes — updated by useAnimationFrame */}
              <line ref={l1Ref} x1={CX} y1={CY} x2={CX + RX} y2={CY}
                stroke="rgba(14,59,46,0.45)" strokeWidth="0.55" />
              <line ref={l2Ref} x1={CX} y1={CY} x2={CX - RX} y2={CY}
                stroke="rgba(138,16,30,0.38)" strokeWidth="0.55" />
              <line ref={l3Ref} x1={CX} y1={CY} x2={CX} y2={CY}
                stroke="rgba(42,42,40,0.22)" strokeWidth="0.5" strokeDasharray="2 4" />

              {/* Node 1 — fast, midnight green */}
              <circle ref={n1GlowRef} cx={CX + RX} cy={CY} r="10" fill="none" stroke="rgba(14,59,46,0.25)" strokeWidth="0.8" />
              <circle ref={n1Ref} cx={CX + RX} cy={CY} r="6" fill="#0e3b2e" />

              {/* Node 2 — slow, oxblood */}
              <circle ref={n2Ref} cx={CX - RX} cy={CY} r="4.5" fill="#8a101e" />

              {/* Node 3 — secondary orbit */}
              <circle ref={n3Ref} cx={CX} cy={CY} r="3.5" fill="rgba(42,42,40,0.6)" />

              {/* Coordinate readout */}
              <text x="390" y="470" fill="rgba(42,42,40,0.28)" fontSize="8"
                fontFamily="var(--font-mono)" letterSpacing="1">ω:</text>
              <text ref={coordRef} x="410" y="470" fill="rgba(14,59,46,0.75)" fontSize="8"
                fontFamily="var(--font-mono)" letterSpacing="1">0.000  0.000</text>

              {/* Label */}
              <text x={CX - 26} y={CY - RY - 18} fill="rgba(42,42,40,0.18)" fontSize="7.5"
                fontFamily="var(--font-mono)" letterSpacing="4">ORBITAL</text>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(42,42,40,0.18)" }} />
    </section>
  );
}
