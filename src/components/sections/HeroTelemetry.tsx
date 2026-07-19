/**
 * Concept B — Telemetry
 * The hero's horizon is a lap of synthesized F1 telemetry: a speed trace
 * generated with a real braking/acceleration model (backward braking pass,
 * forward traction pass over ten corners), drawn full-bleed across the
 * bottom of the viewport. On entrance a playhead sweeps the lap once as the
 * trace draws; afterwards the cursor scrubs it like a race engineer —
 * speed, gear, and sector read out live. Braking zones stroke oxblood.
 */
import React, { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const VMAX = 330;
const N = 600;
const VW = 1440; // svg viewBox width
const VH = 300;

// Corner apexes along the lap [position 0..1, apex speed km/h].
// Spacing leaves two genuine straights so the trace plateaus at VMAX.
const CORNERS: [number, number][] = [
  [0.10, 110], [0.18, 70], [0.30, 185], [0.40, 95],
  [0.55, 240], [0.66, 130], [0.72, 80], [0.90, 210],
];

function buildLap() {
  const v: number[] = new Array(N).fill(VMAX);
  for (const [p, apex] of CORNERS) v[Math.round(p * (N - 1))] = apex;
  // Backward pass: braking limit (steep), then forward pass: traction limit
  for (let i = N - 2; i >= 0; i--) v[i] = Math.min(v[i], v[i + 1] + 6.0);
  for (let i = 1; i < N; i++) v[i] = Math.min(v[i], v[i - 1] + 2.8);
  // Round the apex vees slightly; braking/traction slopes survive
  for (let pass = 0; pass < 2; pass++)
    for (let i = 1; i < N - 1; i++)
      v[i] = (v[i - 1] + 2 * v[i] + v[i + 1]) / 4;
  return v;
}

const SPEEDS = buildLap();
const XS = SPEEDS.map((_, i) => (i / (N - 1)) * VW);
const YS = SPEEDS.map((s) => VH - 12 - (s / VMAX) * (VH - 46));

const TRACE_D = SPEEDS.map((_, i) =>
  `${i === 0 ? "M" : "L"}${XS[i].toFixed(1)},${YS[i].toFixed(1)}`,
).join(" ");
const FILL_D = `${TRACE_D} L${VW},${VH} L0,${VH} Z`;

// Contiguous braking segments (decelerating harder than lift-and-coast)
const BRAKE_SEGS: string[] = (() => {
  const segs: string[] = [];
  let cur: string[] = [];
  for (let i = 1; i < N; i++) {
    if (SPEEDS[i] < SPEEDS[i - 1] - 1.6) {
      if (cur.length === 0) cur.push(`M${XS[i - 1].toFixed(1)},${YS[i - 1].toFixed(1)}`);
      cur.push(`L${XS[i].toFixed(1)},${YS[i].toFixed(1)}`);
    } else if (cur.length) {
      segs.push(cur.join(" "));
      cur = [];
    }
  }
  if (cur.length) segs.push(cur.join(" "));
  return segs;
})();

const gearFor = (s: number) =>
  s < 80 ? 2 : s < 120 ? 3 : s < 160 ? 4 : s < 205 ? 5 : s < 255 ? 6 : s < 305 ? 7 : 8;

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

export function HeroTelemetry() {
  const rm = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let mouseEnabled = false;

    const setHead = (frac: number) => {
      const idx = Math.max(0, Math.min(N - 1, Math.round(frac * (N - 1))));
      const head = headRef.current;
      if (head)
        head.setAttribute("transform", `translate(${XS[idx]},0)`);
      const dot = head?.querySelector("circle");
      if (dot) dot.setAttribute("cy", `${YS[idx]}`);
      const s = Math.round(SPEEDS[idx]);
      if (readoutRef.current)
        readoutRef.current.textContent = `${String(s).padStart(3, " ")} km/h · gear ${gearFor(s)} · s${Math.min(3, Math.floor(frac * 3) + 1)}`;
    };

    setHead(rm ? 0.62 : 0);

    // Entrance: one flying lap of the playhead while the trace draws,
    // then the cursor takes over as scrub control.
    const ctrl = rm
      ? null
      : animate(0, 1, {
          duration: 2.6,
          ease: [0.45, 0.05, 0.55, 0.95],
          delay: 0.5,
          onUpdate: setHead,
          onComplete: () => (mouseEnabled = true),
        });
    if (rm) mouseEnabled = true;

    const onMove = (e: MouseEvent) => {
      if (!mouseEnabled) return;
      const r = section.getBoundingClientRect();
      setHead((e.clientX - r.left) / r.width);
    };
    section.addEventListener("mousemove", onMove);
    return () => {
      ctrl?.stop();
      section.removeEventListener("mousemove", onMove);
    };
  }, [rm]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] flex flex-col overflow-hidden cursor-crosshair bg-[var(--color-bg)]"
    >
      {/* Type zone */}
      <div className="max-grid w-full relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-16 pt-28 pb-10">
        <div className="flex items-baseline justify-between mb-9">
          <motion.span
            className="text-[10px] uppercase tracking-[0.34em]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--accent-tertiary)" }}
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            data &amp; ml
          </motion.span>
          <motion.span
            className="hidden sm:block text-[10px] uppercase tracking-[0.24em]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            telemetry — flying lap
          </motion.span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.9rem, 6.6vw, 6.1rem)",
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

        <div className="mt-9 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
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
            className="flex items-center gap-9"
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

      {/* Telemetry strip — full bleed */}
      <div className="relative w-full h-[38vh] min-h-[250px]">
        {/* Speed gridlines */}
        {[100, 200, 300].map((s) => (
          <div
            key={s}
            className="absolute left-0 right-0 flex items-center gap-2 pointer-events-none"
            style={{ top: `${((VH - 12 - (s / VMAX) * (VH - 46)) / VH) * 100}%` }}
            aria-hidden="true"
          >
            <span className="flex-1 h-px" style={{ background: "rgba(216,207,196,0.05)" }} />
            <span
              className="text-[8px] tracking-[0.14em] pr-2"
              style={{ fontFamily: "var(--font-mono)", color: "rgba(156,153,143,0.4)" }}
            >
              {s}
            </span>
          </div>
        ))}
        {/* Sector boundaries */}
        {[1 / 3, 2 / 3].map((f, i) => (
          <span
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${f * 100}%`, background: "rgba(216,207,196,0.08)" }}
            aria-hidden="true"
          />
        ))}
        {["s1", "s2", "s3"].map((s, i) => (
          <motion.span
            key={s}
            className="absolute top-3 text-[9px] uppercase tracking-[0.3em]"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-muted)",
              left: `${i * 33.33 + 1.5}%`,
            }}
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 + i * 0.55, ease: EASE }}
          >
            {s}
          </motion.span>
        ))}

        {/* Live readout */}
        <motion.span
          ref={readoutRef}
          className="absolute top-3 right-6 sm:right-10 text-[10px] tracking-[0.18em]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--accent-tertiary)" }}
          initial={rm ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        >
          {"  "}0 km/h · gear 2 · s1
        </motion.span>

        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          {/* Ground fill under the trace */}
          <motion.path
            d={FILL_D}
            fill="rgba(14,59,46,0.16)"
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.6, ease: EASE }}
          />
          {/* Speed trace */}
          <motion.path
            d={TRACE_D}
            fill="none"
            stroke="var(--accent-tertiary)"
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
            initial={rm ? undefined : { pathLength: 0 }}
            animate={rm ? undefined : { pathLength: 1 }}
            transition={rm ? undefined : { duration: 2.6, delay: 0.5, ease: [0.45, 0.05, 0.55, 0.95] }}
          />
          {/* Braking zones */}
          {BRAKE_SEGS.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="var(--accent-secondary)"
              strokeWidth={2.2}
              vectorEffect="non-scaling-stroke"
              initial={rm ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + 2.6 * (i + 1) / (BRAKE_SEGS.length + 1), ease: EASE }}
            />
          ))}
          {/* Playhead */}
          <g ref={headRef}>
            <line
              y1={0}
              y2={VH}
              stroke="rgba(216,207,196,0.35)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              r={3.2}
              cy={YS[0]}
              fill="var(--color-text)"
            />
          </g>
        </svg>

        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "rgba(216,207,196,0.12)" }} />
      </div>
    </section>
  );
}
