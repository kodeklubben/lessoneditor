const scratchFilenames = require("./get-scratch-filenames");
module.exports = async (markdownContent) => {
  const scratch = await scratchFilenames();
  const images = [];
  const matches = [...markdownContent.matchAll(/(!\[.*?\]\()(.+?)(\))/gs)];
  matches.map((match) => {
    const imagePathRaw = match[2].trim();
    const imageName = imagePathRaw.split("/").pop();
    if (!scratch.includes(imageName)) {
      images.push({ name: imageName, url: imagePathRaw });
    }
  });
  return images;
};
