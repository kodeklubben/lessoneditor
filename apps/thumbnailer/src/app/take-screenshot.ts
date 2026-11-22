import * as puppeteer from "puppeteer";
import type { Browser, Page } from "puppeteer";
import { previewUrl } from "./preview-url";

let browserPromise: Promise<Browser> | undefined;

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
