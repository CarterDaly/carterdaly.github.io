import { useEffect, useState } from 'react';

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);

    const handler = (event) => setReduced(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduced;
};

export default function PlasmaHeader({
  label,
  heading,
  subheading,
  paragraph,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryHref,
  intensity = 1,
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animate = !prefersReducedMotion && intensity > 0;
  const layerOpacity = Math.min(0.75, 0.75 * intensity);
  const layerOpacitySecondary = Math.min(0.6, 0.6 * intensity);

  return (
    <section className="relative isolate overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-surface via-[#060b1a] to-surface px-6 py-12 shadow-[0_20px_80px_rgba(0,0,0,0.4)] sm:px-10 sm:py-16 lg:px-14">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute inset-[-18%] blur-3xl mix-blend-screen ${animate ? 'animate-plasma' : ''}`}
          style={{
            opacity: layerOpacity,
            background:
              'radial-gradient(40% 35% at 25% 35%, rgba(34, 211, 238, 0.28), transparent 55%), radial-gradient(42% 38% at 80% 20%, rgba(168, 85, 247, 0.23), transparent 52%), radial-gradient(38% 34% at 65% 75%, rgba(245, 158, 11, 0.18), transparent 50%)',
          }}
        />
        <div
          className={`absolute inset-[-28%] blur-3xl mix-blend-screen ${animate ? 'animate-plasma-reverse' : ''}`}
          style={{
            opacity: layerOpacitySecondary,
            background:
              'radial-gradient(38% 32% at 15% 65%, rgba(168, 85, 247, 0.22), transparent 55%), radial-gradient(36% 30% at 75% 55%, rgba(34, 211, 238, 0.18), transparent 52%), radial-gradient(32% 28% at 50% 30%, rgba(245, 158, 11, 0.16), transparent 50%)',
          }}
        />
        <div
          className="absolute inset-[-10%] opacity-35"
          style={{
            background:
              'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 82% 25%, rgba(34,211,238,0.1), transparent 40%), radial-gradient(circle at 48% 80%, rgba(168,85,247,0.08), transparent 38%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/6 via-transparent to-black/60" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0, rgba(255,255,255,0) 38%), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: 'auto, 80px 80px, 80px 80px',
            maskImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.7), rgba(0,0,0,0.05) 60%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.7), rgba(0,0,0,0.05) 60%, transparent 75%)',
          }}
        />
        <div
          className={`absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 ${animate ? 'animate-orbit' : ''}`}
          style={{
            boxShadow:
              '0 0 120px 30px rgba(34, 211, 238, 0.16), 0 0 140px 50px rgba(168, 85, 247, 0.1)',
            opacity: 0.6,
          }}
        />
        <div
          className={`absolute left-[12%] top-[26%] h-20 w-20 rounded-full bg-accent-primary/25 blur-3xl ${animate ? 'animate-plasma' : ''}`}
        />
        <div
          className={`absolute right-[10%] bottom-[14%] h-28 w-28 rounded-full bg-accent-secondary/25 blur-3xl ${animate ? 'animate-plasma-reverse' : ''}`}
        />
      </div>

      <div className="relative grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-primary/90">
              <span className="h-2 w-2 rounded-full bg-accent-primary shadow-glow" aria-hidden="true" />
              {label}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-primary/80">
              <span className="h-2 w-2 rounded-full bg-accent-secondary/80" aria-hidden="true" />
              research engineer
            </div>
          </div>

          <div className="space-y-5">
            <h1
              id="hero-heading"
              className="font-display text-4xl leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {heading}
            </h1>
            <p className="max-w-2xl text-lg text-muted sm:text-xl">{subheading}</p>
            {paragraph && <p className="max-w-2xl text-base text-muted/90">{paragraph}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-3 text-base font-semibold text-surface transition hover:-translate-y-[1px] hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              {ctaLabel}
              <span aria-hidden="true">↗</span>
            </a>
            {secondaryHref && (
              <a
                href={secondaryHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-base font-semibold text-primary transition hover:-translate-y-[1px] hover:border-accent-primary/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-10 -top-6 h-24 w-24 rounded-full border border-white/10 blur-sm" />
          <div className="absolute -left-6 bottom-4 h-28 w-28 rounded-full border border-white/10 blur-sm" />

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/50" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted">
                <span>signal monitor</span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-accent-primary shadow-glow" />
                  live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'fusion', value: 'stability pass', color: 'bg-accent-primary' },
                  { label: 'race strategy', value: 'bayesian sim', color: 'bg-accent-secondary' },
                  { label: 'forecasting', value: 'robust', color: 'bg-accent-warm' },
                  { label: 'interpretability', value: 'priority', color: 'bg-accent-primary' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur"
                  >
                    <div className="flex items-center gap-2 text-muted uppercase tracking-[0.12em] text-[11px]">
                      <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                      {item.label}
                    </div>
                    <p className="mt-2 text-base text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 via-transparent to-white/5 px-4 py-3 text-sm text-muted">
                Orbiting between research and production: I prototype quickly, validate with
                interpretable signals, and ship only what can be understood.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
