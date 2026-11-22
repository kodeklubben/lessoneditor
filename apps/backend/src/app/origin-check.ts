import type { NextFunction, Request, Response } from "express";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * CSRF protection for cookie-authenticated writes, on top of SameSite=Lax. A browser always sends
 * Origin with cross-site POST/PUT/DELETE, so a foreign Origin (or Sec-Fetch-Site: cross-site) is
 * refused. Requests without either header do not come from a browser and carry no victim cookies.
 */
export function isAllowedWrite(
  method: string,
  headers: Record<string, string | string[] | undefined>,
  allowedOrigin: string,
): boolean {
  if (SAFE_METHODS.has(method.toUpperCase())) return true;
  const origin = headers.origin;
  if (typeof origin === "string" && origin !== "") return origin === allowedOrigin;
  const site = headers["sec-fetch-site"];
  return site === undefined || site === "same-origin" || site === "none";
}

export function originCheck(frontendUrl: string) {
  const allowedOrigin = new URL(frontendUrl).origin;
  return (req: Request, res: Response, next: NextFunction) => {
    if (isAllowedWrite(req.method, req.headers, allowedOrigin)) return next();
    res.status(403).json({ statusCode: 403, message: "Cross-site request refused" });
  };
}
