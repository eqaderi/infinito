/* =========================================================
 * Animation primitives — Phase 1A
 *
 * Thin wrappers around GSAP 3 + ScrollTrigger that replace
 * the legacy ScrollMagic + TweenMax + bounty + odometer stack
 * the original template used.
 *
 * Usage in markup (data-driven, no class soup):
 *   <h2 data-anim="slide-up">…</h2>
 *   <p data-anim="slide-up" data-anim-delay="0.3">…</p>
 *   <div data-anim="fade-up" data-anim-delay="0.5">…</div>
 *   <div data-anim="rotate-in">…</div>
 *   <div data-anim="parallax-bg" data-anim-strength="0.4">…</div>
 *   <div data-anim="odometer" data-anim-end="9235">9235</div>
 *   <svg data-anim="svg-draw">…</svg>
 *   <p data-anim="cover-transp" data-anim-delay="0.3">…</p>
 *
 * Intro (one-shot, fires on load — no scroll trigger):
 *   <div data-anim="intro-up" data-anim-delay="0.3">…</div>
 *   <div data-anim="intro-down">…</div>
 *
 * Reduced motion: every primitive bails to a no-op and elements
 * are immediately revealed (CSS handles this via the
 * `:where([data-anim])` selector in `global.css`).
 * ========================================================= */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";

let registered = false;
let mounted = false;

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function num(el: Element, attr: string, fallback: number): number {
  const raw = el.getAttribute(attr);
  if (raw == null || raw === "") return fallback;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

function reveal(el: Element): void {
  el.setAttribute("data-anim-shown", "");
}

/* ---------- primitives ---------- */

/* One-shot scroll reveals (slide-up, fade-up, fade-in, rotate-in, cover-up).
 *
 * These are plain transform/opacity (and clip-path for cover-up) reveals that
 * CSS does natively on the compositor — see the matching transition rules in
 * global.css. A single IntersectionObserver replaces what used to be ~64
 * individual ScrollTriggers: when an element scrolls into view we flip
 * [data-anim-shown] (CSS transitions to the end state) and stop observing it.
 *
 * data-anim-delay (seconds) maps to transition-delay. The -12% bottom root
 * margin approximates the legacy "top ~85%" trigger point. */
const REVEAL_SELECTOR =
  '[data-anim="slide-up"], [data-anim="fade-up"], [data-anim="fade-in"], [data-anim="rotate-in"], [data-anim="cover-up"]';

export function registerReveals(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
  if (els.length === 0) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = num(el, "data-anim-delay", 0);
        if (delay > 0) el.style.transitionDelay = `${delay}s`;
        reveal(el);
        obs.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -12% 0px" },
  );

  els.forEach((el) => io.observe(el));
}

export function registerParallaxBg(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>('[data-anim="parallax-bg"]');
  els.forEach((el) => {
    const strength = num(el, "data-anim-strength", 0.35);
    const target = el.querySelector<HTMLElement>("[data-parallax-el]") ?? el;
    // Scoped GPU hint: only the handful of scrub-driven elements get a layer,
    // not every [data-anim] on the page.
    target.style.willChange = "transform";
    gsap.fromTo(
      target,
      { yPercent: -strength * 50 },
      {
        yPercent: strength * 50,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

/* Scroll-scrubbed Y translate. Use on element. Optional inverted direction
 * via data-anim-direction="down". Strength is the px range (default 80). */
export function registerParallaxY(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>('[data-anim="parallax-y"]');
  els.forEach((el) => {
    const strength = num(el, "data-anim-strength", 80);
    const dir = el.getAttribute("data-anim-direction") === "down" ? 1 : -1;
    reveal(el);
    el.style.willChange = "transform";
    gsap.fromTo(
      el,
      { y: -dir * strength * 0.5 },
      {
        y: dir * strength * 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

export function registerOdometer(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>('[data-anim="odometer"]');
  els.forEach((el) => {
    const end = num(
      el,
      "data-anim-end",
      parseFloat(el.textContent ?? "0") || 0,
    );
    const duration = num(el, "data-anim-duration", 2);
    const obj = { v: 0 };
    let last = -1;
    el.textContent = "0";
    reveal(el);
    gsap.to(obj, {
      v: end,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        const rounded = Math.round(obj.v);
        if (rounded === last) return;
        last = rounded;
        el.textContent = rounded.toLocaleString();
      },
    });
  });
}

export function registerSvgDraw(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<SVGElement>('[data-anim="svg-draw"]');
  els.forEach((svg) => {
    const paths = svg.querySelectorAll<SVGGeometryElement>(
      "path, line, polyline, polygon, circle, rect",
    );
    if (paths.length === 0) return;

    // Filled glyphs (data-anim-fill) draw the outline, then fade the fill in —
    // the legacy DrawSVG behaviour. Stroked icons (no data-anim-fill) just draw.
    const filled = svg.hasAttribute("data-anim-fill");
    const duration = num(svg, "data-anim-duration", 1.4);
    const stagger = num(svg, "data-anim-stagger", 0.05);

    gsap.set(paths, { drawSVG: "0%" });
    if (filled) gsap.set(paths, { fillOpacity: 0 });
    reveal(svg);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    tl.to(paths, { drawSVG: "100%", duration, ease: "power2.out", stagger });
    if (filled) {
      tl.to(
        paths,
        { fillOpacity: 1, duration: 0.8, ease: "power1.out" },
        "-=0.5",
      );
    }
  });
}

/* ---------- pricing toggle count-up ---------- */

export function registerPricingToggle(scope: ParentNode = document): void {
  const section = (scope as Document).querySelector<HTMLElement>(
    "[data-pricing-section]",
  );
  if (!section) return;

  section.addEventListener("pricing:billing", (e: Event) => {
    const { billing } = (e as CustomEvent<{ billing: string }>).detail;
    if (billing !== "yearly") return;

    const els = section.querySelectorAll<HTMLElement>("[data-yearly-price]");
    els.forEach((el) => {
      const end = parseFloat(el.dataset.yearlyPrice ?? "0");
      if (reducedMotion()) {
        el.textContent = end.toLocaleString();
        return;
      }
      const obj = { v: 0 };
      let last = -1;
      el.textContent = "0";
      gsap.to(obj, {
        v: end,
        duration: 1,
        ease: "power2.out",
        onUpdate() {
          const r = Math.round(obj.v);
          if (r === last) return;
          last = r;
          el.textContent = r.toLocaleString();
        },
        onComplete() {
          el.textContent = end.toLocaleString();
        },
      });
    });
  });
}

/* ---------- cover reveals ---------- */

/* Horizontal clip-path wipe (left → right) with a subtle content
 * scale/shift settle. Replaces the legacy overlay-div approach. */
export function registerCoverDR(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>(
    '[data-anim="cover-d-r-img"]',
  );
  els.forEach((el) => {
    const delay = num(el, "data-anim-delay", 0);
    const content = el.querySelector<HTMLElement>(
      "img, video, [data-cover-content]",
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        toggleActions: "play none none none",
      },
      onStart: () => reveal(el),
      delay,
    });

    tl.fromTo(
      el,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.out" },
      0,
    );

    if (content) {
      tl.fromTo(
        content,
        { scale: 1.15, x: "-5%" },
        { scale: 1, x: "0%", duration: 0.8, ease: "power3.out" },
        0,
      );
    }
  });
}

/* ---------- per-line text reveal ---------- */

/* `cover-transp` — the legacy `slide-up2__lines cover-transp` effect: text is
 * split into lines, each line wipes up from inside its own clip mask, staggered
 * top→bottom on scroll into view. Motion spec (from Final_Files/js/scripts.js
 * cover_animation `.slide-up2`): content starts 100% below its mask, 0.6s per
 * line, 0.1s stagger, power3.out. See docs/baseline/cover-transp/.
 *
 * SplitText `mask:"lines"` gives each line an overflow-clip wrapper — that IS
 * the transparent cover. autoSplit + an animation returned from onSplit means
 * GSAP re-splits and rebuilds the reveal on resize / late font load, so line
 * wraps never go stale. */
export function registerCoverTransp(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>(
    '[data-anim="cover-transp"]',
  );
  els.forEach((el) => {
    const delay = num(el, "data-anim-delay", 0);
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      // Default <div> wrappers (block-level) are required: yPercent transforms
      // no-op on inline <span>s, which would break the wipe. The divs are
      // injected client-side, so the source <p> markup stays valid.
      linesClass: "cover-transp__line",
      // Leave the split spans natively in the a11y tree: aria:"auto" would put
      // an aria-label on the <p>, which is a prohibited attribute there.
      aria: "none",
      autoSplit: true,
      onSplit: (self) => {
        const tween = gsap.from(self.lines, {
          yPercent: 100,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
        // Reveal only after the from-state is set, so the gated paragraph
        // never flashes its full text before the lines are clipped.
        reveal(el);
        return tween;
      },
    });
  });
}

/* ---------- entry point ---------- */

export function mount(scope: ParentNode = document): void {
  if (mounted) return;
  mounted = true;

  if (reducedMotion()) {
    document.querySelectorAll("[data-anim]").forEach((el) => reveal(el));
    return;
  }

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);
    registered = true;
  }

  registerReveals(scope);
  registerParallaxBg(scope);
  registerParallaxY(scope);
  registerCoverDR(scope);
  registerCoverTransp(scope);
  registerOdometer(scope);
  registerSvgDraw(scope);
  registerPricingToggle(scope);

  ScrollTrigger.refresh();
}
