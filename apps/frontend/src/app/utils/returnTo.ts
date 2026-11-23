const KEY = "lessoneditor.returnTo";

/** Only the editor's own pages: a path, not another site (//evil.example) or a scheme. */
const isOwnPath = (path: string) => /^\/(?!\/)[^\s\\]*$/.test(path);

/** Remembers the page a signed-out visitor came to, so the sign-in can end there. */
export function rememberReturnTo(path: string) {
  if (path === "/" || !isOwnPath(path)) return;
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    // Storage blocked: the visitor lands on the front page after signing in instead.
  }
}

/** The remembered page, once; null when there is none. */
export function takeReturnTo(): string | null {
  try {
    const path = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return path && isOwnPath(path) ? path : null;
  } catch {
    return null;
  }
}
