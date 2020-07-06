const { format } = require("util");
const constants = require("../constants.json");
module.exports = (filename, bucket) => {
  const bucketName = bucket || constants.BUCKET;
  return format(`${constants.GOOGLE_STORAGE_PREFIX}/${bucketName}/${filename}`);
};
