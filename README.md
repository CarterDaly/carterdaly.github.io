# Carter Daly — Swiss-inspired ML Portfolio

Live site: https://carterdaly.github.io

This is the source for Carter Daly’s personal site — a Swiss modernist, Astro + React + Tailwind build showcasing ML work across fusion modeling, race strategy, and forecasting. The focus is on a disciplined grid, restrained color, and clear hierarchy.

## Stack
- Astro with React islands
- Tailwind CSS (utility-first, minimal custom CSS)
- Framer Motion for subtle motion

## Project Structure
```text
/
├── public/                # Static assets
├── src/
│   ├── components/        # UI building blocks and sections
│   ├── layouts/           # Base layout shell
│   ├── pages/             # Astro pages
│   └── styles/            # Global styles and tokens
└── package.json
```

## Commands
Run from the project root:

| Command         | Action                                      |
| :-------------- | :------------------------------------------ |
| `npm install`   | Install dependencies                        |
| `npm run dev`   | Start local dev server (default: 4321)      |
| `npm run build` | Build the production site to `./dist/`      |
| `npm run preview` | Preview the production build locally      |

## Design Notes
- Color palette from `src/styles/global.css`: dark base, off-white text, accent green (`--accent-primary`), oxblood red (`--accent-secondary`), warm neutral (`--accent-tertiary`).
- Typography: Neue Haas Grotesk for headings, Satoshi for body, JetBrains Mono for code details.
- Layout: max-width grid, generous spacing, minimal chrome.
