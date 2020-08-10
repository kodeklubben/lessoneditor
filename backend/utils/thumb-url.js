const createJwtToken = require("../auth/create-jwt-token");
module.exports = (secret, previewUrl) => {
  const url = new URL(process.env.THUMB_SERVICE_URL);
  const token = createJwtToken("na", secret);
  url.searchParams.append("url", previewUrl);
  url.searchParams.append("token", token);
  return url.toString();
};
