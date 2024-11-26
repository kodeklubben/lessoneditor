import * as puppeteer from "puppeteer";
import { Browser, Page } from "puppeteer";

let browser: Browser | null = null;

async function getBrowserInstance(): Promise<Browser> {
  if (!browser) {
    console.log("Creating a new browser");
    browser = await puppeteer.launch({
      headless: true, // eller "headless: false" hvis du trenger et GUI
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    });
  }
  return browser;
}

async function takeScreenshot(
  url: string,
  token: string,
  waitForSelector?: string
): Promise<Buffer> {
  const metadata = { component: "takeScreenshot" };
  const browser = await getBrowserInstance();
  let page: Page | null = null;

  try {
    page = await browser.newPage();
    await page.setExtraHTTPHeaders({ Authorization: `Bearer ${token}` });
    page.setDefaultNavigationTimeout(13000);
    await page.setViewport({ width: 600, height: 1000, deviceScaleFactor: 1 });

    await page.goto(url, { waitUntil: "networkidle0" });

    if (waitForSelector) {
      console.log("Waiting for selector:", waitForSelector, metadata);
      await page.waitForSelector(waitForSelector, { visible: true });
    }

    const screenshotBuffer = await page.screenshot({ type: "png", encoding: "binary" });

    if (!(screenshotBuffer instanceof Buffer)) {
      throw new Error("Screenshot failed, did not return a buffer");
    }

    return screenshotBuffer;
  } catch (error) {
    const err = error as Error;
    console.error("Error taking screenshot:", err.message, metadata);
    throw error; // Re-throw the error for the caller to handle
  } finally {
    if (page) await page.close(); // Make sure to close the page to free up resources
  }
}

export async function killBrowser() {
  if (browser) {
    await browser.close();
    browser = null; // Set browser to null to ensure clean re-initialization
  }
}

export default takeScreenshot;
