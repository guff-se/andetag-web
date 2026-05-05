import {
  decideEnglishHubRouting,
  decideLocationShortcutRouting,
  decideRootRouting,
  entrySetCookieHeader,
  entryTokenForContentPath,
} from "./entry-routing-logic";

export interface Env {
  ASSETS: Fetcher;
  BREVO_TRANSACTIONAL_API_KEY?: string;
  INQUIRY_RECIPIENT_EMAIL?: string;
}

const INQUIRY_PATH = "/_inquiry";
const DEFAULT_INQUIRY_RECIPIENT = "info@andetag.museum";
const INQUIRY_SENDER_EMAIL = "info@andetag.museum";
const INQUIRY_SENDER_NAME = "ANDETAG Website";

function redirectResponse(
  locationPath: string,
  setCookie?: string,
  permanent?: boolean,
): Response {
  const headers = new Headers({ Location: locationPath });
  if (setCookie) headers.append("Set-Cookie", setCookie);
  return new Response(null, { status: permanent ? 301 : 302, headers });
}

/** Set or refresh `andetag_entry` on HTML **200** responses under a lane path. */
function withAssetEntryCookieRefresh(request: Request, response: Response): Response {
  const m = request.method.toUpperCase();
  if (m !== "GET" && m !== "HEAD") return response;
  if (response.status !== 200) return response;
  const ct = response.headers.get("Content-Type") ?? "";
  if (!ct.includes("text/html")) return response;
  const token = entryTokenForContentPath(new URL(request.url).pathname);
  if (!token) return response;
  const headers = new Headers(response.headers);
  headers.append("Set-Cookie", entrySetCookieHeader(token));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** Trailing-slash policy: `/en` → `/en/` (`301`, query preserved). */
function normalizeEnPath(pathname: string, search: string): Response | null {
  if (pathname === "/en") {
    return new Response(null, {
      status: 301,
      headers: { Location: `/en/${search}` },
    });
  }
  return null;
}

/** Language-only roots → default location home (`301`, query preserved). */
function normalizeDeSvRoots(pathname: string, search: string): Response | null {
  if (pathname === "/de") {
    return new Response(null, {
      status: 301,
      headers: { Location: `/de/berlin/${search}` },
    });
  }
  if (pathname === "/sv" || pathname === "/sv/") {
    return new Response(null, {
      status: 301,
      headers: { Location: `/sv/stockholm/${search}` },
    });
  }
  return null;
}

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function field(form: FormData, name: string): string {
  const raw = form.get(name);
  return typeof raw === "string" ? raw.trim() : "";
}

async function handleInquiry(request: Request, env: Env): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: "invalid_form_data" });
  }

  const company = field(form, "company");
  if (company !== "") return json(200, { ok: true });

  const name = field(form, "name");
  const email = field(form, "email");
  const locale = field(form, "locale") || "en";
  const phone = field(form, "phone");
  const about = field(form, "about");
  const message = field(form, "message");
  const optIn = field(form, "opt_in");

  if (!name || !email || optIn !== "1") {
    return json(400, { ok: false, error: "missing_required_fields" });
  }

  const apiKey = env.BREVO_TRANSACTIONAL_API_KEY;
  if (!apiKey) {
    console.error(
      JSON.stringify({
        event: "inquiry_send_skipped",
        reason: "missing_brevo_api_key",
      }),
    );
    return json(202, { ok: true });
  }

  const recipient = env.INQUIRY_RECIPIENT_EMAIL || DEFAULT_INQUIRY_RECIPIENT;
  const subject = locale === "sv" ? "Ny konstverksforfragan" : "New artwork inquiry";
  const safe = {
    locale: escapeHtml(locale),
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone || "-"),
    about: escapeHtml(about || "-"),
    message: escapeHtml(message || "-"),
  };
  const htmlContent = [
    "<h1>Artwork inquiry</h1>",
    `<p><strong>Locale:</strong> ${safe.locale}</p>`,
    `<p><strong>Name:</strong> ${safe.name}</p>`,
    `<p><strong>Email:</strong> ${safe.email}</p>`,
    `<p><strong>Phone:</strong> ${safe.phone}</p>`,
    `<p><strong>Work:</strong> ${safe.about}</p>`,
    `<p><strong>Message:</strong><br/>${safe.message.replaceAll("\n", "<br/>")}</p>`,
  ].join("");
  const textContent = [
    "Artwork inquiry",
    `Locale: ${locale}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "-"}`,
    `Work: ${about || "-"}`,
    "Message:",
    message || "-",
  ].join("\n");

  try {
    const upstream = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: INQUIRY_SENDER_EMAIL, name: INQUIRY_SENDER_NAME },
        to: [{ email: recipient }],
        replyTo: { email, name },
        subject,
        textContent,
        htmlContent,
      }),
    });

    if (!upstream.ok) {
      console.error(
        JSON.stringify({
          event: "inquiry_send_failed",
          status: upstream.status,
        }),
      );
      return json(502, { ok: false, error: "email_send_failed" });
    }
  } catch {
    console.error(JSON.stringify({ event: "inquiry_send_error" }));
    return json(502, { ok: false, error: "email_send_failed" });
  }

  return json(200, { ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    if (method === "POST" && url.pathname === INQUIRY_PATH) {
      return handleInquiry(request, env);
    }

    if (method !== "GET" && method !== "HEAD") {
      return env.ASSETS.fetch(request);
    }

    const cf = request.cf as
      | { country?: string | null; botManagement?: { verifiedBot?: boolean } }
      | undefined;

    const enNorm = normalizeEnPath(url.pathname, url.search);
    if (enNorm) return enNorm;

    const deSvNorm = normalizeDeSvRoots(url.pathname, url.search);
    if (deSvNorm) return deSvNorm;

    if (
      url.pathname === "/berlin" ||
      url.pathname === "/berlin/" ||
      url.pathname === "/stockholm" ||
      url.pathname === "/stockholm/"
    ) {
      const location = url.pathname.startsWith("/berlin") ? "berlin" : "stockholm";
      const target = decideLocationShortcutRouting({
        location,
        search: url.search,
        cookieHeader: request.headers.get("Cookie"),
        acceptLanguage: request.headers.get("Accept-Language"),
      });
      return redirectResponse(target);
    }

    if (url.pathname === "/" || url.pathname === "") {
      const d = decideRootRouting({
        pathname: url.pathname,
        search: url.search,
        acceptLanguage: request.headers.get("Accept-Language"),
        cookieHeader: request.headers.get("Cookie"),
        userAgent: request.headers.get("User-Agent"),
        cf,
      });
      if (d.type === "redirect") {
        return redirectResponse(d.locationPath, d.setCookie, d.permanent);
      }
      return redirectResponse(`/en/${url.search}`);
    }

    if (url.pathname === "/en/") {
      const d = decideEnglishHubRouting({
        pathname: url.pathname,
        search: url.search,
        acceptLanguage: request.headers.get("Accept-Language"),
        cookieHeader: request.headers.get("Cookie"),
        userAgent: request.headers.get("User-Agent"),
        cf,
      });
      if (d.type === "redirect") {
        return redirectResponse(d.locationPath, d.setCookie, d.permanent);
      }
    }

    const assetResponse = await env.ASSETS.fetch(request);
    return withAssetEntryCookieRefresh(request, assetResponse);
  },
};
