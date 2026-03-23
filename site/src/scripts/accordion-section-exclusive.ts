/**
 * One open panel per `.accordion-section` (button toggles + `.is-open` for CSS grid height).
 */
const w = window as Window & { __andetagAccordionExclusive?: boolean };
if (!w.__andetagAccordionExclusive) {
  w.__andetagAccordionExclusive = true;
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const btn = t.closest(".accordion-item-toggle");
    if (!btn || !(btn instanceof HTMLButtonElement)) return;
    const item = btn.closest(".accordion-item");
    const section = item?.closest(".accordion-section");
    if (!item || !section) return;

    const wasOpen = item.classList.contains("is-open");
    if (wasOpen) {
      item.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      return;
    }

    for (const other of section.querySelectorAll(".accordion-item")) {
      if (other === item) continue;
      other.classList.remove("is-open");
      const ob = other.querySelector(".accordion-item-toggle");
      if (ob instanceof HTMLButtonElement) ob.setAttribute("aria-expanded", "false");
    }
    item.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  });
}
