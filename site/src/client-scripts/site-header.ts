/**
 * Sticky nav (desktop + mobile) and mobile menu toggle for the shared hero header.
 * Runs as a deferred module; all queried elements are guaranteed to exist.
 */

const navShell = document.querySelector<HTMLElement>("[data-hero-nav-shell]");
const heroHeader = document.querySelector<HTMLElement>(".shared-hero-header");

if (navShell && heroHeader) {
  const syncSticky = () => {
    const navHeight = navShell.getBoundingClientRect().height;
    const threshold =
      heroHeader.getBoundingClientRect().top +
      window.scrollY +
      heroHeader.getBoundingClientRect().height -
      navHeight;
    if (window.scrollY >= threshold) {
      navShell.classList.add("is-stuck");
    } else {
      navShell.classList.remove("is-stuck");
    }
  };

  syncSticky();
  window.addEventListener("scroll", syncSticky, { passive: true });
  window.addEventListener("resize", syncSticky);
}

const mobileNavShell = document.querySelector<HTMLElement>(
  "[data-hero-mobile-nav-shell]",
);
if (mobileNavShell && heroHeader) {
  const mobileStickTop = 8;
  let mobileStickStart = 0;

  const recalcMobileStickStart = () => {
    const wasStuck = mobileNavShell.classList.contains("is-stuck");
    if (wasStuck) {
      mobileNavShell.classList.remove("is-stuck");
    }

    mobileStickStart =
      mobileNavShell.getBoundingClientRect().top +
      window.scrollY -
      mobileStickTop;

    if (wasStuck && window.scrollY >= mobileStickStart) {
      mobileNavShell.classList.add("is-stuck");
    }
  };

  const syncMobileSticky = () => {
    if (window.scrollY >= mobileStickStart) {
      mobileNavShell.classList.add("is-stuck");
    } else {
      mobileNavShell.classList.remove("is-stuck");
    }
  };

  recalcMobileStickStart();
  syncMobileSticky();
  window.addEventListener("scroll", syncMobileSticky, { passive: true });
  window.addEventListener("resize", () => {
    recalcMobileStickStart();
    syncMobileSticky();
  });
}

const heroMenuToggle = document.querySelector<HTMLButtonElement>(
  "[data-hero-menu-toggle]",
);
const heroMobileMenu = document.querySelector<HTMLElement>(
  "#shared-hero-mobile-menu",
);
if (heroMenuToggle && heroMobileMenu) {
  const focusableSelector =
    "a[href], button:not([disabled]), summary, [tabindex]:not([tabindex='-1'])";
  const getFirstFocusable = () =>
    heroMobileMenu.querySelector<HTMLElement>(focusableSelector);

  const closeMenu = (restoreFocus: boolean) => {
    heroMenuToggle.setAttribute("aria-expanded", "false");
    heroMobileMenu.hidden = true;
    if (restoreFocus) {
      heroMenuToggle.focus();
    }
  };

  const openMenu = () => {
    heroMenuToggle.setAttribute("aria-expanded", "true");
    heroMobileMenu.hidden = false;
    requestAnimationFrame(() => {
      const firstFocusable = getFirstFocusable();
      if (firstFocusable) {
        firstFocusable.focus();
      }
    });
  };

  heroMenuToggle.addEventListener("click", () => {
    const expanded =
      heroMenuToggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu(false);
    } else {
      openMenu();
    }
  });

  heroMenuToggle.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu(false);
    }
  });

  heroMobileMenu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    }
  });

  heroMobileMenu.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a[href]")) {
      closeMenu(false);
    }
  });
}
