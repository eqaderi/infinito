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

export function registerSlideUp(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>('[data-anim="slide-up"]');
  els.forEach((el) => {
    const delay = num(el, "data-anim-delay", 0);
    gsap.fromTo(
      el,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay,
        ease: "power3.out",
        onStart: () => reveal(el),
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  });
}

export function registerFadeUp(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>(
    '[data-anim="fade-up"], [data-anim="fade-in"]',
  );
  els.forEach((el) => {
    const isFadeIn = el.getAttribute("data-anim") === "fade-in";
    const delay = num(el, "data-anim-delay", 0);
    gsap.fromTo(
      el,
      { y: isFadeIn ? 0 : 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: "power2.out",
        onStart: () => reveal(el),
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      },
    );
  });
}

export function registerRotateIn(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>('[data-anim="rotate-in"]');
  els.forEach((el) => {
    const delay = num(el, "data-anim-delay", 0);
    gsap.fromTo(
      el,
      { scale: 0.85, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        delay,
        ease: "back.out(1.4)",
        onStart: () => reveal(el),
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  });
}

export function registerParallaxBg(scope: ParentNode = document): void {
  const els = scope.querySelectorAll<HTMLElement>('[data-anim="parallax-bg"]');
  els.forEach((el) => {
    const strength = num(el, "data-anim-strength", 0.35);
    const target = el.querySelector<HTMLElement>("[data-parallax-el]") ?? el;
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
        el.textContent = Math.round(obj.v).toLocaleString();
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

    const lengths: number[] = [];
    paths.forEach((p) => {
      const len =
        typeof p.getTotalLength === "function" ? p.getTotalLength() : 0;
      lengths.push(len);
      if (len > 0) {
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      }
    });
    reveal(svg);

    const duration = num(svg, "data-anim-duration", 1.4);
    const stagger = num(svg, "data-anim-stagger", 0.05);

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration,
      ease: "power2.out",
      stagger,
      scrollTrigger: {
        trigger: svg,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });
}

/* ---------- intros (one-shot, no scroll) ---------- */

export function mountIntro(scope: ParentNode = document): void {
  const ups = scope.querySelectorAll<HTMLElement>('[data-anim="intro-up"]');
  ups.forEach((el) => {
    const delay = num(el, "data-anim-delay", 0);
    gsap.fromTo(
      el,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        delay,
        ease: "power3.out",
        onStart: () => reveal(el),
      },
    );
  });

  const downs = scope.querySelectorAll<HTMLElement>('[data-anim="intro-down"]');
  downs.forEach((el) => {
    const delay = num(el, "data-anim-delay", 0);
    gsap.fromTo(
      el,
      { y: -28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay,
        ease: "power3.out",
        onStart: () => reveal(el),
      },
    );
  });

  const fades = scope.querySelectorAll<HTMLElement>('[data-anim="intro-fade"]');
  fades.forEach((el) => {
    const delay = num(el, "data-anim-delay", 0);
    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        delay,
        ease: "power1.out",
        onStart: () => reveal(el),
      },
    );
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
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  mountIntro(scope);
  registerSlideUp(scope);
  registerFadeUp(scope);
  registerRotateIn(scope);
  registerParallaxBg(scope);
  registerParallaxY(scope);
  registerOdometer(scope);
  registerSvgDraw(scope);

  ScrollTrigger.refresh();
}
