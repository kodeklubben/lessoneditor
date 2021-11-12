import thumbUrl from "./thumb-url";
import saveFile from "../storage/save-file";
import isAppEngine from "../utils/isAppEngine";
import gcsUrl from "../utils/gcs-url";
import downloadImage from "../storage/download-image";

const thumbFetch = async (previewUrl, storagePath) => {
  const url = thumbUrl(previewUrl);
  console.log("thumbUrl", url);
  const imageBuffer = await downloadImage(url);
  if (imageBuffer) await saveFile(storagePath, imageBuffer);
  if (isAppEngine()) {
    return gcsUrl(storagePath.join("/"));
  } else {
    storagePath.shift();
    return "/api/display/" + storagePath.join("/");
  }
};

export default thumbFetch;
