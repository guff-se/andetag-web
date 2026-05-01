import { describe, expect, it, vi } from "vitest";
import entryRouter from "./entry-router";
import type { Env } from "./entry-router";

function makeEnv(
  fetchImpl: (request: Request) => Promise<Response>,
): Env {
  return { ASSETS: { fetch: fetchImpl } as unknown as Fetcher };
}

function htmlResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("entry-router Worker", () => {
  it("redirects / to a language path (302)", async () => {
    const env = makeEnv(() => Promise.resolve(htmlResponse("")));
    const req = new Request("https://www.andetag.museum/", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBeTruthy();
  });

  it("redirects verified bots at / with 301 to /en/stockholm/ (SEO-0020)", async () => {
    const env = makeEnv(() => Promise.resolve(htmlResponse("")));
    const req = new Request("https://www.andetag.museum/", {
      headers: { "User-Agent": "Googlebot" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("/en/stockholm/");
  });

  it("redirects verified bots at /en/ to /en/stockholm/ (SEO-0021)", async () => {
    const assetFetch = vi.fn(() =>
      Promise.resolve(htmlResponse("<html><body>EN hub</body></html>")),
    );
    const env = makeEnv(assetFetch);
    const req = new Request("https://www.andetag.museum/en/", {
      headers: { "User-Agent": "Googlebot" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(assetFetch).not.toHaveBeenCalled();
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/en/stockholm/");
  });

  it("normalizes /en to /en/ with 301", async () => {
    const env = makeEnv(() => Promise.resolve(htmlResponse("")));
    const req = new Request("https://www.andetag.museum/en", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("/en/");
  });

  it("normalizes /de to /de/berlin/ with 301", async () => {
    const assetFetch = vi.fn(() => Promise.resolve(htmlResponse("")));
    const env = makeEnv(assetFetch);
    const req = new Request("https://www.andetag.museum/de", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(assetFetch).not.toHaveBeenCalled();
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("/de/berlin/");
  });

  it("normalizes /de with query to /de/berlin/ with 301", async () => {
    const env = makeEnv(() => Promise.resolve(htmlResponse("")));
    const req = new Request("https://www.andetag.museum/de?utm_source=x", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("/de/berlin/?utm_source=x");
  });

  it("normalizes /sv and /sv/ to /sv/stockholm/ with 301", async () => {
    for (const path of ["/sv", "/sv/"]) {
      const assetFetch = vi.fn(() => Promise.resolve(htmlResponse("")));
      const envInner = makeEnv(assetFetch);
      const req = new Request(`https://www.andetag.museum${path}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const res = await entryRouter.fetch(req, envInner);
      expect(assetFetch).not.toHaveBeenCalled();
      expect(res.status).toBe(301);
      expect(res.headers.get("Location")).toBe("/sv/stockholm/");
    }
  });

  it("passes normal asset requests through to ASSETS", async () => {
    const assetBody = "<html><body>Stockholm</body></html>";
    const assetFetch = vi.fn(() => Promise.resolve(htmlResponse(assetBody)));
    const env = makeEnv(assetFetch);
    const req = new Request("https://www.andetag.museum/sv/stockholm/", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(assetFetch).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("appends Set-Cookie on HTML 200 responses under a lane path", async () => {
    const assetFetch = vi.fn(() =>
      Promise.resolve(htmlResponse("<html></html>")),
    );
    const env = makeEnv(assetFetch);
    const req = new Request("https://www.andetag.museum/sv/stockholm/musik/", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(res.status).toBe(200);
    expect(res.headers.get("Set-Cookie")).toContain("andetag_entry=v1:sv");
  });

  it("does NOT append Set-Cookie on non-HTML responses", async () => {
    const assetFetch = vi.fn(() =>
      Promise.resolve(jsonResponse({ ok: true })),
    );
    const env = makeEnv(assetFetch);
    const req = new Request(
      "https://www.andetag.museum/sv/stockholm/api.json",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    const res = await entryRouter.fetch(req, env);
    expect(res.status).toBe(200);
    expect(res.headers.get("Set-Cookie")).toBeNull();
  });

  it("does NOT append Set-Cookie on non-200 responses", async () => {
    const assetFetch = vi.fn(() =>
      Promise.resolve(
        new Response("Not Found", {
          status: 404,
          headers: { "Content-Type": "text/html" },
        }),
      ),
    );
    const env = makeEnv(assetFetch);
    const req = new Request("https://www.andetag.museum/sv/stockholm/nope/", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(res.status).toBe(404);
    expect(res.headers.get("Set-Cookie")).toBeNull();
  });

  it("forwards non-GET/HEAD methods directly to ASSETS", async () => {
    const assetFetch = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 204 })),
    );
    const env = makeEnv(assetFetch);
    const req = new Request("https://www.andetag.museum/sv/stockholm/", {
      method: "POST",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const res = await entryRouter.fetch(req, env);
    expect(assetFetch).toHaveBeenCalled();
    expect(res.status).toBe(204);
  });
});
