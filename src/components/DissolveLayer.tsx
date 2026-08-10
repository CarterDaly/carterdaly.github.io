import { useEffect, useRef } from "react";

/**
 * Site-wide cursor dissolve.
 *
 * Two surfaces share one pointer:
 *
 *   - The white dot is a fixed-position <div> updated *directly* in the
 *     pointermove handler via a CSS transform. No RAF, no smoothing — the
 *     dot rides the raw pointer 1:1, so hit-testing (clicks, hovers) lands
 *     exactly where the dot appears.
 *
 *   - The dissolve filter reads a *smoothed* pointer position, written once
 *     per RAF tick. The lag is what produces the trail/reassembly feeling.
 *
 * Two lens-targeting modes, chosen by what the page marks up:
 *
 *   - Single host (.dissolve-host): the element's whole subtree is one
 *     filtered surface. The landing page uses this so the effect covers
 *     everything.
 *
 *   - Per-element targets (.dissolve-target): each marked element gets its
 *     OWN cloned filter instance, driven by the same cursor. A CSS filter
 *     always includes an element's entire subtree, so cloning per element is
 *     the only way to dissolve several separate big-type elements while the
 *     small reading text between them stays outside any filter. Project pages
 *     use this. Each target's filter is switched on only while the cursor is
 *     near it, so many targets don't all run the filter every frame.
 *
 * Reduced-motion / touch / no-hover users skip the whole island.
 */

const CURSOR_DOT_RADIUS = 5.5; // Tuned to visually match the feImage circle in the SVG filter
const CURSOR_DOT_DIAMETER = CURSOR_DOT_RADIUS * 2;

// How close (px) the smoothed cursor must get to a target's box before its
// filter is switched on. Covers the feImage disc radius plus the maximum
// displacement, so the lens is never clipped as it enters the element.
const TARGET_ACTIVATE_MARGIN = 80;

type LensUnit = {
  el: HTMLElement;
  feImage: Element;
  filterId: string;
  isHost: boolean;
  active: boolean;
};

export default function DissolveLayer() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    if (reducedMotion || coarsePointer || noHover) return;

    const remixImg = document.getElementById("remix-cursor-img");
    const dot = dotRef.current;
    const host = document.querySelector<HTMLElement>(".dissolve-host");
    const targetEls = Array.from(document.querySelectorAll<HTMLElement>(".dissolve-target"));
    // Needs the shared filter template, the dot, and at least one thing to
    // dissolve (a whole-page host or per-element targets).
    if (!remixImg || !dot || (!host && targetEls.length === 0)) return;

    // Inline cursor value. Uses a 32×32 transparent SVG as the primary cursor
    // (browsers accept it cross-browser; `cursor: none` alone can be momentarily
    // dropped during focus transitions). The `!important` is set via
    // setProperty's third argument — it beats any stylesheet rule, no matter
    // how specific or how many !importants it has, since inline + !important
    // is the top of the cascade.
    const TRANSPARENT_CURSOR =
      "url(\"data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2732%27%20height%3D%2732%27%3E%3C%2Fsvg%3E\") 16 16, none";

    const applyCursorHiding = () => {
      const html = document.documentElement;
      if (!html.classList.contains("dissolve-active")) html.classList.add("dissolve-active");
      html.style.setProperty("cursor", TRANSPARENT_CURSOR, "important");
      document.body.style.setProperty("cursor", TRANSPARENT_CURSOR, "important");
    };

    applyCursorHiding();

    // The feImage's box defines where in the filter region the cursor disc
    // lands. Reading width/height directly avoids hardcoding a constant that
    // can drift if the SVG is tuned.
    const remixHalfW = parseFloat(remixImg.getAttribute("width") || "0") / 2;
    const remixHalfH = parseFloat(remixImg.getAttribute("height") || "0") / 2;

    // Build the lens units. The host (if present) reuses the shared template
    // filter and its feImage. Each target gets a private deep clone of the
    // filter with a unique feImage id so its lens position is independent.
    const units: LensUnit[] = [];
    if (host) {
      units.push({ el: host, feImage: remixImg, filterId: "dissolve-remix", isHost: true, active: true });
    }
    const filterTemplate = remixImg.closest("filter");
    const defs = filterTemplate?.parentNode ?? null;
    if (filterTemplate && defs) {
      targetEls.forEach((el, i) => {
        const filterId = `dissolve-remix-t${i}`;
        const clone = filterTemplate.cloneNode(true) as Element;
        clone.setAttribute("id", filterId);
        const feImgNode = clone.querySelector("feImage");
        if (!feImgNode) return;
        feImgNode.setAttribute("id", `remix-cursor-img-t${i}`);
        feImgNode.setAttribute("x", "-9999");
        feImgNode.setAttribute("y", "-9999");
        defs.appendChild(clone);
        units.push({ el, feImage: feImgNode, filterId, isHost: false, active: false });
      });
    }

    let targetX = -9999;
    let targetY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let firstMove = true;

    const moveDot = (x: number, y: number) => {
      // translate3d forces the dot onto its own compositor layer so updates
      // bypass layout/paint.
      dot.style.transform = `translate3d(${x - CURSOR_DOT_RADIUS}px, ${y - CURSOR_DOT_RADIUS}px, 0)`;
    };

    // Cheap idempotent guard called from pointermove. Skips the setProperty
    // calls entirely when the class is still attached — avoids the per-frame
    // style-attribute churn that was triggering MutationObserver callbacks and
    // adding input lag.
    const ensureActiveClass = () => {
      if (!document.documentElement.classList.contains("dissolve-active")) {
        applyCursorHiding();
      }
    };

    // Force-flush cursor styling. When the browser defers cursor recomputation
    // (the bug we keep hitting on link hover-out, header-boundary crosses, and
    // window-focus return), a plain setProperty re-apply doesn't take effect
    // until the next event. The pattern that *does* work is: write the cursor,
    // force a synchronous style recalc by reading offsetWidth, then write it
    // again. The reflow read between the two writes drains the browser's style
    // queue so the second write lands cleanly on the current paint.
    //
    // RAF-throttled: multiple kicks within a frame collapse into one reflow,
    // so calling this on every pointerover is still cheap.
    let kickPending = false;
    const kickCursor = () => {
      if (kickPending) return;
      kickPending = true;
      requestAnimationFrame(() => {
        kickPending = false;
        applyCursorHiding();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        void document.documentElement.offsetWidth;
        applyCursorHiding();
      });
    };

    const trackPointer = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (firstMove) {
        smoothX = targetX;
        smoothY = targetY;
        firstMove = false;
      }
      moveDot(targetX, targetY);
      dot.style.opacity = "1";
      ensureActiveClass();
    };

    const onPointerMove = (e: PointerEvent) => trackPointer(e);
    // pointerenter carries the entry-point clientX/Y — using it positions the
    // dot at the cursor *before* any pointermove fires, so there's no window
    // where the OS cursor could show through at the old dot position.
    const onPointerEnter = (e: PointerEvent) => trackPointer(e);

    // pointerleave = cursor actually crossed the viewport boundary. Reset
    // target so the next entry starts fresh.
    const onPointerLeave = () => {
      targetX = -9999;
      targetY = -9999;
      dot.style.opacity = "0";
    };

    // blur = window lost focus (URL bar, tab switch, devtools, etc.). The
    // cursor may *still* be inside the viewport rectangle, so we don't reset
    // target — we just hide the dot. On focus return we re-show it at the
    // preserved position.
    const onWindowBlur = () => {
      dot.style.opacity = "0";
    };

    const onWindowFocus = () => {
      ensureActiveClass();
      kickCursor();
      if (targetX > -1000) {
        moveDot(targetX, targetY);
        dot.style.opacity = "1";
      }
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        ensureActiveClass();
        kickCursor();
        if (targetX > -1000) {
          moveDot(targetX, targetY);
          dot.style.opacity = "1";
        }
      }
    };

    // Track whether the pointer is currently inside .dissolve-host. The
    // boundary between the unfiltered header and the filtered dissolve-host
    // is the spot where the cursor reappears (different stacking contexts,
    // browser defers the cursor recompute). Only relevant in host mode; the
    // per-target pages have no such large filtered region to cross.
    let wasInHost = false;

    const onPointerOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && el.style) {
        el.style.setProperty("cursor", TRANSPARENT_CURSOR, "important");
      }
      if (host) {
        const inHost = el instanceof Node && host.contains(el);
        if (inHost !== wasInHost) {
          wasInHost = inHost;
          kickCursor();
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerenter", onPointerEnter);
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("focus", onWindowFocus);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);

    let raf = 0;
    const damp = 0.22;
    const tick = () => {
      smoothX += (targetX - smoothX) * damp;
      smoothY += (targetY - smoothY) * damp;

      // Rects are read live each frame (in viewport space, same as the
      // cursor), so scrolling and layout shifts — e.g. the models accordion
      // opening — keep every lens aligned without extra bookkeeping.
      for (const u of units) {
        const rect = u.el.getBoundingClientRect();
        if (!u.isHost) {
          const near =
            smoothX >= rect.left - TARGET_ACTIVATE_MARGIN &&
            smoothX <= rect.right + TARGET_ACTIVATE_MARGIN &&
            smoothY >= rect.top - TARGET_ACTIVATE_MARGIN &&
            smoothY <= rect.bottom + TARGET_ACTIVATE_MARGIN;
          if (near !== u.active) {
            u.active = near;
            u.el.style.setProperty("filter", near ? `url(#${u.filterId})` : "none");
          }
          if (!near) continue;
        }
        u.feImage.setAttribute("x", (smoothX - rect.left - remixHalfW).toFixed(1));
        u.feImage.setAttribute("y", (smoothY - rect.top - remixHalfH).toFixed(1));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerenter", onPointerEnter);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("focus", onWindowFocus);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Tear down per-target filters and their inline styles.
      for (const u of units) {
        if (u.isHost) continue;
        u.el.style.removeProperty("filter");
        document.getElementById(u.filterId)?.remove();
      }
      document.documentElement.classList.remove("dissolve-active");
      document.documentElement.style.removeProperty("cursor");
      document.body.style.removeProperty("cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="dissolve-dot"
      aria-hidden="true"
      style={{
        width: `${CURSOR_DOT_DIAMETER}px`,
        height: `${CURSOR_DOT_DIAMETER}px`,
        transform: "translate3d(-9999px, -9999px, 0)",
        opacity: 0,
      }}
    />
  );
}
