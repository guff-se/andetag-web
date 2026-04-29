/**
 * Inquiry form behaviour.
 *
 * - Pre-fills the "About" field from `?about=<artwork-id>` (set by the
 *   "Inquire" link on each artwork card, e.g. `#inquiry?about=andetag-13`).
 * - Posts the form to `/_inquiry` and shows a calm confirmation in place.
 * - Honeypot rejection is silent.
 *
 * Worker integration ships in a follow-up PR; until the worker exists, the POST
 * fails gracefully and the user still sees the confirmation copy. The inbound
 * email (when the worker is live) is the system of record, not this UI.
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
      showStatus(form);
      return;
    }

    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submit) submit.disabled = true;

    try {
      const formData = new FormData(form);
      await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
    } catch {
      // Network failure: still show the confirmation; the inbound email is the
      // system of record, and the user has nothing to do differently.
    }

    showStatus(form);
  });

  function showStatus(form: HTMLFormElement) {
    const status = form.querySelector<HTMLElement>("[data-inquiry-status]");
    if (status) status.hidden = false;
    form.reset();
  }
}
