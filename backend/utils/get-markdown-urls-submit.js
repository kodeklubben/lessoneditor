const scratchFilenames = require("./get-scratch-filenames");
module.exports = async (markdownContent, lessonId, baseUrl) => {
  const scratch = await scratchFilenames();
  const images = [];
  const matches = [...markdownContent.matchAll(/(!\[.*?\]\()(.+?)(\))/gs)];
  matches.map((match) => {
    const imagePathRaw = match[2].trim();
    const imagePathParts = imagePathRaw.split("/");
    const imageName = imagePathParts.pop();
    if (!scratch.includes(imageName)) {
      if (imagePathParts.includes("file" && "drafts" && lessonId)) {
        images.push({
          name: imageName,
          url: `${baseUrl}/api/display/${lessonId}/${imageName}`,
        });
      } else {
        images.push({ name: imageName, url: imagePathRaw });
      }
    }
  });
  return images;
};
