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
  JWT_SECRET: process.env.JWT_SECRET || randomBytes(32).toString("hex"),
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
  assert.equal(new URL(login.headers.get("location")).searchParams.get("scope"), "public_repo");
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
  await api(
    `/user/${userId}/lesson`,
    "POST",
    { lessonTitle: "Sti", lessonSlug: "../x", courseTitle: "Python", courseSlug: "python" },
    400,
  );
  // Machine translation is hidden: the module is not registered, so neither endpoint exists.
  await api("/translate/status", "GET", undefined, 404);
  await api(`/lesson/${lessonId}/translate`, "POST", { source: "lokal-test", language: "en" }, 404);
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
  const png = Buffer.from("smoke").toString("base64");
  const first = await api(
    `/lesson/${lessonId}/files`,
    "POST",
    { filename: "bilde", ext: ".png", content: png },
    201,
  );
  const second = await api(
    `/lesson/${lessonId}/files`,
    "POST",
    { filename: "bilde", ext: ".png", content: png },
    201,
  );
  assert.deepEqual(
    [first.filename, second.filename],
    ["bilde", "bilde-2"],
    "Image names are unique",
  );
  await api(`/lesson/${lessonId}/submit`, "POST", { message: "Must stay local" }, 403);
  const crossSite = await fetch(`${base}/api/lesson/${lessonId}/files/lokal-test`, {
    method: "PUT",
    headers: { Cookie: cookie, "Content-Type": "application/json", Origin: "https://evil.example" },
    body: JSON.stringify({ content: "overwritten" }),
  });
  assert.equal(crossSite.status, 403, "Cross-site writes are refused");
  assert.equal((await api(`/lesson/${lessonId}`)).submitted, false);
  await api(
    `/lesson/${lessonId}/user`,
    "POST",
    { invitationByUserId: String(otherId), invitationToUserId: String(otherId) },
    201,
  );
  const members = await api(`/lesson/${lessonId}/users`);
  assert.equal(members.length, 2);
  assert.ok(
    members.every((member) => !("email" in member)),
    "Members do not see e-mail addresses",
  );
  const shared = await api(
    `/user/${userId}/lesson`,
    "POST",
    { lessonTitle: "Delt", lessonSlug: "delt", courseTitle: "Python", courseSlug: "python" },
    201,
  );
  await api(`/lesson/${shared}/user`, "POST", { invitationToUserId: String(otherId) }, 201);
  await api(`/user/${userId}/lesson/${shared}`, "DELETE");
  const left = await client.query(
    'SELECT count(*)::int AS n FROM file_store WHERE "lessonLessonId" = $1',
    [shared],
  );
  assert.equal(left.rows[0].n, 0, "A shared lesson is deleted completely");

  browser = await puppeteer.launch({
    headless: true,
    args: process.env.CI ? ["--no-sandbox"] : [],
  });
  const page = await browser.newPage();
  const errors = [];
  const thirdParty = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // React warnings (deprecated APIs, key and ref problems) only show up in the console.
  page.on("console", (message) => {
    if (["error", "warn"].includes(message.type()))
      consoleErrors.push(`${message.type()}: ${message.text()} (${message.location()?.url ?? ""})`);
  });
  page.on("request", (request) => {
    if (/fonts\.googleapis|fonts\.gstatic|run\.app/.test(request.url()))
      thirdParty.push(request.url());
  });
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
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll(".preview-area img")].some(
        (image) => image.src.startsWith("blob:") && image.naturalWidth > 0,
      ),
    { timeout: 10000 },
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
  assert.equal(await page.$$eval('[role="status"]', (nodes) => nodes.length), 1, "One autosave");
  const unnamed = await page.$$eval("button, [role=button]", (nodes) =>
    nodes
      .filter((node) => node.offsetParent !== null)
      .filter(
        (node) =>
          !(
            node.getAttribute("aria-label") ||
            node.textContent.trim() ||
            node.getAttribute("title")
          ),
      )
      .map((node) => node.outerHTML.slice(0, 80)),
  );
  assert.deepEqual(unnamed, [], "Every visible button has a name");
  assert.equal(await page.$eval("html", (html) => html.lang), "nb");
  assert.equal(await page.$$eval(".buttonpanel_small_devices", (n) => n.length), 0);
  await page.type("textarea.text-area", "\n\nFlush marker");
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[aria-label="Til prosjektoversikt"]'),
  ]);
  assert.ok(
    (await api(`/lesson/${lessonId}/files/lokal-test`)).content.includes("Flush marker"),
    "Leaving the editor saves the last seconds",
  );
  await page.goto(`${base}/editor/${lessonId}/lokal-test/nb`);
  await page.waitForSelector("textarea.text-area", { visible: true });
  mkdirSync("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/editor-desktop.png", fullPage: true });
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/editor-mobile.png", fullPage: true });
  await page.setViewport({ width: 1440, height: 1000 });
  // With a topic set, the lesson data dialog does not open on top of the landing page.
  await api(`/lesson/${lessonId}/files/lesson`, "PUT", {
    content: {
      level: 1,
      license: "CC BY-SA 4.0",
      tags: { topic: ["app"], subject: [], grade: [] },
    },
  });
  await page.goto(`${base}/landingpage/${lessonId}`);
  await page.locator("button::-p-text(Ny tekstfil)").click();
  await page.waitForSelector("::-p-text(Opprett ny tekstfil)");
  assert.equal(
    await page.$$eval(".ui.modal", (m) => m.some((x) => x.textContent.includes("maskinoversett"))),
    false,
    "The translate option is hidden",
  );
  await page.locator(".ui.modal button::-p-text(Fortsett)").click();
  await page
    .waitForFunction(() => location.pathname.includes("/editor/"), { timeout: 15000 })
    .catch(async () => {
      const text = await page.$$eval(".ui.modal", (m) => m.map((x) => x.textContent).join(" | "));
      throw new Error(`No editor after creating a text: ${text}`);
    });
  assert.match(page.url(), /\/editor\/\d+\/lokal-test\/nn/);
  assert.ok((await api(`/lesson/${lessonId}/filenames`)).includes("lokal-test_nn.md"));
  // A text saved while the thumbnail is taken (15–20 s in App Engine) must survive it.
  const thumbnail = api(`/lesson/${lessonId}/files/lokal-test/updateThumbnail`, "PUT");
  await new Promise((resolve) => setTimeout(resolve, 300));
  await api(`/lesson/${lessonId}/files/lokal-test`, "PUT", { content: "# Lagret under bildet\n" });
  await thumbnail;
  assert.equal(
    (await api(`/lesson/${lessonId}/files/lokal-test`)).content,
    "# Lagret under bildet\n",
    "The thumbnail does not write back a text saved while it was taken",
  );
  const image = await client.query(
    'SELECT content FROM file_store WHERE "lessonLessonId" = $1 AND filename = $2',
    [lessonId, "preview"],
  );
  assert.equal(image.rows[0].content.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.ok(image.rows[0].content.length > 1000);
  writeFileSync("test-results/thumbnail.png", image.rows[0].content);
  writeFileSync("test-results/console.log", consoleErrors.join("\n"));
  assert.deepEqual(errors, [], "Browser runtime errors");
  assert.deepEqual(thirdParty, [], "No requests to Google Fonts or the old translation server");
  const scratch = await api(
    `/user/${userId}/lesson`,
    "POST",
    {
      lessonTitle: "Scratch",
      lessonSlug: "scratch-test",
      courseTitle: "Scratch",
      courseSlug: "scratch",
      language: "nb",
    },
    201,
  );
  const scratchFile = await api(`/lesson/${scratch}/files/scratch-test`);
  await api(`/lesson/${scratch}/files/scratch-test`, "PUT", {
    content: scratchFile.content.replace(
      /(# .*)/,
      "$1\n\nTrykk `når grønt flagg klikkes`{.b} og `si [Hei!]`{.b}.",
    ),
  });
  await page.goto(`${base}/preview/${scratch}/scratch-test`);
  await page.waitForFunction(() => document.querySelectorAll(".preview-area svg").length >= 2, {
    timeout: 15000,
  });
  assert.equal(
    await page.$$eval(".preview-area code.b", (n) => n.length),
    0,
    "Inline {.b} blocks are drawn",
  );
  await api(`/user/${userId}/lesson/${scratch}`, "DELETE");
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
