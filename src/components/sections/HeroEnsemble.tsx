/**
 * Concept C — Ensemble
 * Forecasting made visual, literally: one bright observed series enters
 * from the left, hits a hairline marked "now", and splits into 140 sampled
 * futures fanning into uncertainty. Hovering inside the fan conditions the
 * ensemble — paths pinch through the cursor like an observation and
 * re-diverge beyond it. The widening cone is the subject: certainty decays
 * with horizon.
 */
import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const PATHS = 140;
const PTS = 120;

// Deterministic PRNG so the fan is identical on every visit
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cumulative gaussian walks, in normalized units
const WALKS: Float32Array[] = (() => {
  const rand = mulberry32(20260719);
  const gauss = () => {
    const u = Math.max(rand(), 1e-9);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };
  return Array.from({ length: PATHS }, () => {
    const w = new Float32Array(PTS);
    let c = 0;
    const drift = gauss() * 0.15;
    for (let j = 1; j < PTS; j++) {
      c += gauss() + drift;
      w[j] = c;
    }
    return w;
  });
})();

// Observed history: one walk, damped so it reads as a stable series
const HISTORY: Float32Array = (() => {
  const rand = mulberry32(1959);
  const w = new Float32Array(40);
  let c = 0;
  for (let j = 1; j < 40; j++) {
    c = c * 0.92 + (rand() - 0.5) * 2.2;
    w[j] = c;
  }
  return w;
})();

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

export function HeroEnsemble() {
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
    let ox = 0, oy = 0, spanX = 0, amp = 0, histX = 0;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    // Smoothed cursor state; strength eases in/out so the pinch feels physical
    const cur = { x: 0, y: 0, tx: 0, ty: 0, s: 0, ts: 0 };

    const resize = () => {
      W = section.clientWidth;
      H = section.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      histX = W * 0.0;
      ox = W * 0.16; // "now"
      oy = H * 0.68; // below the type block
      spanX = W * 0.84;
      amp = H * 0.014;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(section);

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      cur.tx = e.clientX - r.left;
      cur.ty = e.clientY - r.top;
      cur.ts = cur.tx > ox ? 1 : 0;
    };
    const onLeave = () => (cur.ts = 0);
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, W, H);

      // Observed history — the one certain line
      ctx.beginPath();
      for (let j = 0; j < HISTORY.length; j++) {
        const x = histX + (j / (HISTORY.length - 1)) * (ox - histX);
        const y = oy + HISTORY[j] * amp * 0.9;
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(230,226,218,0.9)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // The "now" boundary
      ctx.beginPath();
      ctx.moveTo(ox, H * 0.3);
      ctx.lineTo(ox, H * 0.94);
      ctx.strokeStyle = "rgba(216,207,196,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ensemble futures
      const lastJ = Math.max(2, Math.floor(PTS * progress));
      const sigX = W * 0.055;
      for (let i = 0; i < PATHS; i++) {
        const w = WALKS[i];
        ctx.beginPath();
        for (let j = 0; j < lastJ; j++) {
          const x = ox + (j / (PTS - 1)) * spanX;
          let y = oy + w[j] * amp;
          if (cur.s > 0.004) {
            // Conditioning: pull each path toward the cursor with a
            // gaussian window in x — an observation pinches the posterior
            const g = Math.exp(-((x - cur.x) ** 2) / (2 * sigX * sigX));
            y += (cur.y - y) * g * 0.88 * cur.s;
          }
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const green = i % 4 === 0;
        ctx.strokeStyle = green
          ? "rgba(96,142,122,0.16)"
          : "rgba(216,207,196,0.07)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Ensemble mean — bright, drawn last
      ctx.beginPath();
      for (let j = 0; j < lastJ; j++) {
        const x = ox + (j / (PTS - 1)) * spanX;
        let sum = 0;
        for (let i = 0; i < PATHS; i++) sum += WALKS[i][j];
        let y = oy + (sum / PATHS) * amp;
        if (cur.s > 0.004) {
          const g = Math.exp(-((x - cur.x) ** 2) / (2 * sigX * sigX));
          y += (cur.y - y) * g * 0.88 * cur.s;
        }
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(216,207,196,0.85)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = (now - t0) / 1000;
      const progress = rm ? 1 : Math.min(1, Math.max(0, (t - 0.5) / 2.2));
      // Ease the cursor state
      cur.x += (cur.tx - cur.x) * 0.09;
      cur.y += (cur.ty - cur.y) * 0.09;
      cur.s += (cur.ts - cur.s) * 0.07;
      draw(1 - Math.pow(1 - progress, 3));
    };

    if (rm) {
      draw(1);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, [rm]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] flex flex-col overflow-hidden cursor-crosshair bg-[var(--color-bg)]"
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      {/* Axis labels — pinned to the geometry they describe */}
      <div
        className="absolute bottom-6 inset-x-0 text-[9px] uppercase tracking-[0.24em] pointer-events-none"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
        aria-hidden="true"
      >
        <span className="absolute bottom-0 left-6 sm:left-10">observed</span>
        <span
          className="absolute bottom-0 -translate-x-1/2"
          style={{ left: "16%", color: "var(--accent-tertiary)" }}
        >
          t₀ — now
        </span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden sm:inline">
          ensemble · n = 140
        </span>
        <span className="absolute bottom-0 right-6 sm:right-10">horizon →</span>
      </div>

      <div className="max-grid w-full relative z-10 px-6 sm:px-10 md:px-12 lg:px-16 pt-32 pointer-events-none">
        <motion.p
          className="text-[10px] uppercase tracking-[0.34em] mb-9"
          style={{ fontFamily: "var(--font-mono)", color: "var(--accent-tertiary)" }}
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          data &amp; ml
        </motion.p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.9rem, 6.4vw, 5.9rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: "var(--color-text)",
            fontWeight: 500,
          }}
        >
          <MaskLine delay={0.35} rm={rm}>pursuing models</MaskLine>
          <MaskLine delay={0.48} rm={rm}>that solve</MaskLine>
          <MaskLine delay={0.61} rm={rm}>impossible problems.</MaskLine>
        </h1>

        <div className="mt-9 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <motion.p
            className="text-[15px] leading-[1.78] max-w-[380px]"
            style={{ color: "var(--color-muted)" }}
            initial={rm ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
          >
            Machine learning and data science for complex systems; pragmatic
            methods, ambitious abstractions.
          </motion.p>

          <motion.div
            className="flex items-center gap-9 pointer-events-auto"
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
          >
            {[
              { href: "mailto:HeroTwin1@gmail.com", label: "email ↗" },
              { href: "#", label: "cv ↗" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="group relative text-[11px] uppercase tracking-[0.24em] text-[var(--color-text)] whitespace-nowrap"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {l.label}
                <span className="absolute left-0 -bottom-1 h-px w-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 bg-[var(--accent-tertiary)]" />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
