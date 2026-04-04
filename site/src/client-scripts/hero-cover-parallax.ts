/** Strong enough to read on a ~336px-tall cover band while scrolling. */
const INTENSITY = 0.28;
/** Keep in sync with `--hero-parallax-max-shift` on `.component-hero.is-cover` (components.css).
 * Loaded from `HeroSection.astro` when `backgroundImage` is set; listeners bound once per page. */
const MAX_SHIFT_PX = 96;
const SCALE = 1.1;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function updateHeroCoverParallax(): void {
  const mediaNodes = document.querySelectorAll<HTMLElement>(".component-hero.is-cover .component-hero-media");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    mediaNodes.forEach((el) => {
      el.style.transform = "";
    });
    return;
  }

  mediaNodes.forEach((img) => {
    const section = img.closest(".component-hero.is-cover");
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const bandCenterY = rect.top + rect.height / 2;
    const viewportCenterY = vh / 2;
    const delta = bandCenterY - viewportCenterY;
    const translateY = clamp(-delta * INTENSITY, -MAX_SHIFT_PX, MAX_SHIFT_PX);
    img.style.transform = `translate3d(0, ${translateY}px, 0) scale(${SCALE})`;
  });
}

let rafPending = false;

function scheduleUpdate(): void {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    updateHeroCoverParallax();
  });
}

function bindScrollListeners(): void {
  const scrollOpts: AddEventListenerOptions = { passive: true };
  window.addEventListener("scroll", scheduleUpdate, scrollOpts);
  document.addEventListener("scroll", scheduleUpdate, scrollOpts);
  window.addEventListener("resize", scheduleUpdate);

  const vv = window.visualViewport;
  if (vv) {
    vv.addEventListener("scroll", scheduleUpdate, scrollOpts);
    vv.addEventListener("resize", scheduleUpdate);
  }
}

function init(): void {
  updateHeroCoverParallax();
  const w = window as Window & { __andetagHeroCoverParallax?: boolean };
  if (!w.__andetagHeroCoverParallax) {
    w.__andetagHeroCoverParallax = true;
    bindScrollListeners();
  }
  requestAnimationFrame(() => updateHeroCoverParallax());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
