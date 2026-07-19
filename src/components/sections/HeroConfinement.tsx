/**
 * Concept A — Confinement
 * The hero is a working tokamak. ~2,000 particles stream along nested
 * D-shaped flux surfaces (Shafranov-shifted, elongated) on a canvas with
 * additive blending and motion trails — a glowing confined plasma, not a
 * diagram of one. The entrance is a shot start: the core ignites first and
 * density ramps outward. The cursor behaves like a probe, deflecting the
 * stream locally. A live shot-clock readout runs in the corner.
 */
import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const BG = "#0a0a09";

type Particle = {
  f: number; // flux-surface radius fraction, 0 = core
  th: number; // poloidal angle
  w: number; // angular velocity
  gy: number; // gyro phase
  size: number;
};

// Flux-surface position: R = cx + shift(f) + a·cos(θ + δ(f)·sinθ), Z = cy − κ(f)·a·sinθ
function surfacePos(
  cx: number,
  cy: number,
  aMax: number,
  f: number,
  th: number,
): [number, number] {
  const a = f * aMax;
  const shift = 0.13 * aMax * (1 - f * f);
  const delta = 0.06 + 0.42 * f;
  const kappa = 1.35 + 0.32 * f;
  return [
    cx + shift + a * Math.cos(th + delta * Math.sin(th)),
    cy - kappa * a * Math.sin(th),
  ];
}

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

export function HeroConfinement() {
  const rm = !!useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, cx = 0, cy = 0, aMax = 0;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    const t0 = last;
    const mouse = { x: -9999, y: -9999 };

    const N = 2000;
    // Core-weighted radial distribution — density falls toward the edge
    const particles: Particle[] = Array.from({ length: N }, () => {
      const f = 0.06 + 0.94 * Math.pow(Math.random(), 0.62);
      return {
        f,
        th: Math.random() * Math.PI * 2,
        w: (0.22 + 0.55 * (1 - f)) * (0.75 + Math.random() * 0.5),
        gy: Math.random() * Math.PI * 2,
        size: 0.8 + Math.random() * 1.1,
      };
    }).sort((a, b) => a.f - b.f); // core first, so ignition ramps outward

    const resize = () => {
      W = section.clientWidth;
      H = section.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const desktop = W > 1024;
      cx = desktop ? W * 0.68 : W * 0.5;
      cy = H * 0.52;
      aMax = Math.min(W * (desktop ? 0.24 : 0.42), H * 0.36);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) last = performance.now();
    });
    io.observe(section);

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    // Palette: white-hot core → desaturated green mid → deep green edge
    const color = (f: number, alpha: number) => {
      if (f < 0.3) return `rgba(236,226,211,${alpha})`;
      if (f < 0.62) return `rgba(148,178,161,${alpha * 0.85})`;
      return `rgba(72,116,98,${alpha * 0.7})`;
    };

    const drawSeparatrix = () => {
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const th = (i / 90) * Math.PI * 2;
        const [x, y] = surfacePos(cx, cy, aMax, 1, th);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(138,16,30,0.34)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const elapsed = (now - t0) / 1000;

      // Shot clock readout
      if (clockRef.current)
        clockRef.current.textContent = `t + ${elapsed.toFixed(1)} s`;

      // Trails: fade the previous frame instead of clearing it
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(10,10,9,0.16)";
      ctx.fillRect(0, 0, W, H);

      // Core glow — the plasma's own light
      const ramp0 = Math.min(elapsed / 2.2, 1);
      const glow = ctx.createRadialGradient(
        cx + 0.13 * aMax, cy, 0,
        cx + 0.13 * aMax, cy, aMax * 0.85,
      );
      glow.addColorStop(0, `rgba(226,214,196,${0.085 * ramp0})`);
      glow.addColorStop(0.4, `rgba(64,102,88,${0.05 * ramp0})`);
      glow.addColorStop(1, "rgba(10,10,9,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      drawSeparatrix();

      // Density ramp — the shot start
      const ramp = Math.min(elapsed / 2.2, 1);
      const active = Math.floor(N * ramp * ramp);

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < active; i++) {
        const p = particles[i];
        p.th += p.w * dt;
        p.gy += 5 * dt;
        const f = p.f + 0.01 * Math.sin(p.gy);
        let [x, y] = surfacePos(cx, cy, aMax, f, p.th);

        // Probe deflection around the cursor
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          const d = Math.sqrt(d2) || 1;
          const push = 30 * Math.exp(-d2 / 9000);
          x += (dx / d) * push;
          y += (dy / d) * push;
        }

        ctx.fillStyle = color(p.f, 0.55);
        ctx.fillRect(x, y, p.size, p.size);
      }
      ctx.globalCompositeOperation = "source-over";
    };

    if (rm) {
      // Static long-exposure render: full orbits as faint strokes, no loop
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);
      drawSeparatrix();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < N; i += 2) {
        const p = particles[i];
        ctx.fillStyle = color(p.f, 0.3);
        for (let k = 0; k < 24; k++) {
          const [x, y] = surfacePos(cx, cy, aMax, p.f, (k / 24) * Math.PI * 2);
          ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.globalCompositeOperation = "source-over";
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
      className="relative min-h-[100vh] flex flex-col overflow-hidden cursor-default"
      style={{ background: BG }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      {/* Legibility scrim over the type column */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,9,0.94) 0%, rgba(10,10,9,0.72) 34%, rgba(10,10,9,0.18) 58%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      <div className="max-grid w-full relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 pt-28 pb-24">
        <motion.p
          className="text-[10px] uppercase tracking-[0.34em] mb-9"
          style={{ fontFamily: "var(--font-mono)", color: "var(--accent-tertiary)" }}
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          data &amp; ml
        </motion.p>

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
          <MaskLine delay={0.65} rm={rm}>pursuing models</MaskLine>
          <MaskLine delay={0.78} rm={rm}>that solve</MaskLine>
          <MaskLine delay={0.91} rm={rm}>impossible problems.</MaskLine>
        </h1>

        <motion.p
          className="mt-9 text-[15px] leading-[1.78] max-w-[380px]"
          style={{ color: "var(--color-muted)" }}
          initial={rm ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
        >
          Machine learning and data science for complex systems; pragmatic
          methods, ambitious abstractions.
        </motion.p>

        <motion.div
          className="mt-11 flex items-center gap-9"
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.55, ease: EASE }}
        >
          {[
            { href: "mailto:HeroTwin1@gmail.com", label: "email ↗" },
            { href: "#", label: "cv ↗" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative text-[11px] uppercase tracking-[0.24em] text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {l.label}
              <span className="absolute left-0 -bottom-1 h-px w-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 bg-[var(--accent-tertiary)]" />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Diagnostics strip */}
      <motion.div
        className="relative z-10 flex items-center justify-between px-6 sm:px-10 md:px-12 lg:px-16 pb-7 text-[9px] uppercase tracking-[0.24em]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
        initial={rm ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.1, ease: EASE }}
      >
        <span>
          confinement — nested flux surfaces · n = 2×10³
        </span>
        <span ref={clockRef} style={{ color: "var(--accent-tertiary)" }}>
          t + 0.0 s
        </span>
      </motion.div>
    </section>
  );
}
