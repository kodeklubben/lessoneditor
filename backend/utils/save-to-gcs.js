const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

module.exports = async (filename, buffer, bucketName) => {
  const bucketN = bucketName || process.env.GCLOUD_STORAGE_BUCKET;
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
  return format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
};
