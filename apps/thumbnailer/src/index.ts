import type { HttpFunction } from "@google-cloud/functions-framework";
import takeScreenshot from "./app/take-screenshot";
import fastq from "fastq";
import "dotenv/config";
import { previewUrl } from "./app/preview-url";

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
  const token = req.query.token;
  try {
    url = previewUrl(req.query.url);
    if (typeof token !== "string" || !token || token.length > 4096)
      throw new Error("Invalid token");
  } catch {
    res.status(400).send("A valid preview URL and token are required");
    return;
  }
  if (queue.length() >= 10) {
    res.status(503).send("Thumbnail service is busy");
    return;
  }
  try {
    const buffer = await queue.push({ url: url.href, token: token as string });
    res.set("Content-Type", "image/png").set("Cache-Control", "no-store").status(200).send(buffer);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message.replaceAll(token as string, "[redacted]")
        : "Unknown error";
    console.error("Thumbnail generation failed:", message);
    res.status(500).send("Thumbnail generation failed");
  }
};
