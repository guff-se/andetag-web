/**
 * Client filter for the Artworks page.
 *
 * Single filter dimension: `format` (all|landscape|portrait|diptych). Status split is
 * handled by the section accordion (available vs sold). Tiles carry
 * `data-artwork-format`; we set `data-filter-format` on each `[data-artwork-grid]`
 * element and let CSS hide non-matching tiles. This avoids layout thrash from
 * inline style toggles.
 *
 * State lives in `location.hash` (`#filter=format:portrait`) so a filtered view
 * is shareable.
 */

type FilterState = {
  format: "all" | "landscape" | "portrait" | "diptych";
};

const w = window as Window & { __andetagArtworksFilter?: boolean };
if (!w.__andetagArtworksFilter) {
  w.__andetagArtworksFilter = true;

  const STORAGE_HASH_KEY = "filter";

  function readStateFromHash(): FilterState {
    const state: FilterState = { format: "all" };
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return state;
    for (const part of hash.split("&")) {
      const [k, v] = part.split("=");
      if (k !== STORAGE_HASH_KEY || !v) continue;
      for (const pair of v.split(",")) {
        const [group, value] = pair.split(":");
        if (
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
    const isDefault = state.format === "all";
    const otherParts: string[] = [];
    for (const part of location.hash.replace(/^#/, "").split("&")) {
      if (!part) continue;
      const [k] = part.split("=");
      if (k !== STORAGE_HASH_KEY) otherParts.push(part);
    }
    if (!isDefault) {
      otherParts.unshift(`${STORAGE_HASH_KEY}=format:${state.format}`);
    }
    const next = otherParts.join("&");
    if (next === location.hash.replace(/^#/, "")) return;
    history.replaceState(null, "", next ? `#${next}` : location.pathname + location.search);
  }

  function applyState(state: FilterState) {
    for (const grid of document.querySelectorAll<HTMLElement>("[data-artwork-grid]")) {
      grid.dataset.filterFormat = state.format;
      const visible = countVisibleTiles(grid, state);
      grid.dataset.visibleCount = String(visible);
      const empty = grid.parentElement?.querySelector<HTMLElement>("[data-filter-empty]");
      if (empty) empty.hidden = visible !== 0;
    }
    syncPills(state);
  }

  function countVisibleTiles(grid: HTMLElement, state: FilterState): number {
    let count = 0;
    for (const tile of grid.querySelectorAll<HTMLElement>("[data-artwork-tile]")) {
      const matchFormat = state.format === "all" || tile.dataset.artworkFormat === state.format;
      if (matchFormat) count++;
    }
    return count;
  }

  function syncPills(state: FilterState) {
    for (const pill of document.querySelectorAll<HTMLButtonElement>(".artwork-filter-pill")) {
      const group = pill.dataset.filterGroup;
      const value = pill.dataset.filterValue;
      if (!group || !value) continue;
      const active = group === "format" && state.format === value;
      pill.classList.toggle("is-active", active);
      pill.setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  function handlePillClick(e: Event) {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const pill = t.closest<HTMLButtonElement>(".artwork-filter-pill");
    if (!pill) return;
    const group = pill.dataset.filterGroup as "format" | undefined;
    const value = pill.dataset.filterValue;
    if (!group || !value) return;
    const state = readStateFromHash();
    if (group === "format") {
      state.format = value as FilterState["format"];
    }
    writeStateToHash(state);
    applyState(state);
  }

  document.addEventListener("click", handlePillClick);
  window.addEventListener("hashchange", () => applyState(readStateFromHash()));

  applyState(readStateFromHash());
}
