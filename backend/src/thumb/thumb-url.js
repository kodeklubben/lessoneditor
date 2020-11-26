const createJwtToken = require("../auth/create-jwt-token");
module.exports = (previewUrl) => {
  const url = new URL(process.env.THUMB_SERVICE_URL);
  const token = createJwtToken("na", process.env.GITHUB_CLIENT_SECRET);
  url.searchParams.append("url", previewUrl);
  url.searchParams.append("token", token);
  return url.toString();
};
