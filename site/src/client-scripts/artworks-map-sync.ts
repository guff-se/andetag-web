/**
 * Two-way highlight between map pins and artwork tiles.
 *
 * - Hovering or focusing a tile highlights its pin (`.is-active`).
 * - Moving the cursor over the map activates the geometrically nearest pin,
 *   regardless of SVG DOM order. This avoids the hit-testing issue where the
 *   last-rendered pin in a cluster absorbs all pointer events.
 * - Clicking or pressing Enter on a pin opens the modal for the first matching
 *   artwork (via `window.__andetagOpenArtworkModal`).
 */
const w = window as Window & {
  __andetagArtworksMapSync?: boolean;
  __andetagOpenArtworkModal?: (id: string) => void;
};
if (!w.__andetagArtworksMapSync) {
  w.__andetagArtworksMapSync = true;

  const root = document;
  const svg = root.querySelector<SVGSVGElement>(".artwork-map__svg");

  // ── Pin registry: read cx/cy from rendered circles at init ──────────────
  type PinEntry = { el: Element; cx: number; cy: number };
  const pinEntries: PinEntry[] = [];
  for (const pinEl of root.querySelectorAll<Element>(".artwork-map__pin")) {
    const dot = pinEl.querySelector<SVGCircleElement>(".artwork-map__pin-dot");
    if (!dot) continue;
    pinEntries.push({ el: pinEl, cx: dot.cx.baseVal.value, cy: dot.cy.baseVal.value });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function activatePin(pin: Element, on: boolean) {
    pin.classList.toggle("is-active", on);
  }

  function activateTilesForPin(pin: Element, on: boolean) {
    const ids = (pin.getAttribute("data-artwork-ids") ?? "").split(/\s+/).filter(Boolean);
    for (const id of ids) {
      const tile = root.querySelector(`[data-artwork-id="${CSS.escape(id)}"]`);
      if (tile) tile.classList.toggle("is-pinned", on);
    }
  }

  function pinForTile(tile: Element): Element | null {
    const id = tile.getAttribute("data-artwork-id");
    if (!id) return null;
    return root.querySelector(`.artwork-map__pin[data-artwork-ids~="${CSS.escape(id)}"]`);
  }

  function toSvgPoint(clientX: number, clientY: number): { x: number; y: number } | null {
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const sp = pt.matrixTransform(ctm.inverse());
    return { x: sp.x, y: sp.y };
  }

  // Nearest pin within HIT_RADIUS SVG units; null if none close enough.
  const HIT_RADIUS = 28;
  function nearestPin(x: number, y: number): PinEntry | null {
    let best: PinEntry | null = null;
    let bestDist = HIT_RADIUS;
    for (const pin of pinEntries) {
      const d = Math.hypot(x - pin.cx, y - pin.cy);
      if (d < bestDist) { bestDist = d; best = pin; }
    }
    return best;
  }

  function handlePinActivation(pin: Element) {
    const ids = (pin.getAttribute("data-artwork-ids") ?? "").split(/\s+/).filter(Boolean);
    if (ids.length === 0) return;
    const firstId = ids[0]!;
    if (typeof w.__andetagOpenArtworkModal === "function") {
      w.__andetagOpenArtworkModal(firstId);
    } else {
      const tile = root.querySelector<HTMLElement>(`[data-artwork-id="${CSS.escape(firstId)}"]`);
      if (tile) {
        tile.scrollIntoView({ behavior: "smooth", block: "center" });
        tile.focus({ preventScroll: true });
      }
    }
  }

  // ── SVG-level pointer handling (nearest-pin, not DOM-order) ──────────────
  let activeMapPin: PinEntry | null = null;

  if (svg) {
    svg.addEventListener("pointermove", (e) => {
      const coords = toSvgPoint(e.clientX, e.clientY);
      if (!coords) return;
      const nearest = nearestPin(coords.x, coords.y);
      if (nearest === activeMapPin) return;
      if (activeMapPin) {
        activatePin(activeMapPin.el, false);
        activateTilesForPin(activeMapPin.el, false);
      }
      activeMapPin = nearest;
      if (nearest) {
        activatePin(nearest.el, true);
        activateTilesForPin(nearest.el, true);
      }
      svg.style.cursor = nearest ? "pointer" : "";
    });

    svg.addEventListener("pointerleave", () => {
      if (activeMapPin) {
        activatePin(activeMapPin.el, false);
        activateTilesForPin(activeMapPin.el, false);
        activeMapPin = null;
      }
      svg.style.cursor = "";
    });

    svg.addEventListener("click", (e) => {
      const coords = toSvgPoint(e.clientX, e.clientY);
      if (!coords) return;
      const nearest = nearestPin(coords.x, coords.y);
      if (nearest) handlePinActivation(nearest.el);
    });
  }

  // ── Tile → pin highlight ──────────────────────────────────────────────────
  root.addEventListener("pointerenter", (e) => {
    const tile = (e.target as Element | null)?.closest("[data-artwork-tile]");
    if (tile) {
      const pin = pinForTile(tile);
      if (pin) activatePin(pin, true);
    }
  }, true);

  root.addEventListener("pointerleave", (e) => {
    const tile = (e.target as Element | null)?.closest("[data-artwork-tile]");
    if (tile) {
      const pin = pinForTile(tile);
      if (pin) activatePin(pin, false);
    }
  }, true);

  // ── Focus sync ───────────────────────────────────────────────────────────
  root.addEventListener("focusin", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    const tile = t.closest("[data-artwork-tile]");
    if (tile) { const pin = pinForTile(tile); if (pin) activatePin(pin, true); return; }
    const pin = t.closest(".artwork-map__pin");
    if (pin) { activatePin(pin, true); activateTilesForPin(pin, true); }
  });

  root.addEventListener("focusout", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    const tile = t.closest("[data-artwork-tile]");
    if (tile) { const pin = pinForTile(tile); if (pin) activatePin(pin, false); return; }
    const pin = t.closest(".artwork-map__pin");
    if (pin) { activatePin(pin, false); activateTilesForPin(pin, false); }
  });

  // ── Keyboard (for focused pins) ───────────────────────────────────────────
  root.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const pin = (e.target as Element | null)?.closest(".artwork-map__pin");
    if (pin) { e.preventDefault(); handlePinActivation(pin); }
  });
}
