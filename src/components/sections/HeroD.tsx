/**
 * Concept D — Magnetic Type
 * Each letter of the H1 is an individually tracked DOM span.
 * A single requestAnimationFrame loop computes cursor proximity for every letter
 * and applies a quadratic-falloff repel force, lerp-smoothed — zero React re-renders.
 * Background: concentric ripple rings in a motion.div that follows the cursor.
 */
import React, { useEffect, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const MAX_DIST = 95;
const FORCE = 18;
const LERP = 0.1;

// Fixed H1 structure — lines and words
const H1_LINES = [
  ["pursuing", " ", "models"],
  ["that", " ", "solve"],
  ["impossible", " ", "problems."],
];

export function HeroD() {
  const rm = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Per-letter DOM refs and smoothed offsets
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const offsetX = useRef<number[]>([]);
  const offsetY = useRef<number[]>([]);

  // Raw cursor position (client coords, updated on mousemove)
  const cursorX = useRef(0);
  const cursorY = useRef(0);

  // Normalized cursor for ring + parallax (motion values → spring)
  const ringXBase = useMotionValue(50);
  const ringYBase = useMotionValue(50);
  const ringX = useSpring(ringXBase, { stiffness: 38, damping: 13 });
  const ringY = useSpring(ringYBase, { stiffness: 38, damping: 13 });

  const pxBase = useMotionValue(0.5);
  const pyBase = useMotionValue(0.5);
  const px = useSpring(useTransform(pxBase, [0, 1], [-14, 14]), { stiffness: 50, damping: 16 });
  const py = useSpring(useTransform(pyBase, [0, 1], [-9, 9]), { stiffness: 50, damping: 16 });

  // Ring container positioning (centered on cursor)
  const ringLeft = useTransform(ringX, (v) => `${v}%`);
  const ringTop = useTransform(ringY, (v) => `${v}%`);

  // Attach mousemove to section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      pxBase.set(nx);
      pyBase.set(ny);
      ringXBase.set(nx * 100);
      ringYBase.set(ny * 100);
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, []);

  // Magnetic animation loop — direct DOM transforms, no setState
  useEffect(() => {
    if (rm) return;
    let raf: number;
    const tick = () => {
      const cx = cursorX.current;
      const cy = cursorY.current;
      for (let i = 0; i < letterRefs.current.length; i++) {
        const el = letterRefs.current[i];
        if (!el) continue;
        if (!offsetX.current[i]) offsetX.current[i] = 0;
        if (!offsetY.current[i]) offsetY.current[i] = 0;

        const rect = el.getBoundingClientRect();
        const elCX = rect.left + rect.width / 2;
        const elCY = rect.top + rect.height / 2;
        const dx = cx - elCX;
        const dy = cy - elCY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let tx = 0, ty = 0;
        if (dist < MAX_DIST && dist > 0.5) {
          const strength = (MAX_DIST - dist) / MAX_DIST;
          const force = strength * strength * FORCE;
          tx = (dx / dist) * force;
          ty = (dy / dist) * force;
        }
        offsetX.current[i] += (tx - offsetX.current[i]) * LERP;
        offsetY.current[i] += (ty - offsetY.current[i]) * LERP;
        el.style.transform = `translate(${offsetX.current[i].toFixed(2)}px,${offsetY.current[i].toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rm]);

  // Build H1 with per-letter span refs
  let idx = 0;
  const h1Content = H1_LINES.map((line, li) => (
    <span key={li} style={{ display: "block" }}>
      {line.map((word, wi) =>
        word.split("").map((char) => {
          const i = idx++;
          const isImpossible = li === 2 && wi === 0; // "impossible" is first word of line 2
          return (
            <span
              key={i}
              ref={(el) => { letterRefs.current[i] = el; }}
              style={{
                display: "inline-block",
                color: isImpossible ? "transparent" : "inherit",
                WebkitTextStroke: isImpossible ? "1.5px rgba(42,42,40,0.52)" : undefined,
              }}
            >
              {char === " " ? "\u00a0" : char}
            </span>
          );
        })
      )}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] flex flex-col overflow-hidden cursor-default"
      style={{ background: "#D8CFC4" }}
      id="top"
    >
      {/* Ripple rings — motion.div follows cursor, rings are centered inside it */}
      {!rm && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: ringLeft,
            top: ringTop,
            x: "-50%",
            y: "-50%",
            width: 760,
            height: 760,
          }}
          aria-hidden="true"
        >
          <svg
            width="760"
            height="760"
            viewBox="-380 -380 760 760"
            overflow="visible"
          >
            {[80, 160, 260, 380].map((r, i) => (
              <motion.circle
                key={r}
                cx={0}
                cy={0}
                r={r}
                fill="none"
                stroke="rgba(42,42,40,0.065)"
                strokeWidth="0.7"
                animate={{
                  scale: [0.88, 1.08, 0.88],
                  opacity: [0.065, 0.025, 0.065],
                }}
                transition={{
                  duration: 5.5 + i * 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.9,
                }}
              />
            ))}
          </svg>
        </motion.div>
      )}

      {/* Content */}
      <div className="max-grid relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 pt-28 pb-20 max-w-[620px]">
        {/* Eyebrow on slower parallax */}
        <motion.p
          className="text-[11px] uppercase tracking-[0.3em] font-medium mb-8"
          style={{ color: "#0e3b2e", x: rm ? 0 : px, y: rm ? 0 : py }}
          initial={rm ? undefined : { opacity: 0 }}
          animate={rm ? undefined : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          data & ml
        </motion.p>

        {/* H1 — magnetic letters */}
        <motion.h1
          className="mb-8"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem, 6.2vw, 5.4rem)",
            color: "#0b0c0d",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
          }}
          initial={rm ? undefined : { opacity: 0 }}
          animate={rm ? undefined : { opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.18 }}
        >
          {h1Content}
        </motion.h1>

        {/* Body text on slower parallax */}
        <motion.p
          className="text-[15px] leading-[1.78] max-w-[390px]"
          style={{ color: "#4a4845", x: rm ? 0 : px, y: rm ? 0 : py }}
          initial={rm ? undefined : { opacity: 0, y: 14 }}
          animate={rm ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.32, ease: EASE }}
        >
          Machine learning and data science for complex systems; pragmatic
          methods, ambitious abstractions.
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(42,42,40,0.18)" }} />
    </section>
  );
}
