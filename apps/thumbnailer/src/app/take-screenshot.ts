import * as puppeteer from "puppeteer";
import type { Browser, Page } from "puppeteer";
import { previewUrl } from "./preview-url";

let browserPromise: Promise<Browser> | undefined;

/**
 * Gets Chromium ready ahead of the first thumbnail. Launching it was not enough: in App Engine
 * the first picture after a launch still took 12 s against 6 s for the next ones (renderer
 * process, fonts, DNS and TLS to the app, compiling its script). So the app's own front page is
 * rendered once too, with no credentials and the same settings as a real preview.
 */
export async function warmUpBrowser(frontendUrl = process.env.FRONTEND_URL): Promise<void> {
  const browser = await getBrowserInstance();
  if (!frontendUrl) return;
  const origin = new URL(frontendUrl).origin;
  const context = await browser.createBrowserContext();
  try {
    const page = await context.newPage();
    await page.setCacheEnabled(false);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (new URL(request.url()).origin === origin) void request.continue();
      else void request.abort();
    });
    await page.setViewport({ width: 600, height: 1000, deviceScaleFactor: 1 });
    await page.goto(`${origin}/`, { waitUntil: "networkidle0", timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
  } catch {
    // Warming up is best effort; the real thumbnail does the work if this did not.
  } finally {
    await context.close().catch(() => undefined);
  }
}

async function getBrowserInstance(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({
        headless: true,
        args:
          process.env.NODE_ENV === "production" || process.env.CI
            ? ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
            : [],
      })
      .then((browser) => {
        browser.once("disconnected", () => {
          browserPromise = undefined;
        });
        return browser;
      })
      .catch((error) => {
        browserPromise = undefined;
        throw error;
      });
  }
  return browserPromise;
}

export default async function takeScreenshot(
  url: string,
  token: string,
  waitForSelector?: string,
): Promise<Buffer> {
  const target = previewUrl(url);
  const browser = await getBrowserInstance();
  const context = await browser.createBrowserContext();
  let page: Page | undefined;
  try {
    page = await context.newPage();
    await page.setCacheEnabled(false);
    // Credentials only go to our own app, never to images or embedded third-party pages.
    const externalOrigins = new Set([
      "https://makecode.microbit.org",
      "https://www.youtube-nocookie.com",
      "https://player.vimeo.com",
    ]);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const requestedUrl = new URL(request.url());
      if (requestedUrl.origin === target.origin) {
        void request.continue({
          headers: { ...request.headers(), authorization: `Bearer ${token}` },
        });
      } else if (
        ["data:", "blob:"].includes(requestedUrl.protocol) ||
        externalOrigins.has(requestedUrl.origin)
      ) {
        const headers = { ...request.headers() };
        delete headers.authorization;
        void request.continue({ headers });
      } else {
        void request.abort();
      }
    });
    page.setDefaultTimeout(15000);
    await page.setViewport({ width: 600, height: 1000, deviceScaleFactor: 1 });
    const response = await page.goto(target.href, { waitUntil: "networkidle0" });
    if (!response?.ok()) throw new Error(`Preview request failed (${response?.status()})`);
    if (waitForSelector) await page.waitForSelector(waitForSelector, { visible: true });
    await page.evaluate(() => document.fonts.ready);
    return Buffer.from(await page.screenshot({ type: "png", encoding: "binary" }));
  } finally {
    await context.close();
  }
}

export async function killBrowser() {
  const pending = browserPromise;
  browserPromise = undefined;
  if (pending) await (await pending).close();
}
