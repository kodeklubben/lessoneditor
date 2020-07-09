const path = require("path");
module.exports = (markdownContent, baseUrl) => {
  return markdownContent.replace(/(!\[.*?\]\()(.+?)(\))/gs, function (
    whole,
    prefix,
    imagePathRaw,
    postfix
  ) {
    const imagePath = imagePathRaw.trim();
    let absoluteImagePath = imagePath;
    if (!imagePath.startsWith("http")) {
      const url = new URL(baseUrl);
      url.pathname = path.join(url.pathname, imagePath);
      absoluteImagePath = url.toString();
    }
    return prefix + " " + absoluteImagePath + " " + postfix;
  });
};
