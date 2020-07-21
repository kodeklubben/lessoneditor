const puppeteer = require("puppeteer");
let browser;
module.exports = async (url, token) => {
  if (!browser) {
    console.log("Creating a new browser.");
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
  }
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    Authorization: "Bearer " + token,
  });
  await page.setDefaultNavigationTimeout(3000);
  await page.setViewport({
    width: 600,
    height: 1000,
    deviceScaleFactor: 1,
  });
  await page.goto(url);
  await page.waitForSelector("div.PreviewArea", {
    timeout: 5000,
  });
  const screenShotBuffer = await page.screenshot({
    encoding: "binary",
    waitUntil: "networkidle0",
  });
  await page.close();
  return screenShotBuffer;
};
