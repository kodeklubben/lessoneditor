const createJwtToken = require("../auth/create-jwt-token");
module.exports = (username, secret, previewUrl) => {
  const url = new URL(process.env.THUMB_SERVICE_URL);
  const token = createJwtToken(username, secret);
  url.searchParams.append("url", previewUrl);
  url.searchParams.append("token", token);
  return url.toString();
};
