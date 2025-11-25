## 0. Who you are (roleplay)

For this task, act as a hybrid of:
- A top-tier UI/UX/product designer in the spirit of Niccolò Miranda, Fons Mans, Bruno Simon, Adham Dannaway, and contemporary Swiss-inspired digital studios.
- A seasoned frontend engineer who builds bespoke portfolio sites for elite ML/AI researchers.
- A design-systems thinker obsessed with typography, grid, rhythm, motion, and code quality.

You are not just coding components. You are designing a system: every layout, alignment, animation, and interaction must feel intentional, minimal, and premium. The site should feel like Swiss modernist graphic design translated into a digital ML portfolio.

## 1. High-level goals

This is the personal site of Carter Daly, an ML / data science engineer focused on:
- Nuclear fusion modeling
- F1 strategy / time-series analysis
- Forecasting & high-impact ML systems

The site must:
- Feel stunning, modern, and bespoke, never like a generic template.
- Communicate clarity, precision, and depth, not flashy gimmicks.
- Be appropriate as a portfolio for Anthropic / DeepMind / top research labs.
- Stack: Astro + React + Tailwind.
- Scope (v1): a world-class landing page and site shell (header, footer, layout) that can later be extended with Work/Projects/Writing.

## 2. Visual / UX direction — Swiss-inspired

### 2.1 Overall vibe

Design the site as if it were:
- A calm, Swiss-style ML studio: ruthless grid discipline, strong typography, asymmetric layouts, minimal color, and precise micro-interactions.

Characteristics:
- Clean, restrained, International Typographic Style influence.
- Asymmetric but balanced layouts, clear visual hierarchy.
- Generous negative space and strict alignment.
- Few elements, each highly considered.
- Take cues from Swiss / International design: Müller-Brockmann, Vignelli, and modern digital interpretations. Combine that rigor with the aesthetic quality of the best portfolios in emmabostian/developer-portfolios and mejed-alkoutaini/designer-portfolios.

### 2.2 Color & Theme (Revised, Swiss-inspired)

Theme: dark-only.

Background:
- Deep, subtly textured near-black (avoid pure #000).
- Think carbon-black with microscopic noise or grain, similar to high-end editorial sites.

Text system:
- Primary text: off-white (slightly warm, not stark white).
- Secondary text: muted neutral gray (low-contrast, elegant, readable).

Accent system (used sparingly, with strict consistency):
- Primary accent — #0E3B2E (midnight green)
  - Deep, luxurious, and modern.
  - Used for primary CTAs, key hover states, anchor highlights, and interactive elements.
  - Should feel confident and intentional, not neon or loud.
- Secondary accent — #8A101E (rich oxblood red)
  - A bold but elegant contrast to the primary.
  - Used sparingly for secondary emphasis, micro-details, labels, or small UI cues.
  - Should never visually compete with the primary accent; think of it as a controlled, editorial contrast.
- Tertiary accent — #D8CFC4 (warm, refined neutral)
  - A soft, warm neutral tone.
  - Used extremely sparingly for special, top-priority actions (“Email me” or “View CV”) or subtle background details.
  - Should feel like a refined highlight — not bright, not saturated, but quietly elevating.

Additional constraints (Swiss-style precision):
- No loud rainbow gradients or techno-neon effects.
- No heavy glows or chaotic textures.
- Use simple gradients, fine linework, and delicate shadows that respect a modular grid.
- Color usage must remain minimalist: most of the UI is monochrome; accents act as intentional, high-signal touches.
- Every colored element should feel earned, not decorative.

### 2.3 Typography

Use a typographic system that feels like Swiss editorial design:
- Headings (H1/H2/H3): Neue Haas Grotesk.
- Body: Satoshi.
- Code / mono details: JetBrains Mono.

Implement:
- H1 in hero: large but non-aggressive, e.g. text-5xl – text-7xl on desktop, scaling down gracefully on mobile.

Clear hierarchy:
- H1 (hero)
- H2 (section titles)
- H3 / labels (small uppercase, tracked out)
- Body text with comfortable line-height
- Use labels with letter-spacing (e.g. small uppercase data & ml) as section meta.
- Let the type and alignment do much of the visual work — think grid-first: consistent baselines, margins, and column structure.

### 2.4 Layout, grid, and spacing

Use a max-width container (e.g. max-w-6xl or max-w-7xl, mx-auto, generous px).

Establish a grid system:
- On desktop, think in terms of 12-column or 4-column grids.
- Use consistent vertical spacing units (e.g. multiples of 8/12/16 px).

Each section should feel like a designed spread, not a generic “card grid”:
- Asymmetric composition.
- Strong left alignment for text blocks.
- Consistent section rhythm (estimated 80–120px vertical spacing).

Fully responsive:
- Mobile: stacked, centered or left-aligned with comfortable spacing.
- Desktop: multi-column structure, considered white space.

## 3. Page structure & content (v1)

Focus on:
/ (Landing): fully realized, visually stunning, Swiss-inspired.
- Global Header & Footer as part of the layout shell.
- Future things (Work / Projects / Writing) can exist as stub links or small mentions, but the main effort goes into the landing experience.

### 3.1 Header

Minimal top navigation, aligned to the grid:
- Left: name / mark (e.g. carter daly or a simple typographic monogram).
- Right: simple links: About, Focus, Contact (scroll down to sections on the same page).
- Decide whether header is sticky or static; either way, it should feel intentional.

Hover states:
- Thin accent underline.
- Subtle color shift.
- Smooth transitions (no jarring animations).

### 3.2 Hero section

This is the statement piece.

Content:
- Small label (meta): data & ml.
- H1: pursuing models that solve impossible problems.
- Subheading (single refined sentence): Machine learning and data science for complex systems; pragmatic methods, ambitious abstractions.

CTAs:
- Primary: Email me (mailto from config).
- Secondary: Download CV or View résumé (can be a placeholder link for now).

Layout:

Desktop:
- Hero text anchored to the left in a narrow column (e.g. 4–5 columns wide).
- Right side reserved for an abstract visual / layout composition.

Mobile:
- Stacked vertically.
- Hero text remains highly legible.

Visual (right side / background):
- Design a Swiss-modern abstract composition that hints at:
  Orbits, flows, data streams, or layered grids.
- Tools: simple lines, circles, grids, and gradients — not illustrative “3D scenes.”

Use subtle motion:
- Slow drifting shapes or lines.
- Slight parallax or offset animation.
- No chaotic motion; the hero should feel calm and controlled.
- Use motion libraries (like Framer Motion) or CSS transitions, but keep it light.

### 3.3 Focus / Domains section

A section summarizing Carter’s core domains:
- Fusion modeling
- Race strategy & FastF1
- Forecasting & time-series

Design:
- On desktop: 3 columns or a structured 2x2 grid with intentional empty space.
- Each domain:
  Title.
  1–2 line description.
  Small abstract mark (simple glyph, grid fragment, or shape — no stock icons).

Hover behavior:
- Slight lift, underline, or border accent.
- Respect the Swiss minimalism (no drop shadow overload).

### 3.4 Approach / Methods section

Explain how Carter works:

Potential headings:
- Research & data
- Modeling & uncertainty
- Evaluation & iteration
- Communication & storytelling

Design it like editorial content:

Two-column layout:
- Left: meta label + headline + short intro.
- Right: structured list or short paragraphs for each method step.
- Use consistent typographic hierarchy and grids.
- This section should look like something from a well-designed design studio “Our Process” page, adapted to ML work.

### 3.5 About snippet

A compact About section:

2–3 short paragraphs describing:
- Carter’s current status (student / teaching fellow / research assistant / data analyst).
- Domains of interest (fusion, F1, forecasting).
- Orientation toward high-impact ML of the future.

Layout:
- Strong typographic styling.
- A subtle vertical rule or side label to structure the block.
- This can later expand to a dedicated About page; for now, it’s a refined snippet.

### 3.6 Contact / Footer

Contact section:
- Clear email call-to-action (Email me).
- Optional small line about what kinds of roles/opportunities are welcome.

Footer:
- Name, current year.
- Key links (GitHub, LinkedIn, email).
- Small Swiss-style closing line (e.g. designed & built by Carter Daly in small type).
- Keep it as clean and gridded as the rest of the site.

## 4. Motion & micro-interactions

Use motion to support the Swiss feel — subtle, precise, not noisy.

Entrance animations:
- Hero text and elements gently fade/slide into place with staggered timing.
- Sections below reveal as they enter viewport (small translate + opacity).

Hover micro-interactions:
- Links: thin accent underline slide-in, subtle color shift.
- Buttons: slight scale, border / background transition.
- Domain cards: minimal lift or border highlight, no wild 3D tilts.

Background motion:
- Slow movement in abstract shapes/lines, maybe simple orbiting dots.
- Must not interfere with readability or appear as a “feature demo.”

Respect prefers-reduced-motion:
- Disable or significantly tone down non-essential animations if the user requests reduced motion.
- No scroll hijacking, no janky parallax; all motion should be smooth, performant, and minimal.

## 5. Code quality & structure

As you scaffold and implement:
- Use Astro for page structure, with React components where interactivity/motion is needed.
- Create focused components:
  Header, Footer, Hero, FocusSection, ApproachSection, AboutSection, ContactSection, Layout.
- Tailwind:
  Keep class usage clean and purposeful.
  Avoid unreadable “class soup”; consider extracting reusable utility classes or using composition when patterns repeat.
- Clean out dead code and unused styles (if any).
- Ensure the site builds successfully, runs smoothly, and is fully responsive.

## 6. Constraints & what NOT to do

- Do not import a generic UI kit (MUI, Chakra, etc.) or anything that makes it look like a SaaS dashboard.
- Do not use stock imagery, cliché tech icons, or generic illustrations.
- Do not wire up full project pages or blog systems yet; keep them as future extensions.
- Do not overload with gradients or animations; Swiss design thrives on restraint.

## 7. Target outcome

When you’re done, the landing page should:
- Look like it was designed by a top Swiss-inspired UI/UX designer who deeply understands modern web aesthetics.
- Communicate Carter’s identity and focus in one glance.
- Feel polished enough that Anthropic / DeepMind / top labs would be impressed by both the taste and clarity.
- Be something that can sit confidently alongside the best examples in developer-portfolios and designer-portfolios.

Now, in this fresh repo, set up the Astro + React + Tailwind project, define the design system, and implement this landing page and layout shell end-to-end. Add brief comments only where they clarify key design decisions.
