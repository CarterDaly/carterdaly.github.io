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
 *   - The dissolve filter (#dissolve-remix) reads a *smoothed* pointer
 *     position, written once per RAF tick. The lag is what produces the
 *     trail/reassembly feeling — areas behind a moving cursor briefly
 *     stay scrambled before the smoothed point catches up.
 *
 * Reduced-motion / touch / no-hover users skip the whole island.
 */

const CURSOR_DOT_RADIUS = 5.5; // Tuned to visually match the feImage circle in the SVG filter
const CURSOR_DOT_DIAMETER = CURSOR_DOT_RADIUS * 2;

export default function DissolveLayer() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    if (reducedMotion || coarsePointer || noHover) return;

    const remixImg = document.getElementById("remix-cursor-img");
    const dissolveHost = document.querySelector<HTMLElement>(".dissolve-host");
    const dot = dotRef.current;
    if (!remixImg || !dissolveHost || !dot) return;

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

    // The filter's user space is .dissolve-host's local box (origin at its
    // top-left). Since the host sits below the sticky header, we have to
    // subtract its document offset from the cursor position before writing
    // the feImage x/y — otherwise the lens lands `headerHeight` px below
    // where it should. Recomputed on resize; scroll doesn't shift the host's
    // document position so doesn't need to refresh this.
    let hostDocLeft = 0;
    let hostDocTop = 0;
    const updateHostOffset = () => {
      const rect = dissolveHost.getBoundingClientRect();
      hostDocLeft = rect.left + window.scrollX;
      hostDocTop = rect.top + window.scrollY;
    };
    updateHostOffset();

    let targetX = -9999;
    let targetY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let firstMove = true;
    let scrollX = window.scrollX;
    let scrollY = window.scrollY;

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
    // preserved position, closing the window during which the OS cursor would
    // otherwise be the only visual at the pointer's location.
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

    const onScroll = () => {
      scrollX = window.scrollX;
      scrollY = window.scrollY;
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
    // browser defers the cursor recompute). We only kick on the actual
    // boundary cross — usually twice per header trip — so the reflow is
    // invisible instead of running on every element transition.
    let wasInHost = false;

    const onPointerOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && el.style) {
        el.style.setProperty("cursor", TRANSPARENT_CURSOR, "important");
      }
      const inHost = el instanceof Node && dissolveHost.contains(el);
      if (inHost !== wasInHost) {
        wasInHost = inHost;
        kickCursor();
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerenter", onPointerEnter);
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("focus", onWindowFocus);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateHostOffset);
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Catch layout shifts (font load, lazy-mounted islands) that move the
    // host's document top after initial measurement.
    const hostObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateHostOffset) : null;
    hostObserver?.observe(dissolveHost);

let raf = 0;
    const tick = () => {
      const damp = 0.22;
      smoothX += (targetX - smoothX) * damp;
      smoothY += (targetY - smoothY) * damp;

      // Cursor → host-local coords: (clientXY + scroll) − host's document offset
      const localX = smoothX + scrollX - hostDocLeft;
      const localY = smoothY + scrollY - hostDocTop;
      remixImg.setAttribute("x", (localX - remixHalfW).toFixed(1));
      remixImg.setAttribute("y", (localY - remixHalfH).toFixed(1));

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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateHostOffset);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      hostObserver?.disconnect();
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
