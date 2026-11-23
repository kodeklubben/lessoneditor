import { mkdirSync, mkdtempSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { APP_ROUTE, staticCacheHeaders } from "./static-assets";

const headersFor = (setHeaders: ReturnType<typeof staticCacheHeaders>, path: string) => {
  const headers: Record<string, string> = {};
  setHeaders(
    { setHeader: (name: string, value: string) => (headers[name] = value) } as never,
    path,
  );
  return headers;
};

describe("static assets", () => {
  it("sends index.html only for the editor's own pages", () => {
    for (const path of ["/", "/editor/30/claude-test/nb", "/landingpage/25", "/logout"]) {
      expect(APP_ROUTE.test(path)).toBe(true);
    }
    for (const path of ["/main.54878aae4681b1f0.js", "/favicon.ico", "/editor/1/x/nb.js"]) {
      expect(APP_ROUTE.test(path)).toBe(false);
    }
  });

  it("gives index.html an ETag from its content, not its size", () => {
    const dir = mkdtempSync(join(tmpdir(), "static-"));
    const oldIndex = join(dir, "old", "index.html");
    const newIndex = join(dir, "new", "index.html");
    for (const [file, bundle] of [
      [oldIndex, "main.54878aae4681b1f0.js"],
      [newIndex, "main.d05959138a44b950.js"],
    ]) {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, `<script src="/${bundle}"></script>`); // same length
    }
    const setHeaders = staticCacheHeaders(new Date("2026-11-22T22:00:00Z"));
    const before = headersFor(setHeaders, oldIndex);
    const after = headersFor(setHeaders, newIndex);
    expect(before.ETag).not.toBe(after.ETag);
    expect(after["Cache-Control"]).toBe("no-cache");
    expect(after["Last-Modified"]).toBe("Sun, 22 Nov 2026 22:00:00 GMT");
  });

  it("caches content-hashed files for a year and leaves the rest alone", () => {
    const setHeaders = staticCacheHeaders();
    expect(headersFor(setHeaders, "/srv/frontend/main.d05959138a44b950.js")["Cache-Control"]).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(
      headersFor(setHeaders, "/srv/frontend/lato-latin-400-normal.be36596da218e1eec01c.woff2")[
        "Cache-Control"
      ],
    ).toBe("public, max-age=31536000, immutable");
    expect(headersFor(setHeaders, "/srv/frontend/favicon.ico")).toEqual({});
  });
});
