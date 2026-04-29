/**
 * Client filter for the Artworks page.
 *
 * Two filter dimensions: `status` (all|for-sale|sold) and `format`
 * (all|landscape|portrait|diptych). Cards carry `data-artwork-status` and
 * `data-artwork-format`; we set CSS classes on the grid (`is-filtering-status-X`
 * and `is-filtering-format-Y`) and let CSS hide non-matching cards. This avoids
 * any layout thrash from inline style toggles and plays nicely with the fade-in
 * animation on initial reveal.
 *
 * State lives in `location.hash` (`#filter=status:for-sale,format:portrait`) so
 * a filtered view is shareable.
 */

type FilterState = {
  status: "all" | "for-sale" | "sold";
  format: "all" | "landscape" | "portrait" | "diptych";
};

const w = window as Window & { __andetagArtworksFilter?: boolean };
if (!w.__andetagArtworksFilter) {
  w.__andetagArtworksFilter = true;

  const STORAGE_HASH_KEY = "filter";

  function readStateFromHash(): FilterState {
    const state: FilterState = { status: "all", format: "all" };
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return state;
    for (const part of hash.split("&")) {
      const [k, v] = part.split("=");
      if (k !== STORAGE_HASH_KEY || !v) continue;
      for (const pair of v.split(",")) {
        const [group, value] = pair.split(":");
        if (group === "status" && (value === "all" || value === "for-sale" || value === "sold")) {
          state.status = value;
        } else if (
          group === "format" &&
          (value === "all" || value === "landscape" || value === "portrait" || value === "diptych")
        ) {
          state.format = value;
        }
      }
    }
    return state;
  }

  function writeStateToHash(state: FilterState) {
    const isDefault = state.status === "all" && state.format === "all";
    const otherParts: string[] = [];
    for (const part of location.hash.replace(/^#/, "").split("&")) {
      if (!part) continue;
      const [k] = part.split("=");
      if (k !== STORAGE_HASH_KEY) otherParts.push(part);
    }
    if (!isDefault) {
      otherParts.unshift(`${STORAGE_HASH_KEY}=status:${state.status},format:${state.format}`);
    }
    const next = otherParts.join("&");
    if (next === location.hash.replace(/^#/, "")) return;
    history.replaceState(null, "", next ? `#${next}` : location.pathname + location.search);
  }

  function applyState(state: FilterState) {
    for (const grid of document.querySelectorAll<HTMLElement>("[data-artwork-grid]")) {
      grid.dataset.filterStatus = state.status;
      grid.dataset.filterFormat = state.format;
      const visible = countVisibleCards(grid, state);
      grid.dataset.visibleCount = String(visible);
      const empty = grid.parentElement?.querySelector<HTMLElement>("[data-filter-empty]");
      if (empty) empty.hidden = visible !== 0;
    }
    syncPills(state);
  }

  function countVisibleCards(grid: HTMLElement, state: FilterState): number {
    let count = 0;
    for (const card of grid.querySelectorAll<HTMLElement>("[data-artwork-card]")) {
      const matchStatus = state.status === "all" || card.dataset.artworkStatus === state.status;
      const matchFormat = state.format === "all" || card.dataset.artworkFormat === state.format;
      if (matchStatus && matchFormat) count++;
    }
    return count;
  }

  function syncPills(state: FilterState) {
    for (const pill of document.querySelectorAll<HTMLButtonElement>(".artwork-filter-pill")) {
      const group = pill.dataset.filterGroup;
      const value = pill.dataset.filterValue;
      if (!group || !value) continue;
      const active =
        (group === "status" && state.status === value) ||
        (group === "format" && state.format === value);
      pill.classList.toggle("is-active", active);
      pill.setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  function handlePillClick(e: Event) {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const pill = t.closest<HTMLButtonElement>(".artwork-filter-pill");
    if (!pill) return;
    const group = pill.dataset.filterGroup as "status" | "format" | undefined;
    const value = pill.dataset.filterValue;
    if (!group || !value) return;
    const state = readStateFromHash();
    if (group === "status") {
      state.status = value as FilterState["status"];
    } else {
      state.format = value as FilterState["format"];
    }
    writeStateToHash(state);
    applyState(state);
  }

  document.addEventListener("click", handlePillClick);
  window.addEventListener("hashchange", () => applyState(readStateFromHash()));

  applyState(readStateFromHash());
}
