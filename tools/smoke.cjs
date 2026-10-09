/* Runs against a migrated, local-only database and removes its own fixtures. */
require("dotenv").config({ quiet: true });
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { randomBytes, randomInt, createHmac } = require("node:crypto");
const { mkdirSync, writeFileSync } = require("node:fs");
const { Client } = require("pg");
const puppeteer = require("puppeteer");

const base = "http://localhost:44100";
const thumb = "http://localhost:44112";
const children = [];
const logs = [];
let browser;
let lessonId;
const userId = randomInt(2000000000, 2000100000);
const otherId = userId + 100000;
const sessionId = randomBytes(24).toString("hex");
const client = new Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});
const env = {
  ...process.env,
  NODE_ENV: "test",
  PORT: "44100",
  HOST: "localhost",
  FRONTEND_URL: base,
  THUMB_SERVICE_URL: thumb,
  DISABLE_PULL_REQUESTS: "true",
};
const signature = createHmac("sha256", env.SESSION_SECRET)
  .update(sessionId)
  .digest("base64")
  .replace(/=+$/, "");
const cookieValue = `s:${sessionId}.${signature}`;
const cookie = `connect.sid=${encodeURIComponent(cookieValue)}`;

function start(args) {
  const child = spawn(process.execPath, args, { env, stdio: ["ignore", "pipe", "pipe"] });
  children.push(child);
  for (const output of [child.stdout, child.stderr])
    output.on("data", (data) => {
      logs.push(data.toString());
      mkdirSync("test-results", { recursive: true });
      writeFileSync("test-results/services.log", logs.join(""));
    });
}

async function ready(url) {
  for (let attempt = 0; attempt < 25; attempt++) {
    if (children.some((child) => child.exitCode !== null))
      throw new Error("A service exited before startup");
    try {
      await fetch(url, { signal: AbortSignal.timeout(1000) });
      return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Service did not start: ${url}`);
}

async function api(path, method = "GET", body, expected = 200) {
  const response = await fetch(`${base}/api${path}`, {
    method,
    signal: AbortSignal.timeout(45000),
    headers: { Cookie: cookie, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  assert.equal(response.status, expected, `${method} ${path}: ${await response.clone().text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}

async function run() {
  assert.ok(
    ["localhost", "127.0.0.1", "::1"].includes(env.POSTGRES_HOST),
    "Smoke tests require a local database",
  );
  assert.notEqual(process.env.NODE_ENV, "production", "Smoke tests are disabled in production");
  await client.connect();
  await client.query(
    'INSERT INTO "user" ("userId", username, name, email, photo) VALUES ($1, $2, $2, $3, $4), ($5, $6, $6, $3, $4)',
    [userId, `smoke-${userId}`, "smoke@example.invalid", "", otherId, `smoke-${otherId}`],
  );
  await client.query('INSERT INTO session (id, "expiredAt", json) VALUES ($1, $2, $3)', [
    sessionId,
    Date.now() + 3600000,
    JSON.stringify({
      cookie: {
        originalMaxAge: 3600000,
        expires: new Date(Date.now() + 3600000).toISOString(),
        httpOnly: true,
        path: "/",
      },
      passport: { user: userId },
    }),
  ]);
  start(["dist/apps/backend/apps/backend/src/main.js"]);
  start([
    "node_modules/@google-cloud/functions-framework/build/src/main.js",
    "--source=apps/thumbnailer",
    "--target=thumbnailer",
    "--port=44112",
  ]);
  await Promise.all([ready(base), ready(thumb)]);
  console.log("Services started; checking authenticated API flows");

  assert.equal((await fetch(`${base}/api/user`)).status, 401);
  assert.equal((await fetch(`${base}/api/missing`)).status, 404);
  const login = await fetch(`${base}/api/auth/login`, { redirect: "manual" });
  assert.equal(login.status, 302);
  assert.equal(new URL(login.headers.get("location")).hostname, "github.com");
  assert.ok(new URL(login.headers.get("location")).searchParams.get("state"));
  assert.equal((await api("/user")).userId, userId);
  await api(`/user/${otherId}/lessons`, "GET", undefined, 403);
  lessonId = await api(
    `/user/${userId}/lesson`,
    "POST",
    {
      lessonTitle: "Lokal testoppgave",
      lessonSlug: "lokal-test",
      courseTitle: "Python",
      courseSlug: "python",
      language: "nb",
    },
    201,
  );
  const files = await api(`/lesson/${lessonId}/filenames`);
  assert.ok(files.includes("lokal-test.md"));
  const file = await api(`/lesson/${lessonId}/files/lokal-test`);
  const markdown = file.content.replace(/(# .*)/, "$1\n\nLagring fungerer lokalt.");
  await api(`/lesson/${lessonId}/files/lokal-test`, "PUT", { content: markdown });
  assert.equal((await api(`/lesson/${lessonId}/files/lokal-test`)).content, markdown);
  await api(
    `/lesson/${lessonId}/files`,
    "POST",
    { filename: "../bad", ext: ".md", content: "test" },
    400,
  );
  await api(
    `/lesson/${lessonId}/files`,
    "POST",
    { filename: "ekstra", ext: ".md", content: "Ekstra fil" },
    201,
  );
  await api(`/lesson/${lessonId}/files/ekstra/md`, "DELETE");
  await api(`/lesson/${lessonId}/submit`, "POST", { message: "Must stay local" }, 403);
  assert.equal((await api(`/lesson/${lessonId}`)).submitted, false);
  await api(
    `/lesson/${lessonId}/user`,
    "POST",
    { invitationByUserId: String(otherId), invitationToUserId: String(otherId) },
    201,
  );

  browser = await puppeteer.launch({
    headless: true,
    args: process.env.CI ? ["--no-sandbox"] : [],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewport({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.waitForSelector(".not-logged-in-page");
  await browser.setCookie({
    name: "connect.sid",
    value: encodeURIComponent(cookieValue),
    domain: "localhost",
    path: "/",
    httpOnly: true,
  });
  await page.goto(`${base}/editor/${lessonId}/lokal-test/nb`);
  await page.waitForSelector("textarea.text-area", { visible: true });
  await page.waitForFunction(() =>
    document.querySelector("textarea.text-area")?.value.includes("Lagring fungerer lokalt."),
  );
  await page.$eval("textarea.text-area", (element) => {
    element.focus();
    element.setSelectionRange(element.value.length, element.value.length);
  });
  await page.type("textarea.text-area", "\n\nSmoke autosave marker");
  let saved;
  for (let attempt = 0; attempt < 30; attempt++) {
    saved = await api(`/lesson/${lessonId}/files/lokal-test`);
    if (saved.content.includes("Smoke autosave marker")) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(saved.content.includes("Smoke autosave marker"), "Editor autosave persists typed text");
  assert.ok(saved.content.includes("authorList:"), "Autosave preserves markdown metadata");
  mkdirSync("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/editor-desktop.png", fullPage: true });
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/editor-mobile.png", fullPage: true });
  await api(`/lesson/${lessonId}/files/lokal-test/updateThumbnail`, "PUT");
  const image = await client.query(
    'SELECT content FROM file_store WHERE "lessonLessonId" = $1 AND filename = $2',
    [lessonId, "preview"],
  );
  assert.equal(image.rows[0].content.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.ok(image.rows[0].content.length > 1000);
  writeFileSync("test-results/thumbnail.png", image.rows[0].content);
  assert.deepEqual(errors, [], "Browser runtime errors");
  assert.equal(
    (
      await fetch(
        `${thumb}?url=${encodeURIComponent("http://169.254.169.254/preview/1/test")}&token=test`,
      )
    ).status,
    400,
  );
  const logout = await fetch(`${base}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: cookie },
    redirect: "manual",
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(logout.status, 302);
  assert.equal((await fetch(`${base}/api/user`, { headers: { Cookie: cookie } })).status, 401);
  console.log(
    "PASS: authentication boundaries, CRUD, sharing, disabled GitHub writes, desktop/mobile editor and real PNG thumbnail",
  );
}

run()
  .catch((error) => {
    console.error(error.message);
    mkdirSync("test-results", { recursive: true });
    writeFileSync("test-results/services.log", logs.join(""));
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
    for (const child of children) child.kill("SIGTERM");
    if (lessonId) {
      await client.query('DELETE FROM user_lessons_lesson WHERE "lessonLessonId" = $1', [lessonId]);
      await client.query('DELETE FROM lesson WHERE "lessonId" = $1', [lessonId]);
    }
    await client.query("DELETE FROM session WHERE id = $1", [sessionId]);
    await client.query('DELETE FROM "user" WHERE "userId" IN ($1, $2)', [userId, otherId]);
    await client.end();
  });
