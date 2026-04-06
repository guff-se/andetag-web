import { getWrappedIndex } from "../lib/ui-logic/testimonial-carousel";

const isTransformProperty = (name: string) =>
  name === "transform" || name === "-webkit-transform";

const setupTestimonialCarousel = (root: HTMLElement) => {
  if (root.dataset.carouselInitialized === "true") return;
  root.dataset.carouselInitialized = "true";

  const slides = root.querySelectorAll<HTMLElement>(".testimonial-slide");
  const total = slides.length;
  if (total === 0) return;

  let activeIndex = getWrappedIndex(0, total);
  const autoplayMs = Number(root.getAttribute("data-autoplay-ms")) || 6000;
  const transitionMs = 550;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const setActiveSlide = (requestedIndex: number, direction: "forward" | "backward") => {
    const nextIndex = getWrappedIndex(requestedIndex, total);
    if (nextIndex === activeIndex) return;
    if (root.dataset.testimonialTransitioning === "true") return;

    const forward = direction === "forward";
    const current = slides[activeIndex];
    const next = slides[nextIndex];

    root.dataset.testimonialTransitioning = "true";

    next.style.visibility = "visible";
    next.style.opacity = "1";
    next.style.zIndex = "2";
    next.style.transform = forward ? "translateX(100%)" : "translateX(-100%)";
    current.style.zIndex = "1";

    void next.offsetHeight;

    current.style.transform = forward ? "translateX(-100%)" : "translateX(100%)";
    current.style.opacity = "0";
    next.style.transform = "translateX(0)";

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      next.removeEventListener("transitionend", onTransitionEnd);
      window.clearTimeout(fallbackTimer);
      current.classList.remove("is-active");
      current.setAttribute("aria-hidden", "true");
      current.removeAttribute("style");
      next.classList.add("is-active");
      next.setAttribute("aria-hidden", "false");
      next.removeAttribute("style");
      activeIndex = nextIndex;
      delete root.dataset.testimonialTransitioning;
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== next) return;
      if (!isTransformProperty(event.propertyName)) return;
      finish();
    };

    next.addEventListener("transitionend", onTransitionEnd);
    const fallbackTimer = window.setTimeout(finish, transitionMs + 100);
  };

  const startAutoplay = () => {
    if (total <= 1 || autoplayMs <= 0 || intervalId !== null) return;
    intervalId = window.setInterval(() => {
      setActiveSlide(activeIndex + 1, "forward");
    }, autoplayMs);
  };

  const stopAutoplay = () => {
    if (intervalId === null) return;
    window.clearInterval(intervalId);
    intervalId = null;
  };

  root.querySelector<HTMLButtonElement>(".testimonial-nav-prev")?.addEventListener("click", () => {
    setActiveSlide(activeIndex - 1, "backward");
    stopAutoplay();
    startAutoplay();
  });

  root.querySelector<HTMLButtonElement>(".testimonial-nav-next")?.addEventListener("click", () => {
    setActiveSlide(activeIndex + 1, "forward");
    stopAutoplay();
    startAutoplay();
  });

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusout", startAutoplay);

  startAutoplay();
};

const initializeAll = () => {
  document.querySelectorAll<HTMLElement>(".js-testimonial-carousel").forEach((el) => {
    setupTestimonialCarousel(el);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAll, { once: true });
} else {
  initializeAll();
}
