import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "crypto";
import type { Request } from "express";
import "express-session";

declare module "express-session" {
  interface SessionData {
    /** The GitHub OAuth token, AES-256-GCM encrypted. Never sent to the browser. */
    githubToken?: string;
  }
}

const VERSION = "v1";

function key(secret = process.env.SESSION_SECRET): Buffer {
  if (!secret) throw new Error("SESSION_SECRET is required to protect GitHub tokens");
  return Buffer.from(hkdfSync("sha256", secret, "lessoneditor", "github-token", 32));
}

/** Encrypts a token so the session row in Postgres does not hold it in clear text. */
export function encryptToken(token: string, secret?: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(secret), iv);
  const data = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return [VERSION, iv, cipher.getAuthTag(), data]
    .map((part) => part.toString("base64url"))
    .join(".");
}

/** Returns undefined for anything that is missing, tampered with or encrypted with another secret. */
export function decryptToken(value: unknown, secret?: string): string | undefined {
  if (typeof value !== "string") return undefined;
  const [version, iv, tag, data] = value.split(".");
  if (version !== VERSION || !iv || !tag || !data) return undefined;
  try {
    const decipher = createDecipheriv("aes-256-gcm", key(secret), Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(data, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return undefined;
  }
}

/** Set by the OAuth strategy for the duration of the callback request only. */
export type RequestWithGithubToken = Request & { githubAccessToken?: string };

export function sessionGithubToken(request: Request): string | undefined {
  return decryptToken(request.session?.githubToken);
}

/**
 * Revokes the token at GitHub (DELETE /applications/{client_id}/token), so a token that leaked
 * before logout stops working. Failures are logged without the token and do not block logout.
 */
export async function revokeGithubToken(
  token: string,
  fetchImpl: typeof fetch = fetch,
  clientId = process.env.GH_CLIENT_ID,
  clientSecret = process.env.GH_CLIENT_SECRET,
): Promise<boolean> {
  if (!token || !clientId || !clientSecret) return false;
  try {
    const response = await fetchImpl(`https://api.github.com/applications/${clientId}/token`, {
      method: "DELETE",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ access_token: token }),
      signal: AbortSignal.timeout(5000),
    });
    // 404 means GitHub no longer knows the token, which is the outcome we want.
    return response.status === 204 || response.status === 404;
  } catch (error) {
    console.error("Could not revoke GitHub token:", error instanceof Error ? error.name : "error");
    return false;
  }
}
