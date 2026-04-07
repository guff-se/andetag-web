/**
 * Full-screen image lightbox for `.js-gallery-lightbox` links (replaces jQuery in `GallerySection.astro`).
 * Initialization deferred to when a gallery section enters the viewport (IntersectionObserver).
 */
function ensureLightbox(): void {
  if (document.getElementById("gallery-lightbox-overlay")) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "gallery-lightbox-overlay";
  overlay.className = "gallery-lightbox-overlay";
  overlay.innerHTML = `
      <button type="button" class="gallery-lightbox-close" aria-label="Close image">&times;</button>
      <img class="gallery-lightbox-image" alt="" />
    `;
  document.body.appendChild(overlay);
}

function getOverlayEls(): {
  overlay: HTMLElement;
  image: HTMLImageElement;
} | null {
  const overlay = document.getElementById("gallery-lightbox-overlay");
  const image = overlay?.querySelector<HTMLImageElement>(".gallery-lightbox-image");
  if (!overlay || !image) {
    return null;
  }
  return { overlay, image };
}

function openLightbox(href: string, alt: string): void {
  const els = getOverlayEls();
  if (!els) {
    return;
  }
  els.image.src = href;
  els.image.alt = alt;
  els.overlay.classList.add("is-open");
  document.body.classList.add("lightbox-open");
}

function closeLightbox(): void {
  const els = getOverlayEls();
  if (!els) {
    return;
  }
  els.overlay.classList.remove("is-open");
  document.body.classList.remove("lightbox-open");
}

let initialized = false;

function bindLightboxListeners(): void {
  if (initialized) return;
  initialized = true;

  ensureLightbox();

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const link = target.closest("a.js-gallery-lightbox");
    if (link instanceof HTMLAnchorElement) {
      event.preventDefault();
      const imageUrl = link.getAttribute("href");
      const imageAlt = link.getAttribute("aria-label") ?? "";
      if (imageUrl) {
        openLightbox(imageUrl, imageAlt);
      }
      return;
    }

    if (
      target.classList.contains("gallery-lightbox-overlay") ||
      target.classList.contains("gallery-lightbox-close")
    ) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

const galleries = document.querySelectorAll(".gallery-section");
if (galleries.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          bindLightboxListeners();
          observer.disconnect();
          break;
        }
      }
    },
    { rootMargin: "200px" },
  );
  for (const el of galleries) {
    observer.observe(el);
  }
} else if (galleries.length > 0) {
  bindLightboxListeners();
}
