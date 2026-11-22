/** Checked by main.ts before the app starts, so env() never throws for these while it runs. */
export const REQUIRED_ENV = [
  "GH_CLIENT_ID",
  "GH_CLIENT_SECRET",
  "GH_CALLBACK_URL",
  "FRONTEND_URL",
  "THUMB_SERVICE_URL",
  "COOKIE_SECRET",
  "SESSION_SECRET",
  "JWT_SECRET",
] as const;

/** A configuration value that must be set; a missing one is a deployment error, not a default. */
export function env(
  name: (typeof REQUIRED_ENV)[number] | "GH_LESSON_REPO_OWNER" | "GH_LESSON_REPO",
): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
