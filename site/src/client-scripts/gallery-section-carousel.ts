/**
 * Stockholm home gallery: at <=1024px, `mobile-carousel` sections scroll horizontally
 * (matches `site-html/index.html`: grid on desktop, Swiper carousel on tablet/mobile).
 * Prev/next, optional autoplay, respects `prefers-reduced-motion`.
 */
const CAROUSEL_MQ = "(max-width: 1024px)";
const AUTOPLAY_MS = 5000;
const RESUME_AFTER_INTERACTION_MS = 8000;

function initGalleryCarousel(section: HTMLElement) {
  if (section.dataset.galleryCarouselMounted === "true") {
    return;
  }
  section.dataset.galleryCarouselMounted = "true";

  const prev = section.querySelector<HTMLButtonElement>(".gallery-carousel-btn-prev");
  const next = section.querySelector<HTMLButtonElement>(".gallery-carousel-btn-next");
  const tiles = [...section.querySelectorAll<HTMLElement>(".gallery-tile")];
  if (tiles.length < 2 || !prev || !next) {
    return;
  }

  const mq = window.matchMedia(CAROUSEL_MQ);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let autoplayId: ReturnType<typeof window.setInterval> | undefined;
  let resumeId: ReturnType<typeof window.setTimeout> | undefined;

  const clearAutoplay = () => {
    if (autoplayId !== undefined) {
      window.clearInterval(autoplayId);
      autoplayId = undefined;
    }
  };

  const clearResume = () => {
    if (resumeId !== undefined) {
      window.clearTimeout(resumeId);
      resumeId = undefined;
    }
  };

  const closestIndex = () => {
    const mid = section.scrollLeft + section.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < tiles.length; i++) {
      const t = tiles[i]!;
      const c = t.offsetLeft + t.offsetWidth / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  };

  const goTo = (index: number) => {
    const i = ((index % tiles.length) + tiles.length) % tiles.length;
    const tile = tiles[i];
    if (!tile) return;
    // Do not use `scrollIntoView` on tiles: it scrolls the document vertically to bring
    // the gallery into view on each autoplay step. Only move the strip's horizontal scroll.
    const maxScroll = Math.max(0, section.scrollWidth - section.clientWidth);
    const left = Math.max(0, Math.min(tile.offsetLeft, maxScroll));
    section.scrollTo({
      left,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  };

  const startAutoplay = () => {
    clearAutoplay();
    clearResume();
    if (!mq.matches || reduceMotion.matches) {
      return;
    }
    autoplayId = window.setInterval(() => {
      const i = closestIndex();
      goTo(i + 1);
    }, AUTOPLAY_MS);
  };

  const pauseAndScheduleResume = () => {
    clearAutoplay();
    clearResume();
    if (!mq.matches || reduceMotion.matches) {
      return;
    }
    resumeId = window.setTimeout(() => {
      resumeId = undefined;
      startAutoplay();
    }, RESUME_AFTER_INTERACTION_MS);
  };

  const onPrev = () => {
    goTo(closestIndex() - 1);
    pauseAndScheduleResume();
  };

  const onNext = () => {
    goTo(closestIndex() + 1);
    pauseAndScheduleResume();
  };

  prev.addEventListener("click", onPrev);
  next.addEventListener("click", onNext);

  section.addEventListener("mouseenter", clearAutoplay);
  section.addEventListener("mouseleave", startAutoplay);
  section.addEventListener(
    "touchstart",
    () => {
      clearAutoplay();
    },
    { passive: true },
  );
  section.addEventListener(
    "touchend",
    () => {
      pauseAndScheduleResume();
    },
    { passive: true },
  );

  const onMqChange = () => {
    clearResume();
    if (mq.matches) {
      startAutoplay();
    } else {
      clearAutoplay();
    }
  };

  mq.addEventListener("change", onMqChange);
  onMqChange();
}

function initGalleryCarousels() {
  document.querySelectorAll<HTMLElement>(".js-gallery-mobile-carousel").forEach(initGalleryCarousel);
}

initGalleryCarousels();
