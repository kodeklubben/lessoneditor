const axios = require("axios");

module.exports = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (e) {
    return null;
  }
};
