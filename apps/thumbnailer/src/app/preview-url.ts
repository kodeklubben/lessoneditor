export function previewUrl(input: unknown, frontendUrl = process.env.FRONTEND_URL): URL {
  if (typeof input !== "string" || !frontendUrl) throw new Error("Invalid preview URL");
  const base = new URL(frontendUrl);
  const url = new URL(input);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.origin !== base.origin ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !/^\/preview\/[1-9]\d*\/[^/]+$/.test(url.pathname)
  )
    throw new Error("Invalid preview URL");
  return url;
}
