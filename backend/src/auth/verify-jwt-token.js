const jwt = require("jsonwebtoken");

module.exports = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.GITHUB_CLIENT_SECRET);
    return {
      valid: true,
      data: decoded,
    };
  } catch (err) {
    return {
      valid: false,
      error: err.message,
    };
  }
};
