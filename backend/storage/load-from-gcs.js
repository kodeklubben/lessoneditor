const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
module.exports = (filename, bucketName) => {
  const bucket = storage.bucket(bucketName || process.env.BUCKET);
  return bucket.file(filename).createReadStream();
};
