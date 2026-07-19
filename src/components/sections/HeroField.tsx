/**
 * Concept A — Field
 * After Karl Gerstner's "Designing Programmes": the composition is an
 * algorithm. ~1,900 points open as gaussian noise and glide into a strict
 * halftone lattice — order emerging from noise, which is the whole story of
 * modeling, told abstractly. Settled, each cell's size samples a smooth
 * scalar field that keeps evolving glacially; only the field's rare peaks
 * earn color. Ambient only — the site's own cursor layer stays in charge.
 */
import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
// Darkest step of the page's brightness ramp: hero #0b0b0b → output #0f0f0f
// → about #121212, all sharing the grain-panel surface. The canvas stays
// transparent so the grain reads through.
const BG = "#0b0b0b";

// ── Tuning knobs ────────────────────────────────────────────────────────
// Lattice
const CELL = 25; // pitch in px — smaller = denser field
const SCATTER = 0.28; // opening gaussian scatter spread, fraction of viewport
const SEED = 1959; // PRNG seed — a different seed is a different opening
// Settle choreography
const SETTLE_DELAY = 0.35; // s before the first cell starts gliding home
const SETTLE_SWEEP = 1.1; // s the left→right stagger spans
const SETTLE_JITTER = 0.5; // s of per-cell random delay on top of the sweep
const SETTLE_TIME = 1.6; // s each cell takes to settle (expo ease)
// The living field
const FIELD_ZOOM = 3.2; // spatial frequency — higher = smaller, busier hills
const FIELD_SPEED = 1.4; // evolution rate — higher = faster drift
// Cells
const SIZE_BASE = 1.0; // px at field minimum
const SIZE_GAIN = 6; // extra px at field maximum (quadratic response)
const ALPHA_BASE = 0.2; // neutral cell opacity floor
const ALPHA_GAIN = 0.5; // extra neutral opacity at field maximum
// Accent thresholds on the field value — higher = rarer islands
const T_OXBLOOD = 0.9;
const T_GREEN = 0.84;

// Deterministic PRNG — the same programme runs on every visit
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Smooth scalar field in [0,1] — three drifting plane waves, no noise
// texture. Low frequencies so the hills are broad and accents form islands.
function field(nx: number, ny: number, t: number) {
  const v =
    Math.sin(nx * 2.6 + t * 0.11) * Math.cos(ny * 2.1 - t * 0.07) +
    Math.sin((nx + ny) * 1.5 - t * 0.05) +
    Math.cos(nx * 1.1 - ny * 1.9 + t * 0.09);
  return v / 3 * 0.5 + 0.5;
}

const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

function MaskLine({
  children,
  delay,
  rm,
}: {
  children: React.ReactNode;
  delay: number;
  rm: boolean;
}) {
  return (
    <span className="block overflow-hidden py-[0.1em] -my-[0.1em]">
      <motion.span
        className="block"
        initial={rm ? false : { y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function HeroField() {
  const rm = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let raf = 0;
    let visible = true;
    let t0 = performance.now();

    type Cell = {
      tx: number; ty: number; // lattice target (normalized)
      sx: number; sy: number; // scattered start (normalized)
      delay: number; // settle stagger
    };
    let cells: Cell[] = [];

    const build = () => {
      W = section.clientWidth;
      H = section.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rand = mulberry32(SEED);
      const gauss = () => {
        const u = Math.max(rand(), 1e-9);
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
      };
      const cols = Math.ceil(W / CELL);
      const rows = Math.ceil(H / CELL);
      cells = [];
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const tx = (i * CELL + CELL / 2) / W;
          const ty = (j * CELL + CELL / 2) / H;
          cells.push({
            tx,
            ty,
            sx: 0.5 + gauss() * SCATTER,
            sy: 0.5 + gauss() * SCATTER,
            // Settle sweeps left→right with per-cell jitter
            delay: tx * SETTLE_SWEEP + rand() * SETTLE_JITTER,
          });
        }
      }
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(section);

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) t0 = performance.now();
      visible = e.isIntersecting;
    });
    io.observe(section);

    const draw = (t: number, settleT: number) => {
      // Transparent clear — the section's grain-panel surface shows through
      ctx.clearRect(0, 0, W, H);
      for (const c of cells) {
        const p = rm
          ? 1
          : easeOutExpo(Math.max(0, (settleT - c.delay) / SETTLE_TIME));
        if (p <= 0.001) continue;
        const x = (c.sx + (c.tx - c.sx) * p) * W;
        const y = (c.sy + (c.ty - c.sy) * p) * H;
        const f = field(c.tx * FIELD_ZOOM, c.ty * FIELD_ZOOM, t);
        // Size and tone sample the field; settled cells render crisply
        const s = (SIZE_BASE + f * f * SIZE_GAIN) * (0.35 + 0.65 * p);
        let fill: string;
        if (f > T_OXBLOOD) fill = `rgba(138,16,30,${0.8 * p})`;
        else if (f > T_GREEN) fill = `rgba(150,182,164,${0.6 * p})`;
        else fill = `rgba(216,207,196,${(ALPHA_BASE + f * ALPHA_GAIN) * p})`;
        ctx.fillStyle = fill;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = (now - t0) / 1000;
      draw(t * FIELD_SPEED, Math.max(0, t - SETTLE_DELAY));
    };

    if (rm) {
      draw(8, 99);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [rm]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="grain-panel relative min-h-[100vh] flex flex-col overflow-hidden cursor-default"
      style={
        {
          background: BG,
          // grain-panel's default soft-light blend goes invisible on a
          // near-black base; screen keeps the bright speckles carrying at
          // roughly the About section's subtlety.
          "--grain-opacity": 0.18,
          "--grain-blend": "screen",
          "--grain-filter": "brightness(0.7)",
        } as React.CSSProperties
      }
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      {/* Scrim so the type column reads over the lattice */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,11,11,0.93) 0%, rgba(11,11,11,0.7) 36%, rgba(11,11,11,0.15) 62%, transparent 78%)",
        }}
        aria-hidden="true"
      />

      <div className="max-grid w-full relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 pt-28 pb-24">
        <h1
          className="max-w-[13ch]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.9rem, 6.4vw, 5.9rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "var(--color-text)",
            fontWeight: 500,
          }}
        >
          <MaskLine delay={0.45} rm={rm}>pursuing models</MaskLine>
          <MaskLine delay={0.58} rm={rm}>that solve</MaskLine>
          <MaskLine delay={0.71} rm={rm}>impossible problems.</MaskLine>
        </h1>

        <motion.p
          className="mt-9 text-[15px] leading-[1.78] max-w-[380px]"
          style={{ color: "var(--color-muted)" }}
          initial={rm ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
        >
          Machine learning and data science for complex systems; pragmatic
          methods, ambitious abstractions.
        </motion.p>
      </div>
    </section>
  );
}
