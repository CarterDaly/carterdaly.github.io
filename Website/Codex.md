# Carter Daly Portfolio – Codex Spec (Expanded Multi-Page)

Single source of truth for an award-level personal site for Carter Daly (research/ML practitioner: fusion disruption prediction, F1 strategy, time-series forecasting). Visual tone: artful, high-craft, modern designer-portfolio quality with plasma/orbit metaphors. Scope is now multi-page.

## 1. Scope
- Build full portfolio shell with multiple routes: Home (`/`), Work (featured projects grid/cards + case studies), About, Contact. Blog optional placeholder only. No actual content yet; use placeholders where data is unknown.
- Include navigation (Home, Work, About, Blog optional, Contact).
- Provide case study pages (template) reachable from Work cards (placeholder data/images/text).
- Add stats (years, projects, clients) as placeholders (blank or “—”) to be filled later.
- No real contact form backend; use mailto and external links.
- Keep stack: Astro + React islands + Tailwind CSS; npm.

## 2. High-level goals
- Award-worthy, immersive landing/portfolio with strong motion and typography (inspired by Niccolò Miranda, Dennis Snellenberg, Fons Mans, WeekendVisuals), but tailored to a research ML identity.
- Responsive, accessible, high-contrast dark theme with bright cyan/violet accents; optional warm accent for key CTAs.
- Deployable to GitHub Pages at repo root (build to `docs/`).

## 3. Stack & assets
- Astro (SSG) with React islands for hero/animations and interactions; Tailwind CSS.
- Fonts: Clash Display (headings), Satoshi (body), JetBrains Mono (code).
- Optional dark-mode toggle (default dark). If implemented, ensure persistence and accessible focus states.
- Placeholder assets: `public/og-default.png`, `public/favicon.svg` (optional `.ico`). Hero photo: no photo for now (use abstract/placeholder).

## 4. Config (`src/config/siteConfig.ts`)
- Fields for identity/meta/links/stats:
  - `owner`, `name`, `label/tagline`, `heroHeading`, `heroSubheading`, `heroParagraph`.
  - `links`: `github`, `linkedin`, `email` (TODO placeholder ok), `resume` (placeholder).
  - `stats`: `years`, `projects`, `clients` (allow blank/“—”).
  - `assets`: `ogDefault`, `faviconSvg`, optional `faviconIco`.
  - `location` (placeholder ok).
  - Page titles/descriptions defaults for SEO/OG.
- All hard-coded strings configurable here; projects/stats can be placeholder objects/arrays.

## 5. Routes & structure (initial)
```
src/
  layouts/
    BaseLayout.astro
  components/
    Header.astro
    Footer.astro
    PlasmaHeader.jsx (hero visual/motion)
    SectionTitle.astro
    Stats.astro (placeholder values)
    WorkGrid.astro (cards)
    WorkCard.astro
    ContactBand.astro
  pages/
    index.astro            (home)
    work/index.astro       (grid of featured projects)
    work/[slug].astro      (case study template with placeholder data)
    about.astro            (bio/resume CTA)
    contact.astro          (contact info/links; no backend form)
    blog/index.astro       (optional placeholder list)
  config/
    siteConfig.ts
  content/
    writing/   (empty unless blog posts added later)
public/
  og-default.png
  favicon.svg  (optional favicon.ico)
```

## 6. Layout & components
- `BaseLayout.astro`: sets head/OG/Twitter meta, favicon links, includes global fonts, optional theme toggle, wraps header/main/footer. Apply dark theme; allow future light toggle.
- `Header.astro`: name/logo left; nav links Home/Work/About/Blog(optional)/Contact; smooth scroll for same-page anchors; responsive; accessible focus states.
- `Footer.astro`: name, year, location, succinct social/mailto links; maintain premium aesthetic.
- `PlasmaHeader.jsx`: hero with animated plasma/orbit/particle canvas; respects prefers-reduced-motion; supports primary and secondary CTAs (Email, Resume placeholder).
- `SectionTitle.astro`: consistent section labels/headings/subtitles.
- `Stats.astro`: displays years/projects/clients placeholders (use en/em dash if blank).
- `WorkGrid/WorkCard`: cards with cover image placeholder, title, tags; link to case study pages.
- `ContactBand.astro`: prominent CTA band with mailto + social links; no form backend.

## 7. Pages
- Home (`/`):
  - Striking hero: label, name/title, tagline, subheading, short paragraph, primary/secondary CTAs, animated artful background (plasma/orbit). Optional subtle parallax on background layers.
  - Quick stats (placeholders for now).
  - Featured work preview cards (link to Work/case studies).
  - Brief “Approach” / “About” teaser linking to About.
  - Motion: on-scroll reveals; hover microinteractions; reduced-motion respect.
- Work (`/work`):
  - Grid of featured projects (placeholders: title, tags, short blurb, cover image placeholder).
  - Each card links to `/work/[slug]` case study.
- Case study (`/work/[slug]`):
  - Sections: overview, role, tools, problem, process, challenges, outcome, impact (all placeholder text). Include hero banner/cover placeholder.
- About (`/about`):
  - Narrative background, skills/passions, mention domains (fusion, F1, forecasting), downloadable résumé button (placeholder link), optional abstract avatar (no real photo).
- Contact (`/contact`):
  - Simple layout with mailto CTA, social links; no backend form. Could include minimal form UI with disabled submit or mailto action if desired.
- Blog (`/blog` optional placeholder):
  - Simple placeholder page indicating posts coming soon. No posts required yet.

## 8. Design system
- Colors: deep near-black background (e.g., #020617 / #050816), text primary off-white, secondary muted gray. Accents: cyan/teal primary, violet/magenta secondary, warm amber for key CTAs. Maintain high contrast.
- Typography: Clash Display (headings), Satoshi (body), JetBrains Mono (code). Scale: H1 desktop ~text-6xl (mobile ~text-3xl–4xl), H2 ~text-4xl, H3 ~text-2xl, body ~text-base–lg, meta text-xs–sm with tracking.
- Layout: generous whitespace; grids/flex responsive; max-width ~max-w-6xl on main content; avoid clutter.
- Motion: Framer Motion or CSS keyframes for hero background, hover states, and scroll reveals. Optional lightweight Three.js/WebGL in hero if performant; otherwise layered gradients/particles/orbits. All motion respects prefers-reduced-motion.
- Microinteractions: subtle hover lift/glow on buttons/links; accent underlines; small parallax on hero art (do not harm readability).
- Dark-mode toggle: default dark; implement toggle with accessible focus and persistence if included.

## 9. Interaction & animation
- Hero: animated plasma/orbit canvas; possible particles/noise; slow, smooth easing; static fallback on reduced motion.
- Scroll reveals: small offset + opacity; intersection observer or Framer Motion viewport. Disable for reduced motion.
- Hover: buttons/links get slight scale/elevation or accent glow; cards with soft lift and border glow.
- Optional hero 3D/WebGL element: lightweight, performant; must degrade gracefully.

## 10. Performance & SEO
- Lazy-load images; keep placeholder assets lightweight. Compress assets where applicable.
- `<title>`/`<meta name="description">` per page; OG/Twitter tags using `assets.ogDefault` by default.
- Add sitemap and robots.txt.
- Keep animations on transform/opacity for performance.

## 11. Accessibility
- Semantic HTML (header, nav, main, article, footer).
- Descriptive alt text/ARIA labels; keyboard navigable; visible focus states.
- High contrast; readable font sizes. Honor prefers-reduced-motion.

## 12. Deployment
- Target GitHub Pages at repo root (`carterdaly.github.io`); build to `docs/`. No CI yet.

## 13. Placeholders & content
- Stats can remain blank/“—” until provided.
- Projects/case studies use placeholder text/images/tags; to be replaced later.
- Email remains TODO mailto until provided. No real contact form backend.
