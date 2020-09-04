const path = require("path");
const getScratchFilenames = require("./get-scratch-filenames");
module.exports = async (markdownContent, lessonId) => {
  const scratch = await getScratchFilenames();
  return markdownContent.replace(/(!\[.*?\]\()(.+?)(\))/gs, function (
    whole,
    prefix,
    imagePathRaw,
    postfix
  ) {
    const imageName = imagePathRaw.split("/").pop().trim();
    let absoluteImagePath;
    if (scratch.includes(imageName)) {
      absoluteImagePath = `/file/bilder/${imageName}`;
    } else {
      absoluteImagePath = `/file/drafts/${lessonId}/${imageName}`;
    }

    return prefix + absoluteImagePath + postfix;
  });
};
