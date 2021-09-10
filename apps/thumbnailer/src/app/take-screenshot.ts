import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";
import logger from "./logger";

let browser: Browser;

export async function killBrowser() {
  if (browser) {
    await browser.close();
  }
}

const takeScreenshot = async (url, token, waitForSelector?) => {
  const metadata = {
    component: "takeScreenshot",
  };
  if (!browser) {
    logger.info("Creating a new browser", metadata);
    browser = await puppeteer.launch({
      headless: true,
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
    logger.debug("Browser created", metadata);
  }
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    Authorization: "Bearer " + token,
  });
  await page.setDefaultNavigationTimeout(9000);
  await page.setViewport({
    width: 600,
    height: 1000,
    deviceScaleFactor: 1,
  });
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  if (waitForSelector) {
    logger.info("Waiting for selector: " + waitForSelector);
    await page.waitForSelector(waitForSelector, {
      timeout: 15000,
    });
  } else {
    logger.info("Waiting for timeout", metadata);
    await page.waitForTimeout(3000);
  }
  const screenShotBuffer = await page.screenshot({
    type: "png",
    encoding: "binary",
  });
  await page.close();
  if (screenShotBuffer instanceof Buffer) {
    return screenShotBuffer;
  } else {
    throw Error("Something failed, page.screenshot did not return a buffer as expected");
  }
};

export default takeScreenshot;
