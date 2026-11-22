import { previewUrl } from "./preview-url";

export const PREVIEW_TOKEN_HEADER = "x-preview-token";

/**
 * The preview URL comes in the query string and the token in the X-Preview-Token header. A token
 * in the query string is refused: query strings are written to the request log. Authorization is
 * left for Google's ID token, so the function can be made private without changing this.
 */
export function readRequest(
  query: Record<string, unknown>,
  header: (name: string) => string | undefined,
  frontendUrl = process.env.FRONTEND_URL,
): { url: URL; token: string } {
  if (query.token !== undefined) throw new Error("Token in query string");
  const token = header(PREVIEW_TOKEN_HEADER);
  if (typeof token !== "string" || !token || token.length > 4096) throw new Error("Invalid token");
  return { url: previewUrl(query.url, frontendUrl), token };
}
