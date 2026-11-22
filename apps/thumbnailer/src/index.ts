import type { HttpFunction } from "@google-cloud/functions-framework";
import takeScreenshot from "./app/take-screenshot";
import fastq from "fastq";
import "dotenv/config";
import { readRequest } from "./app/read-request";
import logger from "./app/logger";

type Task = { url: string; token: string };
const queue = fastq.promise(
  async ({ url, token }: Task) => takeScreenshot(url, token, "div.preview-area"),
  1,
);

export const thumbnailer: HttpFunction = async (req, res) => {
  if (req.method !== "GET") {
    res.set("Allow", "GET").status(405).send("Method not allowed");
    return;
  }
  let url: URL;
  let token: string;
  try {
    ({ url, token } = readRequest(req.query, (name) => req.get(name)));
  } catch {
    res.status(400).send("A valid preview URL and an X-Preview-Token header are required");
    return;
  }
  if (queue.length() >= 10) {
    res.status(503).send("Thumbnail service is busy");
    return;
  }
  try {
    const buffer = await queue.push({ url: url.href, token });
    res.set("Content-Type", "image/png").set("Cache-Control", "no-store").status(200).send(buffer);
  } catch (error) {
    const message =
      error instanceof Error ? error.message.replaceAll(token, "[redacted]") : "Unknown error";
    logger.error("Thumbnail generation failed", { error: message });
    res.status(500).send("Thumbnail generation failed");
  }
};
