const gcsUrl = require("../utils/gcs-url");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const constants = require("../constants.json");
module.exports = async (filename, buffer, bucketName) => {
  const bucketN = bucketName || constants.BUCKET;
  const bucket = storage.bucket(bucketN);
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream();
  blobStream.on("error", (err) => {
    throw err;
  });
  let promise = new Promise((resolve) => {
    blobStream.on("finish", () => resolve());
  });
  blobStream.end(buffer);
  await promise;
  return gcsUrl(blob.name, bucketN);
};
