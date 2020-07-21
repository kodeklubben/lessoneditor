const createJwtToken = require("../auth/create-jwt-token");
module.exports = (username, secret, previewUrl) => {
  const serviceUrl = process.env.THUMB_SERVICE_URL
    ? process.env.THUMB_SERVICE_URL
    : "http://localhost:3012";
  const url = new URL(serviceUrl);
  const token = createJwtToken(username, secret);
  url.searchParams.append("url", previewUrl);
  url.searchParams.append("token", token);
  return url.toString();
};
