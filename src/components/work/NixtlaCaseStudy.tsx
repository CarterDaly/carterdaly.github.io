/**
 * NixTLA Forecast Studio, project case study.
 *
 * Design language: a Swiss magazine feature that happens to carry technical
 * content, not a datasheet. Editorial grotesque (Neue Haas) is the dominant
 * voice, Satoshi is the reading body, and monospace appears ONLY as the
 * technical accent that the editorial type is juxtaposed against (the stack
 * credits and the model names). Structure is carried by hairlines, big
 * folios, and whitespace, not by boxes, chips, or flow diagrams.
 *
 * LIVE_APP_URL: paste the Hugging Face Space URL here once deployed. Empty =
 * the plate shows a "deploying" state and the launch CTA is inert.
 */
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LIVE_APP_URL = ""; // ← HF Space URL goes here when the app is live
const SOURCE_URL = "https://github.com/carterdaly/NixTLA_Time";

const EASE = [0.16, 1, 0.3, 1] as const;

const CREDITS = [
  { k: "Stack", v: "Python · FastAPI · Next.js · TypeScript", mono: true },
  { k: "Models", v: "StatsForecast · MLForecast · NeuralForecast", mono: true },
];

const FAMILIES = [
  {
    id: "statistical",
    name: "Statistical",
    lib: "StatsForecast",
    models: "AutoARIMA · AutoETS · SeasonalNaive · RandomWalkDrift",
    blurb:
      "Fast, interpretable baselines that are hard to beat on clean, seasonal series, and they fit in milliseconds.",
  },
  {
    id: "ml",
    name: "Machine learning",
    lib: "MLForecast",
    models: "RandomForest · Linear · lags · calendar features",
    blurb:
      "Tree and linear regressors over engineered lag and calendar features, learning structure the statistical baselines cannot.",
  },
  {
    id: "neural",
    name: "Neural",
    lib: "NeuralForecast",
    models: "NHITS · NBEATS · LSTM",
    blurb:
      "State-of-the-art deep learning, on PyTorch, for complex long-horizon patterns where the extra model capacity pays off.",
  },
];

const WORKFLOW = [
  { n: "01", title: "Bring data", body: "Upload a CSV, or start from curated samples: air passengers, energy, retail, temperature." },
  { n: "02", title: "Configure", body: "Set horizon, frequency, season length, lags, calendar features, and the holdout split." },
  { n: "03", title: "Backtest", body: "Rolling-origin cross-validation across multiple windows, so accuracy is measured honestly." },
  { n: "04", title: "Compare", body: "A leaderboard ranks every model on held-out error, with forecasts and intervals charted." },
];

const ARCH = [
  { t: "Data", s: "A CSV upload, or one of the curated sample series." },
  { t: "FastAPI + Nixtla", s: "The service fits every model and runs the cross-validation." },
  { t: "JSON", s: "Forecasts, backtests, and the leaderboard come back as one payload." },
  { t: "Next.js", s: "The interface renders the charts and holds the configuration." },
];

/** Editorial section marker: a folio number and tracked Neue Haas caps on a rule. */
function Marker({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-5 mb-12">
      <span
        className="text-[12px]"
        style={{ fontFamily: "var(--font-display)", color: "var(--accent-secondary)", fontWeight: 500 }}
      >
        {index}
      </span>
      <span
        className="text-[12px] uppercase tracking-[0.26em]"
        style={{ fontFamily: "var(--font-display)", color: "var(--accent-tertiary)", fontWeight: 500 }}
      >
        {children}
      </span>
      <span className="h-px flex-1 translate-y-[-2px]" style={{ background: "rgba(216,207,196,0.16)" }} />
    </div>
  );
}

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={rm ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Underlined text link with the site's green anchor-highlight. */
function TextLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group relative inline-block text-[12px] uppercase tracking-[0.18em]"
      style={{ fontFamily: "var(--font-display)", color: "var(--color-text)", fontWeight: 500 }}
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-px w-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 bg-[var(--accent-primary)]" />
    </a>
  );
}

export function NixtlaCaseStudy() {
  const rm = !!useReducedMotion();
  const [open, setOpen] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // The walkthrough is a large file, so it's only fetched once its section
  // scrolls into view, then plays muted. Native controls let visitors pause,
  // scrub, and rewind; the moment someone pauses by hand we stop auto-resuming
  // so the observer never fights them. Reduced-motion users get the poster only.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || rm) return;
    let wantAutoplay = true; // cleared once the visitor pauses by hand
    let pausingForScroll = false; // guards the observer's own pause() calls
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (wantAutoplay) v.play().catch(() => {});
        } else if (!v.paused) {
          pausingForScroll = true;
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    const onPause = () => {
      if (pausingForScroll) pausingForScroll = false;
      else wantAutoplay = false;
    };
    const onPlay = () => {
      wantAutoplay = true;
    };
    v.addEventListener("pause", onPause);
    v.addEventListener("play", onPlay);
    return () => {
      io.disconnect();
      v.removeEventListener("pause", onPause);
      v.removeEventListener("play", onPlay);
    };
  }, [rm]);

  return (
    <article className="grain-panel bg-[var(--color-bg)]">
      <div className="max-grid px-6 sm:px-10 md:px-12 lg:px-16 pt-28 md:pt-32 pb-28">
        {/* ═══ Masthead ════════════════════════════════════════════ */}
        <header className="grid lg:grid-cols-12 gap-x-10 gap-y-14">
          <div className="lg:col-span-8">
            <motion.p
              className="text-[12px] uppercase tracking-[0.28em] mb-9"
              style={{ fontFamily: "var(--font-display)", color: "var(--accent-tertiary)", fontWeight: 500 }}
              initial={rm ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              NixTLA Forecast Studio
            </motion.p>

            {/* dissolve-target: DissolveLayer gives each tagged big-type
                element its own cursor-dissolve filter, so the small reading
                text between them stays outside every lens. */}
            <motion.h1
              className="dissolve-target"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.9rem, 7vw, 6rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.035em",
                color: "var(--color-text)",
                fontWeight: 600,
              }}
              initial={rm ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
            >
              Nixtla&rsquo;s forecasting stack,
              <br />
              <span style={{ color: "var(--accent-secondary)" }}>without the code.</span>
            </motion.h1>

            {/* Standfirst */}
            <motion.p
              className="mt-10 text-[19px] md:text-[21px] leading-[1.55] max-w-[40ch]"
              style={{ color: "var(--color-text)" }}
              initial={rm ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            >
              Benchmark statistical, machine-learning, and neural time-series
              models side by side, and tune the whole pipeline from the browser.
            </motion.p>
          </div>

          {/* Credits column */}
          <motion.div
            className="lg:col-span-4 lg:pl-10 lg:border-l flex flex-col"
            style={{ borderColor: "rgba(216,207,196,0.14)" }}
            initial={rm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          >
            <dl>
              {CREDITS.map((row) => (
                <div key={row.k} className="py-4 border-b" style={{ borderColor: "rgba(216,207,196,0.1)" }}>
                  <dt
                    className="text-[10px] uppercase tracking-[0.24em] mb-1.5"
                    style={{ fontFamily: "var(--font-display)", color: "var(--accent-tertiary)", fontWeight: 500 }}
                  >
                    {row.k}
                  </dt>
                  <dd
                    className="text-[13px] leading-[1.5]"
                    style={row.mono
                      ? { fontFamily: "var(--font-mono)", color: "var(--color-muted)" }
                      : { color: "var(--color-text)" }}
                  >
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-4 items-start">
              {LIVE_APP_URL ? (
                <a
                  href={LIVE_APP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[12px] uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-transparent"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, background: "var(--accent-primary)", color: "var(--color-text)", border: "1px solid var(--accent-primary)" }}
                >
                  Launch the app ↗
                </a>
              ) : (
                <a
                  href="#app-demo"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-[12px] uppercase tracking-[0.18em] border whitespace-nowrap transition-colors duration-200 hover:bg-[rgba(14,59,46,0.18)]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text)", fontWeight: 500, borderColor: "var(--accent-primary)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-primary)" }} />
                  Watch the demo ↓
                </a>
              )}
              <TextLink href={SOURCE_URL} external>Source ↗</TextLink>
            </div>
          </motion.div>
        </header>

        <div className="h-px mt-24 mb-24" style={{ background: "rgba(216,207,196,0.12)" }} />

        {/* ═══ 01 Problem ══════════════════════════════════════════ */}
        <section>
          <Marker index="01">The problem</Marker>
          <div className="grid lg:grid-cols-12 gap-x-10 gap-y-10">
            <Reveal className="lg:col-span-8">
              <p
                className="dissolve-target"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4.6vw, 3.5rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  color: "var(--color-text)",
                  fontWeight: 500,
                }}
              >
                Nixtla is one of the most powerful forecasting stacks in
                production. It is also one of the most{" "}
                <span style={{ color: "var(--accent-secondary)" }}>code-heavy</span>.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-4 lg:pt-2">
              <p className="text-[16px] leading-[1.75]" style={{ color: "var(--color-muted)" }}>
                Every forecast means hand-wiring data frames, model configs, and
                cross-validation windows across three separate libraries. Forecast
                Studio does that wiring, and turns it into a handful of controls.
              </p>
            </Reveal>
          </div>
        </section>

        <div className="h-px my-24" style={{ background: "rgba(216,207,196,0.12)" }} />

        {/* ═══ 02 Models (signature editorial feature) ═════════════ */}
        <section>
          <Marker index="02">Three families</Marker>
          <Reveal>
            <p
              className="dissolve-target max-w-[30ch] mb-16"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.015em",
                color: "var(--color-text)",
                fontWeight: 400,
              }}
            >
              No single model wins everywhere. The right choice is empirical, not
              assumed.
            </p>
          </Reveal>

          <div className="border-t" style={{ borderColor: "rgba(216,207,196,0.16)" }}>
            {FAMILIES.map((f, i) => {
              const on = i === open;
              return (
                <div key={f.id} className="border-b" style={{ borderColor: "rgba(216,207,196,0.16)" }}>
                  <button
                    onClick={() => setOpen(on ? -1 : i)}
                    aria-expanded={on}
                    className="group w-full flex items-baseline gap-5 md:gap-8 py-7 md:py-9 text-left"
                  >
                    <span
                      className="text-[13px] w-7 shrink-0 transition-colors duration-300"
                      style={{ fontFamily: "var(--font-display)", color: on ? "var(--accent-secondary)" : "var(--color-muted)", fontWeight: 500 }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="dissolve-target flex-1 transition-colors duration-300"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.9rem, 4.6vw, 3.6rem)",
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                        fontWeight: 500,
                        color: on ? "var(--color-text)" : "rgba(230,226,218,0.45)",
                      }}
                    >
                      {f.name}
                    </span>
                    <span
                      className="hidden sm:block text-[11px] tracking-[0.02em] self-center transition-colors duration-300"
                      style={{ fontFamily: "var(--font-mono)", color: on ? "var(--accent-tertiary)" : "var(--color-muted)" }}
                    >
                      {f.lib}
                    </span>
                    <span
                      className="text-[17px] shrink-0 self-center transition-transform duration-300"
                      style={{ color: on ? "var(--accent-tertiary)" : "var(--color-muted)", transform: on ? "rotate(45deg)" : "none" }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        key="detail"
                        initial={rm ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={rm ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="grid md:grid-cols-12 gap-y-4 md:gap-x-8 pb-10 md:pl-[calc(1.75rem+2rem)]">
                          <p className="md:col-span-7 text-[17px] leading-[1.65]" style={{ color: "var(--color-text)" }}>
                            {f.blurb}
                          </p>
                          <p
                            className="md:col-span-5 text-[12px] leading-[1.7] self-start md:text-right"
                            style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
                          >
                            {f.models}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <div className="h-px my-24" style={{ background: "rgba(216,207,196,0.12)" }} />

        {/* ═══ 03 Workflow (editorial numbered feature) ════════════ */}
        <section>
          <Marker index="03">Workflow</Marker>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {WORKFLOW.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="pt-5 border-t" style={{ borderColor: "rgba(216,207,196,0.22)" }}>
                  <span
                    className="dissolve-target block text-[34px] leading-none mb-5"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-text)", fontWeight: 500, letterSpacing: "-0.03em" }}
                  >
                    {step.n}
                  </span>
                  <h3 className="mb-3 text-[16px] uppercase tracking-[0.08em]" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)", fontWeight: 600 }}>
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-[1.7]" style={{ color: "var(--color-muted)" }}>
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="h-px my-24" style={{ background: "rgba(216,207,196,0.12)" }} />

        {/* ═══ 04 Architecture (typographic, not a diagram) ════════ */}
        <section>
          <Marker index="04">How it is built</Marker>
          <div className="grid lg:grid-cols-12 gap-x-10">
            <Reveal className="lg:col-span-4 mb-8 lg:mb-0">
              <p className="text-[15px] leading-[1.8]" style={{ color: "var(--color-muted)" }}>
                One request travels through four stages, front to back.
              </p>
            </Reveal>
            <div className="lg:col-span-8 border-t" style={{ borderColor: "rgba(216,207,196,0.16)" }}>
              {ARCH.map((node, i) => (
                <Reveal key={node.t} delay={i * 0.07}>
                  <div className="grid sm:grid-cols-[1fr_2fr] gap-1 sm:gap-8 py-5 border-b items-baseline" style={{ borderColor: "rgba(216,207,196,0.16)" }}>
                    <span
                      className="text-[19px]"
                      style={{ fontFamily: "var(--font-display)", color: "var(--color-text)", fontWeight: 500 }}
                    >
                      {node.t}
                    </span>
                    <span className="text-[14px] leading-[1.6]" style={{ color: "var(--color-muted)" }}>
                      {node.s}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px my-24" style={{ background: "rgba(216,207,196,0.12)" }} />

        {/* ═══ 05 The app (closing plate) ══════════════════════════ */}
        <section id="app-demo">
          <Marker index="05">The app</Marker>
          <Reveal>
            <figure>
              <video
                ref={videoRef}
                className="block w-full aspect-video object-cover"
                style={{ border: "1px solid rgba(14,59,46,0.5)", background: "#000" }}
                src="/nixtla-demo.mp4"
                poster="/nixtla-demo-poster.jpg"
                controls
                muted
                loop
                playsInline
                preload="none"
                aria-label="NixTLA Forecast Studio recorded walkthrough"
              />
              <figcaption className="mt-4 flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-display)", color: "var(--color-muted)", fontWeight: 500 }}>
                  Recorded walkthrough
                </span>
                <TextLink href={SOURCE_URL} external>Source ↗</TextLink>
              </figcaption>
            </figure>
          </Reveal>
        </section>
      </div>
    </article>
  );
}
