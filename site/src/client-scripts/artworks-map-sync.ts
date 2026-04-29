/**
 * Two-way highlight between map pins and artwork cards.
 *
 * - Hovering or focusing a card highlights its pin (`.is-active`).
 * - Hovering or focusing a pin highlights its cards.
 * - Clicking or pressing Enter on a pin scrolls the first matching card into view
 *   and moves focus there for keyboard users.
 */
const w = window as Window & { __andetagArtworksMapSync?: boolean };
if (!w.__andetagArtworksMapSync) {
  w.__andetagArtworksMapSync = true;

  const root = document;

  function activatePin(pin: Element, on: boolean) {
    pin.classList.toggle("is-active", on);
  }

  function activateCardsForPin(pin: Element, on: boolean) {
    const ids = (pin.getAttribute("data-artwork-ids") ?? "").split(/\s+/).filter(Boolean);
    for (const id of ids) {
      const card = root.querySelector(`[data-artwork-card="${CSS.escape(id)}"]`);
      if (card) card.classList.toggle("is-pinned", on);
    }
  }

  function pinForCard(card: Element): Element | null {
    const id = card.getAttribute("data-artwork-card");
    if (!id) return null;
    const escaped = CSS.escape(id);
    return root.querySelector(`.artwork-map__pin[data-artwork-ids~="${escaped}"]`);
  }

  root.addEventListener("pointerenter", (e) => {
    const t = e.target as Element | null;
    if (!t || !(t instanceof Element)) return;
    const card = t.closest("[data-artwork-card]");
    if (card) {
      const pin = pinForCard(card);
      if (pin) activatePin(pin, true);
      return;
    }
    const pin = t.closest(".artwork-map__pin");
    if (pin) {
      activatePin(pin, true);
      activateCardsForPin(pin, true);
    }
  }, true);

  root.addEventListener("pointerleave", (e) => {
    const t = e.target as Element | null;
    if (!t || !(t instanceof Element)) return;
    const card = t.closest("[data-artwork-card]");
    if (card) {
      const pin = pinForCard(card);
      if (pin) activatePin(pin, false);
      return;
    }
    const pin = t.closest(".artwork-map__pin");
    if (pin) {
      activatePin(pin, false);
      activateCardsForPin(pin, false);
    }
  }, true);

  root.addEventListener("focusin", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    const card = t.closest("[data-artwork-card]");
    if (card) {
      const pin = pinForCard(card);
      if (pin) activatePin(pin, true);
      return;
    }
    const pin = t.closest(".artwork-map__pin");
    if (pin) {
      activatePin(pin, true);
      activateCardsForPin(pin, true);
    }
  });

  root.addEventListener("focusout", (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    const card = t.closest("[data-artwork-card]");
    if (card) {
      const pin = pinForCard(card);
      if (pin) activatePin(pin, false);
      return;
    }
    const pin = t.closest(".artwork-map__pin");
    if (pin) {
      activatePin(pin, false);
      activateCardsForPin(pin, false);
    }
  });

  function handlePinActivation(pin: Element) {
    const ids = (pin.getAttribute("data-artwork-ids") ?? "").split(/\s+/).filter(Boolean);
    if (ids.length === 0) return;
    const firstId = ids[0]!;
    const card = root.querySelector(`[data-artwork-card="${CSS.escape(firstId)}"]`);
    if (card instanceof HTMLElement) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      const focusable = card.querySelector<HTMLElement>("a, button");
      focusable?.focus({ preventScroll: true });
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
