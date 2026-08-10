/**
 * Case-study SCAFFOLD — shared placeholder + build guide for project detail pages.
 *
 * Renders an intentional, on-brand "in progress" masthead so anyone who reaches
 * /work/<project> directly meets considered design, not a broken page. It is
 * deliberately NOT populated. Each project gets built out into its own real
 * component (like NixtlaCaseStudy.tsx) following the guide below, then the route
 * swaps <CaseStudyScaffold/> for that component.
 *
 * ═══ HOW TO BUILD A PROJECT PAGE OUT ═══════════════════════════════════════
 *
 * 1) RESPONSIVE SYSTEM — non-negotiable (see the `responsive-scaling-system`
 *    memory and src/styles/global.css). The whole site zooms via a
 *    viewport-scaled root font-size (`clamp(15px, 1.05vw, 26px)`) with rem
 *    everywhere, so:
 *      • Author EVERY font-size in rem, never px  →  text-[0.75rem], NOT text-[12px].
 *        (12px→0.75rem, 15px→0.9375rem, 19px→1.1875rem … i.e. px ÷ 16.)
 *      • Use Tailwind's rem spacing scale (px-6, gap-8, py-28…) and rem/ch
 *        measures (max-w-[40ch], max-w-2xl). These scale automatically.
 *      • Keep 1px borders / hairlines in px — they should stay crisp.
 *      • Frame content with `.max-grid` + the `px-6 sm:px-10 md:px-12 lg:px-16`
 *        gutters, exactly like NixtlaCaseStudy. The container scales itself.
 *      • Big headings can keep an inline `clamp()` (e.g. clamp(2.9rem, 7vw, 6rem));
 *        its rem caps ride the zoom, the vw term handles mobile.
 *
 * 2) CONSISTENT WITH — NOT A COPY OF — the forecasting pane
 *    (src/components/work/NixtlaCaseStudy.tsx). Share the visual LANGUAGE,
 *    diverge on CONTENT and section shape:
 *      • SHARE the type roles: editorial grotesque (var(--font-display)) is the
 *        dominant voice for the masthead, folio numbers, and tracked-caps
 *        section markers; Satoshi (body) is the reading voice; JetBrains Mono
 *        (var(--font-mono)) appears ONLY as a sparing technical accent (a
 *        stack/credits line, method or metric names).
 *      • SHARE the structure devices: hairlines, big folio numbers ("01"…), and
 *        whitespace. NEVER boxes, chips, tag-pills, or box-and-arrow diagrams.
 *        One accent color, used with restraint.
 *      • SHARE the arc: recruiter-skim header (title, value prop, a couple of
 *        credit lines, CTA) → hiring-manager depth below. Reuse the LIVE_APP_URL
 *        / SOURCE_URL constant pattern for the CTA (empty LIVE_APP_URL → a
 *        secondary CTA, populated → a launch button — see NixtlaCaseStudy).
 *      • SHARE the primitives: Marker / Reveal / TextLink live inline in
 *        NixtlaCaseStudy today. When you build the second page, lift those three
 *        (+ the EASE constant) into a small shared module and import them from
 *        both pages, so they can never drift. (They're intentionally duplicated
 *        in THIS scaffold's masthead to avoid touching the working NixTLA page.)
 *      • DO NOT COPY the section list. NixTLA's (problem → model families →
 *        workflow → the app → architecture) fits a forecasting TOOL. Each
 *        project needs its own sections that fit ITS story — see the per-project
 *        notes in the matching src/pages/work/*.astro route file.
 *      • Copy rules everywhere: NO em dashes; Swiss restraint (tight labels, no
 *        on-the-nose hiring language); every section must justify its place;
 *        screenshot + self-critique each pass. Bar = isabelmoranta.com et al.
 *        (see the `design-quality-references` memory).
 *
 * 3) DISSOLVE CURSOR — project pages use per-element targets: add the class
 *    "dissolve-target" to the big type the cursor lens should hit (headline,
 *    section-defining statements). Small reading text stays outside any filter.
 *    Do NOT put `.dissolve-host` on the route wrapper — that is the landing
 *    page's whole-page mode. (See the `nixtla-project-page` memory.)
 *
 * 4) WIRE IT UP — when the page is real, add this project's `href` to its card
 *    in src/components/sections/Output.tsx (there's a comment there). Until then
 *    the card stays non-clickable so unfinished pages aren't shown to visitors;
 *    preview via the direct URL.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  /** Folio number matching the project's card position, e.g. "01". */
  index: string;
  /** Tracked-caps kicker above the headline, e.g. "Fusion modeling". */
  eyebrow: string;
  /** Masthead headline (placeholder text is fine while unpopulated). */
  title: string;
  /** One-sentence value proposition placeholder. */
  standfirst: string;
};

export function CaseStudyScaffold({ index, eyebrow, title, standfirst }: Props) {
  const rm = useReducedMotion();
  return (
    <article className="grain-panel bg-[var(--color-bg)]">
      <div className="max-grid px-6 sm:px-10 md:px-12 lg:px-16 pt-28 md:pt-32 pb-28">
        <motion.p
          className="text-[0.75rem] uppercase tracking-[0.28em] mb-9"
          style={{ fontFamily: "var(--font-display)", color: "var(--accent-tertiary)", fontWeight: 500 }}
          initial={rm ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        {/* dissolve-target: the cursor lens hits the headline; reading text stays crisp. */}
        <motion.h1
          className="dissolve-target max-w-[16ch]"
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
          {title}
        </motion.h1>

        <motion.p
          className="mt-10 text-[1.1875rem] md:text-[1.3125rem] leading-[1.55] max-w-[40ch]"
          style={{ color: "var(--color-text)" }}
          initial={rm ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        >
          {standfirst}
        </motion.p>

        {/* In-progress marker (mirrors NixtlaCaseStudy's <Marker/>). Replace this
            whole block, and everything above it, with the real sections. */}
        <div className="mt-24 flex items-baseline gap-5">
          <span className="text-[0.75rem]" style={{ fontFamily: "var(--font-display)", color: "var(--accent-secondary)", fontWeight: 500 }}>
            {index}
          </span>
          <span className="text-[0.75rem] uppercase tracking-[0.26em]" style={{ fontFamily: "var(--font-display)", color: "var(--accent-tertiary)", fontWeight: 500 }}>
            Case study in progress
          </span>
          <span className="h-px flex-1 translate-y-[-2px]" style={{ background: "rgba(216,207,196,0.16)" }} />
        </div>
      </div>
    </article>
  );
}
