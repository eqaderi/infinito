/* =========================================================
 * Lightbox — PhotoSwipe v5 (Phase 1B)
 *
 * PhotoSwipe needs each slide's width/height up front. Our buyer data
 * contract carries only an image path (no dimensions), so we resolve
 * them at runtime from the thumbnail's natural size via `gettingData`,
 * with a non-zero fallback so an image that hasn't decoded yet still
 * opens. Because dimensions can be approximate, the open/close uses the
 * `fade` transition (no thumb→full geometric zoom that would betray a
 * wrong ratio). Core is dynamically imported so it only ships on open.
 * ========================================================= */

import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Fallback dimensions for an image whose thumbnail hasn't decoded yet —
// generous so PhotoSwipe never opens with a zero-sized (broken) slide.
const FALLBACK_W = 1600;
const FALLBACK_H = 1067;

function mountPortfolio(scope: ParentNode): void {
  const gallery = scope.querySelector<HTMLElement>("[data-lightbox-gallery]");
  if (!gallery) return;

  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: "a",
    showHideAnimationType: reducedMotion() ? "none" : "fade",
    pswpModule: () => import("photoswipe"),
  });

  // Supply the required width/height from the thumbnail's natural size.
  // The `itemData` filter is PhotoSwipe's documented hook for injecting data;
  // src is already derived from the anchor href by this point.
  lightbox.addFilter("itemData", (itemData) => {
    const el = itemData.element as HTMLElement | undefined;
    const img = el?.querySelector("img");
    itemData.width = img?.naturalWidth || FALLBACK_W;
    itemData.height = img?.naturalHeight || FALLBACK_H;
    return itemData;
  });

  // PhotoSwipe's root carries role="dialog" but no accessible name — give it
  // one so the modal is announced (and passes axe's aria-dialog-name rule).
  lightbox.on("uiRegister", () => {
    lightbox.pswp?.element?.setAttribute("aria-label", "Portfolio image viewer");
  });

  // Caption from the item's title (kept in a hidden node per anchor).
  lightbox.on("uiRegister", () => {
    lightbox.pswp?.ui?.registerElement({
      name: "caption",
      order: 9,
      isButton: false,
      appendTo: "root",
      onInit: (el) => {
        lightbox.pswp?.on("change", () => {
          const src = lightbox.pswp?.currSlide?.data.element as
            | HTMLElement
            | undefined;
          el.innerHTML =
            src?.querySelector<HTMLElement>("[data-pswp-caption]")?.innerHTML ??
            "";
        });
      },
    });
  });

  lightbox.init();
}

export function mountLightbox(scope: ParentNode = document): void {
  mountPortfolio(scope);
}
