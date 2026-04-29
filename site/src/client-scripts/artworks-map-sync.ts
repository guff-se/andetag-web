/**
 * Two-way highlight between map pins and artwork tiles.
 *
 * - Hovering or focusing a tile highlights its pin (`.is-active`).
 * - Hovering or focusing a pin highlights its tiles.
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
    const escaped = CSS.escape(id);
    return root.querySelector(`.artwork-map__pin[data-artwork-ids~="${escaped}"]`);
  }

  root.addEventListener("pointerenter", (e) => {
    const t = e.target as Element | null;
    if (!t || !(t instanceof Element)) return;
    const tile = t.closest("[data-artwork-tile]");
    if (tile) {
      const pin = pinForTile(tile);
      if (pin) activatePin(pin, true);
      return;
    }
    const pin = t.closest(".artwork-map__pin");
    if (pin) {
      activatePin(pin, true);
      activateTilesForPin(pin, true);
    }
  }, true);

  root.addEventListener("pointerleave", (e) => {
    const t = e.target as Element | null;
    if (!t || !(t instanceof Element)) return;
    const tile = t.closest("[data-artwork-tile]");
    if (tile) {
      const pin = pinForTile(tile);
      if (pin) activatePin(pin, false);
      return;
    }
    const pin = t.closest(".artwork-map__pin");
    if (pin) {
      activatePin(pin, false);
      activateTilesForPin(pin, false);
    }
  }, true);

  root.addEventListener("focusin", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    const tile = t.closest("[data-artwork-tile]");
    if (tile) {
      const pin = pinForTile(tile);
      if (pin) activatePin(pin, true);
      return;
    }
    const pin = t.closest(".artwork-map__pin");
    if (pin) {
      activatePin(pin, true);
      activateTilesForPin(pin, true);
    }
  });

  root.addEventListener("focusout", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    const tile = t.closest("[data-artwork-tile]");
    if (tile) {
      const pin = pinForTile(tile);
      if (pin) activatePin(pin, false);
      return;
    }
    const pin = t.closest(".artwork-map__pin");
    if (pin) {
      activatePin(pin, false);
      activateTilesForPin(pin, false);
    }
  });

  function handlePinActivation(pin: Element) {
    const ids = (pin.getAttribute("data-artwork-ids") ?? "").split(/\s+/).filter(Boolean);
    if (ids.length === 0) return;
    const firstId = ids[0]!;
    // Open modal if available; otherwise fall back to scrolling to tile
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

  root.addEventListener("click", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    const pin = t.closest(".artwork-map__pin");
    if (pin) handlePinActivation(pin);
  });

  root.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const t = e.target as Element | null;
    if (!t) return;
    const pin = t.closest(".artwork-map__pin");
    if (pin) {
      e.preventDefault();
      handlePinActivation(pin);
    }
  });
}
