/* =========================================================
 * Carousels — Swiper-backed sliders (Phase 1B)
 *
 * One library for every slider in the product. Each mount* function
 * finds its container by a data-* hook and inits a scoped Swiper.
 * Mounted from BaseLayout regardless of reduced motion — a carousel
 * is navigation, not decorative motion. Under reduced motion the
 * transition duration is zeroed so slides swap instantly.
 * ========================================================= */

import Swiper from "swiper";
import { Navigation, Pagination, Keyboard, A11y, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function mountTestimonials(scope: ParentNode): void {
  const el = scope.querySelector<HTMLElement>("[data-testimonials]");
  if (!el) return;

  const prevEl = el.querySelector<HTMLElement>('[data-nav="prev"]');
  const nextEl = el.querySelector<HTMLElement>('[data-nav="next"]');
  const paginationEl = el.querySelector<HTMLElement>("[data-pagination]");

  new Swiper(el, {
    modules: [Navigation, Pagination, Keyboard, A11y, EffectFade],
    effect: "fade",
    fadeEffect: { crossFade: true },
    speed: reducedMotion() ? 0 : 600,
    spaceBetween: 0,
    keyboard: { enabled: true },
    navigation: { prevEl, nextEl },
    pagination: {
      el: paginationEl,
      clickable: true,
      bulletElement: "button",
    },
    a11y: {
      // Match the section's voice so Swiper doesn't relabel our controls
      // with the generic "Next slide" — the contract addresses these by label.
      prevSlideMessage: "Previous testimonial",
      nextSlideMessage: "Next testimonial",
    },
  });
}

function mountProcess(scope: ParentNode): void {
  const root = scope.querySelector<HTMLElement>("[data-process]");
  if (!root) return;

  const sliderEl = root.querySelector<HTMLElement>("[data-process-slider]");
  if (!sliderEl) return;

  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
  const fill = root.querySelector<HTMLElement>("[data-progress-fill]");
  const count = steps.length;

  // Single source of truth: Swiper's activeIndex. The timeline (dots, labels,
  // progress line) is derived state recomputed on every change.
  const render = (i: number) => {
    if (fill) {
      const pct = count > 1 ? (i / (count - 1)) * 100 : 0;
      // -0.75rem offsets the track so the fill lands on the dot centers.
      fill.style.width = `calc((100% - 0.75rem) * ${pct} / 100)`;
    }
    steps.forEach((btn, idx) => {
      const dot = btn.querySelector<HTMLElement>("[data-dot]");
      const label = btn.querySelector<HTMLElement>("[data-label]");
      btn.toggleAttribute("data-active", idx === i);
      dot?.toggleAttribute("data-filled", idx <= i);
      label?.toggleAttribute("data-active", idx === i);
    });
  };

  const swiper = new Swiper(sliderEl, {
    modules: [Keyboard, A11y],
    speed: reducedMotion() ? 0 : 500,
    autoHeight: true,
    keyboard: { enabled: true },
    on: {
      init: (s) => render(s.activeIndex),
      slideChange: (s) => render(s.activeIndex),
    },
  });

  steps.forEach((btn, idx) =>
    btn.addEventListener("click", () => swiper.slideTo(idx)),
  );
}

export function mountCarousels(scope: ParentNode = document): void {
  mountTestimonials(scope);
  mountProcess(scope);
}
