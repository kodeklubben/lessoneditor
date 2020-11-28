module.exports = (markdownContent) => {
  const images = [];
  const matches = [...markdownContent.matchAll(/(!\[.*?\]\()(.+?)(\))/gs)];
  matches.map((match) => {
    const imagePathRaw = match[2];
    const imageName = imagePathRaw.split("/").pop();
    images.push({ name: imageName, url: imagePathRaw });
  });
  return images;
};
