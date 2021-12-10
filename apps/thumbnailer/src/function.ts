import takeScreenshot from "./app/take-screenshot";
import { HttpFunction } from "@google-cloud/functions-framework";
import logger from "./app/logger";

const initTime = new Date().toISOString();
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
export const thumbnailer: HttpFunction = async (req, res) => {
  const { url, token } = req.query;
  if (url && token) {
    try {
      logger.info("Start fetching " + url);
      const waitForSelector = null;
      const buffer = await takeScreenshot(url, token, waitForSelector);
      res.writeHead(200, {
        "Content-Type": "image/png",
      });
      logger.info("Completed " + url);
      res.end(buffer);
    } catch (e) {
      logger.error("Error" + e.message, {
        trace: e.trace,
      });
      res.status(500).send(e.message);
    }
  } else {
    res
      .status(400)
      .set("txt")
      .send("Url and token need to be set. Function created: " + initTime);
  }
};
