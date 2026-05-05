/**
 * Inquiry form behaviour.
 *
 * - Pre-fills the "About" field from `?about=<artwork-id>` (set by the
 *   "Inquire" link on each artwork card, e.g. `#inquiry?about=andetag-13`).
 * - Posts the form to `/_inquiry` and shows success/error status in place.
 * - Honeypot rejection is silent.
 *
 * If the backend returns non-2xx, the user sees an error state instead of a
 * false success signal.
 */
const w = window as Window & { __andetagInquiryForm?: boolean };
if (!w.__andetagInquiryForm) {
  w.__andetagInquiryForm = true;

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

  document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement) || !form.matches("[data-inquiry-form]")) return;
    e.preventDefault();

    const honeypot = form.querySelector<HTMLInputElement>('input[name="company"]');
    if (honeypot && honeypot.value.trim() !== "") {
      // Spam: silently mark success without sending anywhere.
      showStatus(form, "success");
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
      showStatus(form, response.ok ? "success" : "error");
    } catch {
      showStatus(form, "error");
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  function showStatus(form: HTMLFormElement, state: "success" | "error") {
    const status = form.querySelector<HTMLElement>("[data-inquiry-status]");
    if (status) {
      const key = state === "success" ? "inquirySuccess" : "inquiryError";
      status.textContent = status.dataset[key] || status.textContent || "";
      status.hidden = false;
    }
    if (state === "success") form.reset();
  }
}
