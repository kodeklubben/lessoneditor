import { createHash } from "crypto";
import { readFileSync } from "fs";
import type { ServerResponse } from "http";

/**
 * Paths of the editor's own pages (/, /editor/…, /landingpage/…): no file extension in the last
 * segment. Only these get index.html. A missing file such as an old main.<hash>.js gets a 404, not
 * index.html served as JavaScript, which left the page blank without an error.
 */
export const APP_ROUTE = /^(?!.*\/[^/]*\.[^/]*$).*$/;

/** Webpack names its bundles, fonts and images with a content hash: main.d05959138a44b950.js. */
const CONTENT_HASHED = /\.[0-9a-f]{16,}\.[a-z0-9]+$/i;

/**
 * Cache headers for the built frontend.
 *
 * App Engine gives every file the same modification time (1980), and Express's default ETag is
 * made of size and time. A new index.html of the same size as the old one then got the same ETag,
 * browsers were told 304 Not Modified and kept the old page, which pointed to bundles the new
 * version no longer has. index.html now gets an ETag from its content and the start time as
 * Last-Modified, and must be revalidated on every load. Content-hashed files never change and
 * are cached for a year.
 */
export function staticCacheHeaders(startedAt = new Date()) {
  const etags = new Map<string, string>();
  return (res: ServerResponse, path: string) => {
    if (path.endsWith("index.html")) {
      let etag = etags.get(path);
      if (!etag) {
        const hash = createHash("sha256").update(readFileSync(path)).digest("base64url");
        etag = `"${hash.slice(0, 27)}"`;
        etags.set(path, etag);
      }
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("ETag", etag);
      res.setHeader("Last-Modified", startedAt.toUTCString());
    } else if (CONTENT_HASHED.test(path)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  };
}
