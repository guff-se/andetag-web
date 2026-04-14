import {
  decideEnglishHubRouting,
  decideRootRouting,
  entrySetCookieHeader,
  entryTokenForContentPath,
} from "./entry-routing-logic";

export interface Env {
  ASSETS: Fetcher;
}

function redirect302(locationPath: string, setCookie?: string): Response {
  const headers = new Headers({ Location: locationPath });
  if (setCookie) headers.append("Set-Cookie", setCookie);
  return new Response(null, { status: 302, headers });
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    if (method !== "GET" && method !== "HEAD") {
      return env.ASSETS.fetch(request);
    }

    const cf = request.cf as { botManagement?: { verifiedBot?: boolean } } | undefined;

    const enNorm = normalizeEnPath(url.pathname, url.search);
    if (enNorm) return enNorm;

    const deSvNorm = normalizeDeSvRoots(url.pathname, url.search);
    if (deSvNorm) return deSvNorm;

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
        return redirect302(d.locationPath, d.setCookie);
      }
      return redirect302(`/en/${url.search}`);
    }

    if (url.pathname === "/en/") {
      const d = decideEnglishHubRouting({
        pathname: url.pathname,
        search: url.search,
        cookieHeader: request.headers.get("Cookie"),
        userAgent: request.headers.get("User-Agent"),
        cf,
      });
      if (d.type === "redirect") {
        return redirect302(d.locationPath);
      }
    }

    const assetResponse = await env.ASSETS.fetch(request);
    return withAssetEntryCookieRefresh(request, assetResponse);
  },
};
