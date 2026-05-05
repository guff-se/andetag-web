/**
 * Modal for artwork detail (Tier 3).
 * Artwork data is read from #artworks-json (embedded by page body).
 */

type ModalImage = {
  src: string; webp640: string; webp960: string; fullSrc?: string;
  mood: string; altSv: string; altEn: string;
};

type ModalArtwork = {
  id: string;
  pageHref?: string;
  series: string; number?: number;
  edition?: { size: number; available: number };
  titleSv: string; titleEn: string;
  year: number; w: number; h: number;
  format: string; status: string; priceSek?: number;
  exhibitionVenue?: string | null;
  locationSv: string; locationEn: string;
  images: ModalImage[];
};

const w = window as Window & { __andetagModal?: boolean };
if (!w.__andetagModal) {
  w.__andetagModal = true;

  const modal = document.getElementById("artwork-modal") as HTMLElement;
  if (!modal) throw new Error("artwork-modal not in DOM");

  const lang = (modal.dataset.modalLang ?? "sv") as "sv" | "en";

  let artworks: ModalArtwork[] = [];
  let currentIdx = 0;
  let currentMoodIdx = 0;

  // Read embedded artwork JSON
  const jsonEl = document.getElementById("artworks-json");
  if (jsonEl) {
    try { artworks = JSON.parse(jsonEl.textContent ?? "[]"); }
    catch { /* ignore */ }
  }

  // Element refs
  const imgWrap   = modal.querySelector<HTMLElement>("[data-modal-img-wrap]")!;
  const moodsEl   = modal.querySelector<HTMLElement>("[data-modal-moods]")!;
  const titleEl   = modal.querySelector<HTMLElement>("[data-modal-title]")!;
  const priceEl   = modal.querySelector<HTMLElement>("[data-modal-price]")!;
  const detailsEl = modal.querySelector<HTMLElement>("[data-modal-details]")!;
  const inquireEl = modal.querySelector<HTMLElement>("[data-modal-inquire]")!;
  const openPageEl = modal.querySelector<HTMLElement>("[data-modal-open-page]");

  const lightbox        = document.getElementById("artwork-lightbox")!;
  const lightboxImgWrap = lightbox?.querySelector<HTMLElement>("[data-lightbox-img-wrap]");
  let currentFullSrc    = "";

  const sek = new Intl.NumberFormat(lang === "sv" ? "sv-SE" : "en-US", {
    style: "currency", currency: "SEK", maximumFractionDigits: 0,
  });

  function esc(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /** File stem before `-960w.jpg` etc., e.g. `closeup-2`, `alt-1`, `light`. */
  function derivativeStem(img: ModalImage): string | null {
    const u = img.fullSrc ?? img.src;
    const m = u.match(/\/([^/]+)-(640w|960w|1920w)\.(webp|jpg)$/i);
    return m ? m[1]! : null;
  }

  /**
   * Short strip label for the mood switcher. Primaries stay spotlight-lit vs dark;
   * other stems use the derivative filename so close-ups, people shots, and alt
   * angles do not all read as one ambient bucket.
   */
  function moodStripLabel(img: ModalImage): string {
    const stem = derivativeStem(img);
    const sv = lang === "sv";

    if (stem) {
      if (stem === "light") return sv ? "Belyst" : "Light";
      if (stem === "dark") return sv ? "Mörker" : "Dark";
      if (stem === "mid") return sv ? "Mjukt rumsijus" : "Room light";

      const closeupN = /^closeup-(\d+)$/.exec(stem);
      if (closeupN) {
        const n = parseInt(closeupN[1]!, 10);
        if (n === 1) return sv ? "Närbild" : "Close-up";
        if (n === 2) return sv ? "Närbild, struktur" : "Close-up, texture";
        return sv ? `Närbild (${n})` : `Close-up (${n})`;
      }

      const personN = /^person-(\d+)$/.exec(stem);
      if (personN) {
        const n = parseInt(personN[1]!, 10);
        if (n === 1) return sv ? "Med person" : "With a person";
        if (n === 2) return sv ? "Med person, ny vinkel" : "With a person, new angle";
        return sv ? `Med person (${n})` : `With a person (${n})`;
      }

      const altN = /^alt-(\d+)$/.exec(stem);
      if (altN) {
        const n = parseInt(altN[1]!, 10);
        if (n === 1) return sv ? "Annan vinkel" : "Another angle";
        if (n === 2) return sv ? "Ytterligare vinkel" : "Further angle";
        return sv ? `Vinkel (${n})` : `Angle (${n})`;
      }
    }

    const m = img.mood;
    if (m === "light") return sv ? "Belyst" : "Light";
    if (m === "dark") return sv ? "Mörker" : "Dark";
    if (m === "mid") return sv ? "Mjukt rumsijus" : "Room light";
    if (m === "closeup") return sv ? "Närbild" : "Close-up";
    if (m === "person") return sv ? "Med person" : "With a person";
    if (m === "context") return sv ? "I rummet" : "In situ";
    if (m === "alternative") return sv ? "Alternativ vy" : "Alternative view";
    return sv ? "Vy" : "View";
  }

  function openModal(idx: number) {
    currentIdx = idx;
    currentMoodIdx = 0;
    render();
    modal.removeAttribute("hidden");
    document.body.classList.add("is-modal-open");
    modal.querySelector<HTMLElement>("[data-modal-close]")?.focus();
  }

  function openFromQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("artwork");
    if (!id) return;
    const idx = artworks.findIndex((a) => a.id === id);
    if (idx === -1) return;
    const tile = document.querySelector<HTMLElement>(`[data-artwork-id="${CSS.escape(id)}"]`);
    if (tile) {
      tile.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    openModal(idx);
  }

  function closeModal() {
    modal.setAttribute("hidden", "");
    document.body.classList.remove("is-modal-open");
    const id = artworks[currentIdx]?.id;
    if (id) document.querySelector<HTMLElement>(`[data-artwork-id="${CSS.escape(id)}"]`)?.focus();
  }

  function navigate(dir: -1 | 1) {
    currentIdx = ((currentIdx + dir) + artworks.length) % artworks.length;
    currentMoodIdx = 0;
    render();
  }

  function openLightbox() {
    if (!lightbox || !lightboxImgWrap || !currentFullSrc) return;
    lightboxImgWrap.innerHTML = `<img src="${esc(currentFullSrc)}" alt="" loading="eager" decoding="async" />`;
    lightbox.removeAttribute("hidden");
    lightbox.querySelector<HTMLElement>("[data-lightbox-close]")?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute("hidden", "");
    if (lightboxImgWrap) lightboxImgWrap.innerHTML = "";
  }

  function renderImg(img: ModalImage) {
    const alt = lang === "sv" ? img.altSv : img.altEn;
    const full = img.fullSrc ?? img.src;
    currentFullSrc = full;
    imgWrap.innerHTML = `
      <picture>
        <source type="image/webp" srcset="${esc(img.webp640)} 640w, ${esc(img.webp960)} 960w"
          sizes="(max-width:800px) 90vw, 55vw" />
        <img src="${esc(full)}" alt="${esc(alt)}" loading="eager" decoding="async" />
      </picture>`;
  }

  function renderMoods(artwork: ModalArtwork) {
    if (artwork.images.length < 2) { moodsEl.innerHTML = ""; return; }
    const baseLabels = artwork.images.map((img) => moodStripLabel(img));
    const seen = new Map<string, number>();
    const labels = baseLabels.map((lab) => {
      const n = (seen.get(lab) ?? 0) + 1;
      seen.set(lab, n);
      return n === 1 ? lab : `${lab} · ${n}`;
    });
    moodsEl.innerHTML = "";
    artwork.images.forEach((img, i) => {
      const label = labels[i]!;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "artwork-modal__mood-btn" + (i === currentMoodIdx ? " is-active" : "");
      btn.dataset.moodIdx = String(i);
      btn.setAttribute("aria-pressed", String(i === currentMoodIdx));
      btn.textContent = label;
      btn.addEventListener("click", () => {
        currentMoodIdx = i;
        renderImg(artwork.images[i]!);
        for (const b of moodsEl.querySelectorAll<HTMLButtonElement>("[data-mood-idx]")) {
          const active = b.dataset.moodIdx === String(i);
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", String(active));
        }
      });
      moodsEl.appendChild(btn);
    });
  }

  function render() {
    const a = artworks[currentIdx];
    if (!a) return;

    const title = lang === "sv" ? a.titleSv : a.titleEn;
    const location = lang === "sv" ? a.locationSv : a.locationEn;

    titleEl.textContent = title;

    // Price / status
    if (a.status === "sold") {
      priceEl.textContent = lang === "sv" ? "I samling" : "In a collection";
      priceEl.className = "artwork-modal__price is-sold";
    } else if (a.priceSek) {
      priceEl.textContent = sek.format(a.priceSek);
      priceEl.className = "artwork-modal__price";
    } else {
      priceEl.textContent = lang === "sv" ? "Pris på förfrågan" : "Price on request";
      priceEl.className = "artwork-modal__price";
    }

    // Details
    const fmtLabel = lang === "sv"
      ? (a.format === "landscape" ? "Liggande" : a.format === "diptych" ? "Diptyk" : "Stående")
      : (a.format === "landscape" ? "Landscape" : a.format === "diptych" ? "Diptych" : "Portrait");
    const med = lang === "sv" ? "Material" : "Medium";
    const medVal = lang === "sv"
      ? "Optisk fibertextil: bomullsvarp med optisk fiber, bomull, chenille och krympgarn i inslaget; polyesterfyllning; adresserbara RGB-lysdioder; mikrodator; träram"
      : "Optical fibre fabric: cotton warp with optical fibre, cotton, chenille and shrinking yarn in weft; polyester fill; addressable RGB LEDs; microcomputer; wooden frame";
    const yr  = lang === "sv" ? "År" : "Year";
    const sz  = lang === "sv" ? "Storlek" : "Size";
    const fmt = "Format";
    const locLabel = a.status === "on-exhibition"
      ? (lang === "sv" ? "Visas på" : "On view at")
      : (lang === "sv" ? "Plats" : "Location");
    const locValue = a.status === "on-exhibition"
      ? (a.exhibitionVenue ?? location)
      : location;
    const ed  = lang === "sv" ? "Upplaga" : "Edition";

    let html = `
      <div><dt>${med}</dt><dd>${medVal}</dd></div>
      <div><dt>${yr}</dt><dd>${a.year}</dd></div>
      <div><dt>${sz}</dt><dd>${a.w} × ${a.h} cm</dd></div>
      <div><dt>${fmt}</dt><dd>${fmtLabel}</dd></div>
      <div><dt>${locLabel}</dt><dd>${esc(locValue)}</dd></div>`;
    if (a.edition) {
      const edTxt = lang === "sv"
        ? `Upplaga ${a.edition.available} av ${a.edition.size}`
        : `Edition of ${a.edition.size} (${a.edition.available} available)`;
      html += `<div><dt>${ed}</dt><dd>${edTxt}</dd></div>`;
    }
    detailsEl.innerHTML = html;

    // Open per-artwork page (always shown)
    if (openPageEl && a.pageHref) {
      (openPageEl as HTMLAnchorElement).href = a.pageHref;
      openPageEl.removeAttribute("hidden");
    } else if (openPageEl) {
      openPageEl.setAttribute("hidden", "");
    }

    // Inquire
    if (a.status !== "sold") {
      (inquireEl as HTMLAnchorElement).href = `#inquiry?about=${a.id}`;
      inquireEl.removeAttribute("hidden");
    } else {
      inquireEl.setAttribute("hidden", "");
    }

    renderMoods(a);
    renderImg(a.images[currentMoodIdx] ?? a.images[0]!);
  }

  // Click handler
  document.addEventListener("click", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    if (t.closest("[data-lightbox-backdrop]") || t.closest("[data-lightbox-close]")) {
      closeLightbox(); return;
    }
    if (t.closest("[data-modal-expand]")) { openLightbox(); return; }
    if (t.closest("[data-modal-backdrop]") || t.closest("[data-modal-close]")) {
      closeModal(); return;
    }
    if (t.closest("[data-modal-inquire]")) { closeModal(); return; }
    if (t.closest("[data-modal-prev]")) { navigate(-1); return; }
    if (t.closest("[data-modal-next]")) { navigate(1); return; }
    const tile = t.closest<HTMLElement>("[data-artwork-tile]");
    if (tile) {
      // Tile is now an <a> link to the per-artwork page (progressive
      // enhancement: navigates when JS fails). With JS, intercept and open
      // the quick-view modal instead.
      const idx = artworks.findIndex(a => a.id === tile.dataset.artworkId);
      if (idx !== -1) {
        e.preventDefault();
        openModal(idx);
      }
    }
  });

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (lightbox && !lightbox.hidden) {
      if (e.key === "Escape") { closeLightbox(); return; }
      return;
    }
    if (modal.hidden) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });

  // Map sync: expose openModal by artwork id
  (window as any).__andetagOpenArtworkModal = (id: string) => {
    const idx = artworks.findIndex(a => a.id === id);
    if (idx !== -1) openModal(idx);
  };

  openFromQueryParam();
}
