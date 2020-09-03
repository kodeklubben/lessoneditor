module.exports = (markdownContent) => {
  return markdownContent.replace(/(!\[.*?\]\()(.+?)(\))/gs, function (
    whole,
    prefix,
    imagePathRaw,
    postfix
  ) {
    let imageName;
    const imagePathSplit = imagePathRaw.split("/");
    if (imagePathSplit[imagePathSplit.length - 2] === "bilder") {
      const imageNameList = imagePathSplit.slice(
        imagePathSplit.length - 2,
        imagePathSplit.length
      );
      imageNameList.unshift("..");
      imageName = imageNameList.join("/").trim();
    } else {
      imageName = imagePathSplit.pop().trim();
    }
    return prefix + imageName + postfix;
  });
};
