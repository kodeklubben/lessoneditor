const { format } = require("util");
module.exports = (filename, bucket) => {
  const bucketName = bucket || process.env.BUCKET;
  return format(`https://storage.googleapis.com/${bucketName}/${filename}`);
};
