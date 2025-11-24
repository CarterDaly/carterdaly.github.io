# Codex Project Specification – Carter Daly Portfolio Site

You are an AI coding assistant helping build a **top 1% personal website** for **Carter Daly**.  
This file is the **single source of truth** for the project’s structure, goals, and implementation details.

The site should feel like it belongs to a **research engineer / ML practitioner** doing advanced work in:
- Nuclear fusion disruption prediction
- F1 race strategy modelling
- Time-series forecasting / ML research

The visual design should be **minimal, polished, and slightly artistic**, with a consistent visual language we can refine iteratively.

---

## 1. High-Level Goals

1. **Top-tier portfolio** suitable for applications to places like **Anthropic**, research labs, and elite ML teams.
2. Site is **static** and can be deployed to **GitHub Pages** (or similar static hosting).
3. **Modular architecture**:
   - One repo for the **site**.
   - Separate repos for each **project** (fusion, FastF1, etc.).
   - Site pulls project summaries and figures from those repos via static URLs (JSON + images).
4. UI/UX is:
   - **Clean, cohesive, and intentional**, not generic or templatey.
   - **Artistic** in a subtle way (controlled motion, plasma/orbit metaphors, strong typography).
   - **Accessible** (good contrast, keyboard nav, respects reduced-motion).

---

## 2. Tech Stack

Use this stack unless explicitly changed later:

- **Framework**: [Astro](https://astro.build/) (SSG, content-focused)
- **UI library for interactivity**: React components inside Astro where needed
- **Styling**: Tailwind CSS
- **Icons**: Optional, e.g., Lucide or Heroicons
- **Package manager**: npm or pnpm (default to npm unless instructed otherwise)

The output must be fully static and deployable via GitHub Pages or any static host.

---

## 3. Repo Overview

This Codex-controlled repo is the **site repo**. The user will have **separate project repos** like:

- `fusion-disruption-model`
- `fastf1-strategy-bnn`
- `solar-forecasting`
- etc.

Each project repo will expose a `public/` folder with:
- `summary.json` – structured project summary & metrics
- PNG/SVG figures for plots, diagrams, etc.

The site repo will **fetch these resources at build time** (or client-side where appropriate).

---

## 4. Site Structure

### 4.1 Routes / Pages

Create the following key pages:

1. `/` – **Home**
2. `/work` – **Work / Projects overview**
3. `/projects/fusion-disruption` – Detailed page for the fusion project (first flagship project)
4. `/writing` – Short essays / notes (can start with placeholder)
5. `/about` – Short bio and context

Use Astro’s file-based routing:

```text
src/
  pages/
    index.astro
    work.astro
    writing.astro
    about.astro
    projects/
      fusion-disruption.astro
# Additional Codex Project Specification (Points 5–12)

---

## 5. Layout and Components

### 5.1 Global Layout

Create a global layout component:

- `src/layouts/BaseLayout.astro`

Responsibilities:
- Set `<head>` metadata (title, description, social, etc.).
- Wrap pages in a consistent structure:
  - `Header` / top nav
  - Main content container
  - Footer

Also create:

- `src/components/Header.astro`
- `src/components/Footer.astro`

**Header**:
- Left: site “logo” (just text for now: `carter daly` or `cd.`)
- Right: nav links – `work`, `writing`, `about`
- On small screens: a simple responsive menu (no need for complex hamburger at first; can add later).

**Footer**:
- Light, minimal footer with:
  - © year, name
  - Links: GitHub, LinkedIn, maybe email

### 5.2 Reusable Components

Create the following reusable components (Astro or React as appropriate):

- `ProjectCard.astro`
  - Props: `title`, `subtitle`, `tags`, `link`, `highlight` (boolean), optional metrics
  - Used on the home page and `/work`

- `MetricPill.astro`
  - Props: `label`, `value`
  - Small pill-like UI used to show metrics (e.g., ROC AUC, F1, Last Updated)

- `SectionTitle.astro`
  - For consistent section headers across pages

- `PlasmaHeader.jsx` (React component used inside Astro pages)
  - Hero section with:
    - Title
    - Subtitle
    - Optional background animation or orbit-like visuals (see Artistic Components section)
  - Should be reusable for both home and key project pages


---

## 6. Design System

### 6.1 Colors (Initial Draft)

Set up Tailwind theme with a coherent palette. This will be iterated later, but start with:

- **Background**:
  - `bg-surface`: near-black / deep slate (`#020617` or similar)
  - `bg-elevated`: slightly lighter shade for cards
- **Text**:
  - `text-primary`: off-white (`#E5E7EB` or similar)
  - `text-muted`: soft gray (`#9CA3AF`)
- **Accents**:
  - `accent-primary`: teal/cyan (plasma-like, e.g. `#22D3EE`)
  - `accent-secondary`: violet (`#A855F7`)
  - `accent-warm`: soft amber for important CTAs (`#F59E0B`)

Configure Tailwind so these tokens can be used semantically, not just raw hex.

### 6.2 Typography

Use web fonts via CSS:

- **Headings**: a slightly distinctive, modern sans-serif (e.g., Space Grotesk, or similar)
- **Body**: clean, readable sans (e.g., Inter)
- **Code**: JetBrains Mono or Fira Code

Define a clear type scale:

- `text-3xl/4xl` for major headings
- `text-xl` for section titles
- `text-base` for body
- `text-sm` for meta information

### 6.3 Spacing & Layout

- Use a consistent max-width container for content (e.g., `max-w-5xl mx-auto px-4`).
- Generous spacing between sections (`py-12`, `py-16`).
- Align to a simple grid on desktop (`grid`, `md:grid-cols-2/3` where appropriate).

### 6.4 Motion & Microinteractions

- Hover states for project cards:
  - Subtle lift (`translate-y-[-2px]`, `shadow-lg`)
  - Slight border/outline color shift using accent colors
- Transitions:
  - Use Tailwind transitions with cubic-bezier easing for softness
- Respect user preference:
  - For any non-trivial animation, check `prefers-reduced-motion` and disable or simplify.

We’ll refine the artistic motion after the basic version is working.

---

## 7. Page Content Behavior

### 7.1 `/` Home

**Hero section**:

- Uses `PlasmaHeader` with:
  - Main heading: `Carter Daly`
  - Subtitle tag line (we might refine later, but start with something like):
    - `data & ml`
    - `pursuing models that solve unsolved problems`
- Optionally show 2–3 short highlight bullets:
  - Nuclear fusion disruption prediction
  - F1 race strategy modeling
  - Time-series & forecasting research

**Featured Project**:

- Prominently showcase the **fusion disruption project**.
- Use a large `ProjectCard` variant with:
  - Title: “Tokamak Disruption Prediction”
  - Brief description: 1–2 short sentences
  - Key metrics preview (pull from the JSON summary if practical, otherwise placeholder to be wired up)

**Secondary Projects**:

- A row or grid of other projects (FastF1, solar forecasting, etc.) as smaller `ProjectCard`s.

**Writing teaser**:

- Show the latest 1–3 writing entries (can be placeholder data initially) with links to `/writing`.

---

### 7.2 `/work`

- A structured, more detailed list of projects.
- Group projects:
  - “Core Research Projects”
  - “Explorations / Side Projects”
- Each project gets a `ProjectCard` with:
  - Title
  - One-liner description
  - Key tags (e.g., `fusion`, `time-series`, `bayesian`, `FastF1`)
  - A link to:
    - A dedicated project page (e.g., `/projects/fusion-disruption`) **or**
    - External repo if no dedicated page yet

---

### 7.3 `/projects/fusion-disruption`

This is a **deep-dive project page** for the fusion disruption model.

Behavior/spec:

- At build time (or client-side as needed), fetch JSON summary from:
  - `https://raw.githubusercontent.com/<username>/fusion-disruption-model/main/public/summary.json`
- Parse JSON to fill:
  - Title
  - Short description
  - Model info
  - Metrics (ROC AUC, F1, etc.)
  - Last updated date

Use `MetricPill` to display the metrics.

Also:

- Show ROC curve and confusion matrix images by referencing:
  - `https://raw.githubusercontent.com/<username>/fusion-disruption-model/main/public/roc_curve.png`
  - `https://raw.githubusercontent.com/<username>/fusion-disruption-model/main/public/confusion_matrix.png`
- Provide sections:
  1. Overview
  2. Data & Problem Setup
  3. Model & Methods
  4. Results
  5. Failure modes & next steps
  6. Links:
     - GitHub repo
     - Colab / notebook (placeholder links can be used for now)

Initially, use mock or placeholder URLs/JSON structure that can be updated later.

---

### 7.4 `/writing`

- Simple list of essays/notes (initially stub data).
- Each entry:
  - Title
  - Short 1–2 line description
  - Date
- Link to either dedicated pages `/writing/some-slug` or external URLs (e.g., Medium / dev.to) – we can stub for now.

---

### 7.5 `/about`

- Short narrative of Carter’s path:
  - Data analytics / ML background
  - Interest in nuclear fusion & high-impact domains
  - Interest in interpretability/reliability, etc.
- Keep it readable, not bloated; this is implementation placeholder content that the user will refine.

---

## 8. Data Integration with Project Repos

### 8.1 Expected JSON Structure

Assume each major project repo exposes `public/summary.json` with structure similar to:

```json
{
  "title": "Tokamak Disruption Prediction",
  "short_title": "Fusion Disruption",
  "description": "Model predicts disruptions 50ms before onset using diagnostic time series from tokamak plasmas.",
  "last_updated": "2025-11-22",
  "model": "BiLSTM with attention",
  "metrics": {
    "roc_auc": 0.93,
    "f1_score": 0.87
  },
  "tags": ["fusion", "time-series", "ml", "tokamak"]
}

In the site:

Create a small TypeScript/JS utility to fetch & parse this structure.

Create interfaces/types for stronger typing (if using TypeScript).

Handle failure gracefully:

If fetch fails, show fallback copy and hide metrics instead of breaking the page.

8.2 Build-Time vs Client-Side Fetch

Preferred: Use Astro to fetch at build time where possible (for predictable static HTML), e.g.:

In an Astro page’s frontmatter, use await fetch(...).

If that’s problematic for some reason (e.g., CORS or build-time network issues), we can fall back to client-side fetching with fetch() in a React component.

9. Implementation Steps (for Codex)

Implement in roughly this order:

Project bootstrapping

Initialize Astro project

Add Tailwind CSS

Set up basic BaseLayout, Header, and Footer

Configure fonts (Google Fonts or similar)

Global structure

Implement BaseLayout and apply to index.astro, work.astro, about.astro, writing.astro

Ensure navigation between pages works

Design system

Configure Tailwind theme override (colors, fonts, containers)

Implement base typography and background styles

Verify dark theme and basic readability

Core components

ProjectCard.astro

MetricPill.astro

SectionTitle.astro

Home page

Add hero section with placeholder PlasmaHeader

Add featured project card for fusion

Add secondary project cards with placeholder data

Work page

Layout grid of ProjectCards with placeholder data

Fusion project page

Implement page structure and sections

Implement JSON fetch from a placeholder URL (configurable)

Render metrics and images (use placeholder URLs)

Handle fetch errors gracefully

Writing & About

Add reasonable placeholder content and layout

Ensure style consistency

Artistic components (initial draft)

Implement PlasmaHeader.jsx with a simple, low-cost visual effect (e.g., orbits or particles using Canvas/SVG or simple div animations)

Respect reduced-motion preferences

Polish

Responsive checks (mobile, tablet, desktop)

Accessibility basics (semantic HTML, roles, alt text)

Light performance review (no unnecessary heavy libraries)

10. Artistic Components – Collaboration Notes

The artistic direction will be refined iteratively. For now:

Implement PlasmaHeader as a modular React component with a well-defined API:

interface PlasmaHeaderProps {
  title: string;
  subtitle?: string;
  showBackgroundAnimation?: boolean;
}


Internally, separate:

Text content layout

Background visual (canvas/svg/animated gradient)

Make it easy to:

Swap out the background visual strategy later

Adjust intensities/parameters via props or a config file

We will later iterate with:

Different motion fields

Different color blends

Possibly subtle mouse interaction (parallax, light movement)

Additional visual metaphors for orbits / topology / plasma containment

11. Configuration & Customization

Create a central config file:

src/config/siteConfig.ts (or .js)

Example fields:

export const siteConfig = {
  name: "Carter Daly",
  tagline: "data & ml — pursuing models that solve unsolved problems",
  links: {
    github: "https://github.com/<username>",
    linkedin: "https://www.linkedin.com/in/carterwdaly",
    email: "mailto:...",
  },
  projects: {
    fusionDisruption: {
      repoOwner: "<username>",
      repoName: "fusion-disruption-model",
      summaryPath: "public/summary.json",
      figures: {
        roc: "public/roc_curve.png",
        confusion: "public/confusion_matrix.png",
      },
    },
    // future projects...
  },
};


All hard-coded URLs and strings for this project should be adjustable via this config where possible.