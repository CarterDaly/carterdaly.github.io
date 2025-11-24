# Carter Daly Portfolio – Codex Spec (Landing v0)

Single source of truth for building a top-tier personal site for Carter Daly (research engineer / ML practitioner: fusion disruption prediction, F1 race strategy modelling, time-series forecasting). Visual tone: minimal, polished, subtly artistic. This iteration focuses solely on the landing page.

## 1. Scope (this iteration)
- Build global layout and landing page (`/`) only; dark theme.
- Do **not** add work/projects/writing/about routes or data; no `siteConfig.projects`.
- Prepare `src/content/writing/` but keep it empty (no stub posts).
- Provide SEO shell and placeholder assets: `public/og-default.png`, `public/favicon.svg` (optional `favicon.ico`).
- Implement hero with plasma-inspired motion, typography, and dark theme; keep rest minimal.

## 2. High-level goals
- Portfolio suitable for Anthropic / research labs / elite ML teams.
- Static Astro site deployable to GitHub Pages at repo root.
- Clean, cohesive, intentional UI with subtle artistry and accessibility (contrast, keyboard nav, reduced-motion respect).

## 3. Stack
- Astro (SSG), Tailwind CSS.
- React islands where needed (PlasmaHeader animation).
- Fonts: Clash Display (headings), Satoshi (body), JetBrains Mono (code).
- Package manager: npm. Theme: dark-only for v0. Icons optional (Lucide/Heroicons not required).

## 4. Identity & config (`src/config/siteConfig.ts`)
- Fields only for identity/hero/meta (no projects array).
- Example:
```ts
export const siteConfig = {
  owner: "carterdaly",
  name: "Carter Daly",
  label: "data & ml",
  heroHeading: "pursuing models for unsolved problems",
  heroSubheading:
    "Nuclear fusion, race strategy, and time-series systems — with a bias toward interpretable, high-impact ML.",
  links: {
    github: "https://github.com/carterdaly",
    linkedin: "https://www.linkedin.com/in/carterwdaly",
    email: "mailto:TODO@TODO.com",
  },
  contactCtaLabel: "Email me",
  assets: {
    ogDefault: "/og-default.png",
    faviconSvg: "/favicon.svg",
    faviconIco: "/favicon.ico",
  },
};
```
- All hard-coded v0 strings should be configurable here.

## 5. Routes & structure
- Current route: `/` only.
- Deferred (no files yet): `/work`, `/projects/`, `/writing`, `/about`.
- Starter file layout:
```
src/
  pages/
    index.astro
  layouts/
    BaseLayout.astro
  components/
    Header.astro
    Footer.astro
    PlasmaHeader.jsx
  config/
    siteConfig.ts
  content/
    writing/    (empty)
public/
  og-default.png   (placeholder)
  favicon.svg      (placeholder; optional favicon.ico)
```

## 6. Layout & components (v0)
- `BaseLayout.astro`: dynamic `<title>` and `<meta name="description">` with defaults from `siteConfig`; default OG/Twitter tags using `assets.ogDefault`; favicon links (SVG + optional ICO); wraps header/main/footer with dark theme.
- `Header.astro`: text logo (“carter daly” or “cd.”); simple nav anchors (e.g., `#top`, `#contact`) to avoid broken routes; responsive stack/inline; no hamburger needed.
- `Footer.astro`: © current year + name; links to GitHub, LinkedIn, Email CTA.
- `PlasmaHeader.jsx`: hero (label, heading, subheading, CTA mailto) with subtle animated gradient/orbit inspired by https://www.youtube.com/watch?v=0MW8nkIeCUI; respects `prefers-reduced-motion` (static fallback); props for copy and animation intensity.
- Other components: skip project-specific pieces; only add generic helpers if truly needed.

## 7. Design system (v0)
- Colors (Tailwind semantic tokens):
  - bg-surface `#020617`
  - bg-elevated `#0B1224`
  - text-primary `#E5E7EB`
  - text-muted `#9CA3AF`
  - accent-primary `#22D3EE`
  - accent-secondary `#A855F7`
  - accent-warm `#F59E0B`
- Typography: Clash Display (H1–H3), Satoshi (body), JetBrains Mono (code). Scale: H1 ~3.5–4rem, H2 ~2.5–3rem, H3 ~1.75–2rem, body ~1–1.1rem, meta ~0.9rem.
- Layout/spacing: max width `max-w-5xl` (hero background can extend wider); generous vertical rhythm (hero `py-16`, future sections `py-12`); use flex/grid; avoid cramped columns.
- Motion: hero gradient/orbit with soft easing and clamped opacity/blur; reduce/disable when `prefers-reduced-motion`; elsewhere only light hover/transition (no parallax).

## 8. Landing content (v0)
- Label: `data & ml`.
- Heading: `pursuing models for unsolved problems`.
- Subheading: `Nuclear fusion, race strategy, and time-series systems — with a bias toward interpretable, high-impact ML.`
- CTA: `Email me` → `siteConfig.links.email` (mailto).
- Background: PlasmaHeader animation; below the fold stays minimal (optional short blurb only; no project/writing teasers).

## 9. SEO & assets
- Default title/description from `siteConfig`; allow per-page overrides.
- OG/Twitter defaults: `og:title`, `og:description`, `og:image` → `assets.ogDefault`; `twitter:card` = `summary_large_image`.
- Favicons: `link rel="icon" type="image/svg+xml" href="/favicon.svg"`; optional `alternate icon` for `.ico`.
- Assets are placeholders to be swapped later.

## 10. Deployment
- Target GitHub Pages at repo root (`carterdaly.github.io`).
- Manual deploy: build to `dist/`, copy to `docs/` on `main`. No CI yet.
- Astro base should remain `/` (root deploy).

## 11. Next iterations (later)
- Add `/work` and `/projects/*` with bespoke layouts; introduce `siteConfig.projects`.
- Add writing collection with MD/MDX frontmatter (title, date, summary, tags, hero, heroImage, externalUrl).
- Support project data fetching/parsing; expand Plasma visuals/motion; add sections like highlights/principles when real content exists.
