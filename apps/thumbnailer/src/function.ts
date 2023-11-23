import takeScreenshot from "./app/take-screenshot";
import { HttpFunction } from "@google-cloud/functions-framework";
import logger from "./app/logger";

// import env variable LOCAL_FRONTEND_URL from .env file
const dotenv = require("dotenv");

dotenv.config();

const fastq = require("fastq");

const initTime = new Date().toISOString();

let queue = fastq.promise(worker, 1);

async function worker(task: any) {
  let { url, token, res } = task;
  const waitForSelector = "div.preview-area";
  const buffer = await takeScreenshot(url, token, waitForSelector);
  res.writeHead(200, {
    "Content-Type": "image/png",
  });
  logger.info("Completed " + url);
  res.end(buffer);
}

export const thumbnailer: HttpFunction = async (req, res) => {
  let { url, token } = req.query;

  const isDev = process.env.NODE_ENV !== "production";

  if (isDev && typeof url === "string") {
    url = url.replace("localhost:8080", process.env.LOCAL_FRONTEND_URL);
  }

  if (url && token) {
    try {
      logger.info("Start fetching " + url);
      queue.push({ url, token, res }).catch((e) => {
        logger.error("Error" + e.message, {
          trace: e.trace,
        });
        res.status(500).send(e.message);
      });
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
