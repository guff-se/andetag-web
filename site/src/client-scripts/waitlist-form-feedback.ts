/**
 * Brevo waitlist posts into a hidden iframe; show sending + success copy in-page
 * (the response HTML is cross-origin and not readable).
 */

const ROOT = ".waitlist-embed";

function copy(locale: string | undefined): { sending: string; success: string } {
  if (locale === "de") {
    return {
      sending: "Wird gesendet …",
      success: "Danke. Du stehst auf der Liste.",
    };
  }
  if (locale === "sv") {
    return {
      sending: "Skickar …",
      success: "Tack. Du står med på listan.",
    };
  }
  return {
    sending: "Sending…",
    success: "Thank you. You are on the list.",
  };
}

function bind(root: HTMLElement): void {
  const locale = root.dataset.locale;
  const { sending, success } = copy(locale);
  const form = root.querySelector<HTMLFormElement>("form#sib-form");
  const iframe = root.querySelector<HTMLIFrameElement>("iframe.waitlist-embed__submit-frame");
  const status = root.querySelector<HTMLElement>(".waitlist-embed__status");
  if (!form || !iframe || !status) return;

  let awaitingResponse = false;

  form.addEventListener("submit", () => {
    if (!form.checkValidity()) return;
    awaitingResponse = true;
    status.hidden = false;
    status.textContent = sending;
    const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (btn) btn.disabled = true;
  });

  iframe.addEventListener("load", () => {
    if (!awaitingResponse) return;
    awaitingResponse = false;
    status.textContent = success;
    const shell = root.querySelector<HTMLElement>(".sib-form");
    if (shell) shell.hidden = true;
  });
}

function boot(): void {
  const w = window as Window & { __andetagWaitlistFeedback?: boolean };
  if (w.__andetagWaitlistFeedback) return;
  w.__andetagWaitlistFeedback = true;
  document.querySelectorAll<HTMLElement>(ROOT).forEach(bind);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
