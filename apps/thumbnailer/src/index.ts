import { HttpFunction } from "@google-cloud/functions-framework";
import takeScreenshot from "./app/take-screenshot";
import * as fastq from "fastq";
import * as dotenv from "dotenv";

dotenv.config();

const initTime = new Date().toISOString();
let queue = fastq.promise(worker, 1);

async function worker(task: any) {
  let { url, token, res } = task;
  const waitForSelector = "div.preview-area";
  const buffer = await takeScreenshot(url, token, waitForSelector);
  res.writeHead(200, {
    "Content-Type": "image/png",
  });
  console.log("Completed", url);
  res.end(buffer);
}

export const thumbnailer: HttpFunction = async (req, res) => {
  let { url, token } = req.query;
  const isDev = process.env.NODE_ENV !== "production";

  console.log("Received request", {
    hasToken: !!token,
    tokenLength: token ? token.toString().length : 0,
    tokenStart: token ? token.toString().substring(0, 10) + '...' : 'none',
    url: url
  });

  if (isDev && typeof url === "string") {
    const localFrontendUrl = process.env.LOCAL_FRONTEND_URL || "localhost:3000";
    url = url.replace("localhost:8080", localFrontendUrl);
  }

  if (url && token) {
    try {
      console.log("Start fetching with token", {
        url,
        tokenPreview: token.toString().substring(0, 20) + '...'
      });
      
      await queue.push({ url, token, res }).catch((error: Error) => {
        console.error("Error:", error.message, {
          trace: error.stack,
          token: token.toString().substring(0, 15) + '...'
        });
        res.status(500).send(error.message);
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error:", err.message, {
        trace: err.stack,
        token: token.toString().substring(0, 15) + '...'
      });
      res.status(500).send(err.message);
    }
  } else {
    console.warn("Missing required parameters", {
      hasUrl: !!url,
      hasToken: !!token
    });
    
    res
      .status(400)
      .set("Content-Type", "text/plain")
      .send("Url and token need to be set. Function created: " + initTime);
  }
};
