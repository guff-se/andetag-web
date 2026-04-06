/**
 * Loads Understory `widgets/understory-booking-widget.js` when a `BookingEmbed` shell nears the viewport.
 * Multiple embeds share one script injection (same `data-booking-script-src`).
 */

const LAZY_ATTR = "data-booking-embed-lazy";
const SRC_ATTR = "data-booking-script-src";

const injected = new Set<string>();

function injectScript(src: string): void {
  if (injected.has(src)) return;
  injected.add(src);
  const s = document.createElement("script");
  s.src = src;
  s.defer = true;
  document.head.appendChild(s);
}

function boot(): void {
  const w = window as Window & { __andetagBookingLazyInit?: boolean };
  if (w.__andetagBookingLazyInit) return;

  const shells = document.querySelectorAll<HTMLElement>(`[${LAZY_ATTR}]`);
  if (!shells.length) return;

  w.__andetagBookingLazyInit = true;

  const run = (el: HTMLElement) => {
    const src = el.getAttribute(SRC_ATTR);
    if (src) injectScript(src);
  };

  // TEMP TEST: eager load (restore IntersectionObserver block below afterward)
  shells.forEach(run);

  /*
  if (!("IntersectionObserver" in window)) {
    shells.forEach(run);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        run(e.target as HTMLElement);
        io.unobserve(e.target);
      }
    },
    { rootMargin: "400px 0px", threshold: 0.01 },
  );

  shells.forEach((el) => io.observe(el));
  */
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
