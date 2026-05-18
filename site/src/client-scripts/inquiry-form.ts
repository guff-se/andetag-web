/**
 * Inquiry form behaviour.
 *
 * - Pre-fills the "About" field from `?about=<artwork-id>` (set by the
 *   "Inquire" link on each artwork card, e.g. `#inquiry?about=andetag-13`).
 * - Posts the form to `/_inquiry` and shows success inline.
 * - Shows errors in a modal (consent missing vs generic send failure).
 * - Honeypot rejection is silent.
 *
 * If the backend returns non-2xx, the user sees an error state instead of a
 * false success signal.
 */
const w = window as Window & { __andetagInquiryForm?: boolean };
if (!w.__andetagInquiryForm) {
  w.__andetagInquiryForm = true;

  let activeErrorModal: HTMLElement | null = null;
  let errorModalKeyHandler: ((e: KeyboardEvent) => void) | null = null;

  function readAboutFromHash(): string | null {
    const hash = location.hash.replace(/^#/, "");
    if (!hash) return null;
    const match = hash.match(/(?:^|[?&])about=([^&]+)/);
    return match ? decodeURIComponent(match[1]!) : null;
  }

  function applyAboutFromHash() {
    const about = readAboutFromHash();
    if (!about) return;
    const fields = document.querySelectorAll<HTMLInputElement>("[data-inquiry-about]");
    for (const f of fields) {
      if (!f.value) f.value = about;
    }
  }

  function scrollToInquiry() {
    if (!location.hash.startsWith("#inquiry")) return;
    const target = document.getElementById("inquiry");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  applyAboutFromHash();
  scrollToInquiry();
  window.addEventListener("hashchange", () => {
    applyAboutFromHash();
    scrollToInquiry();
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const dismiss = target.closest("[data-inquiry-error-dismiss]");
    if (!dismiss) return;
    const modal = dismiss.closest<HTMLElement>("[data-inquiry-error-modal]");
    if (modal) closeErrorModal(modal);
  });

  document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement) || !form.matches("[data-inquiry-form]")) return;
    e.preventDefault();

    const honeypot = form.querySelector<HTMLInputElement>('input[name="company"]');
    if (honeypot && honeypot.value.trim() !== "") {
      // Spam: silently mark success without sending anywhere.
      showSuccess(form);
      return;
    }

    if (!isOptInChecked(form)) {
      showError(form, "consent");
      return;
    }

    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submit) submit.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        showSuccess(form);
      } else {
        showError(form, "generic");
      }
    } catch {
      showError(form, "generic");
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  function isOptInChecked(form: HTMLFormElement): boolean {
    const optIn = form.querySelector<HTMLInputElement>('input[name="opt_in"]');
    return optIn?.checked === true;
  }

  function getErrorModal(form: HTMLFormElement): HTMLElement | null {
    return form.closest(".inquiry-form")?.querySelector<HTMLElement>("[data-inquiry-error-modal]") ?? null;
  }

  function showSuccess(form: HTMLFormElement) {
    const status = form.querySelector<HTMLElement>("[data-inquiry-status]");
    if (status) {
      status.textContent = status.dataset.inquirySuccess || status.textContent || "";
      status.hidden = false;
    }
    clearOptInHighlight(form);
    form.reset();
  }

  function showError(form: HTMLFormElement, kind: "consent" | "generic") {
    const modal = getErrorModal(form);
    if (!modal) return;

    const message = modal.querySelector<HTMLElement>("[data-inquiry-error-message]");
    const text =
      kind === "consent"
        ? modal.dataset.inquiryErrorConsent || ""
        : modal.dataset.inquiryErrorGeneric || "";
    if (message) message.textContent = text;

    if (kind === "consent") highlightOptIn(form);

    openErrorModal(modal);
  }

  function highlightOptIn(form: HTMLFormElement) {
    const optIn = form.querySelector<HTMLInputElement>('input[name="opt_in"]');
    const label = optIn?.closest("label");
    label?.classList.add("inquiry-form__optin--invalid");
    optIn?.setAttribute("aria-invalid", "true");
  }

  function clearOptInHighlight(form: HTMLFormElement) {
    const optIn = form.querySelector<HTMLInputElement>('input[name="opt_in"]');
    const label = optIn?.closest("label");
    label?.classList.remove("inquiry-form__optin--invalid");
    optIn?.removeAttribute("aria-invalid");
  }

  function openErrorModal(modal: HTMLElement) {
    closeErrorModal(modal, { restoreFocus: false });

    modal.removeAttribute("hidden");
    document.body.classList.add("is-modal-open");

    const dismiss = modal.querySelector<HTMLButtonElement>("[data-inquiry-error-dismiss]");
    dismiss?.focus();

    activeErrorModal = modal;
    errorModalKeyHandler = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeErrorModal(modal);
    };
    document.addEventListener("keydown", errorModalKeyHandler);
  }

  function closeErrorModal(modal: HTMLElement, options: { restoreFocus?: boolean } = {}) {
    const { restoreFocus = true } = options;

    if (activeErrorModal === modal) {
      if (errorModalKeyHandler) {
        document.removeEventListener("keydown", errorModalKeyHandler);
        errorModalKeyHandler = null;
      }
      activeErrorModal = null;
    }

    modal.setAttribute("hidden", "");
    if (!document.querySelector(".inquiry-form__error-modal:not([hidden])")) {
      document.body.classList.remove("is-modal-open");
    }

    if (restoreFocus) {
      const form = modal.closest(".inquiry-form")?.querySelector<HTMLFormElement>("[data-inquiry-form]");
      const optIn = form?.querySelector<HTMLInputElement>('input[name="opt_in"]');
      if (optIn?.getAttribute("aria-invalid") === "true") {
        optIn.focus();
        optIn.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      form?.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus();
    }
  }

  document.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement) || target.name !== "opt_in") return;
    const form = target.closest<HTMLFormElement>("[data-inquiry-form]");
    if (form) clearOptInHighlight(form);
  });
}
