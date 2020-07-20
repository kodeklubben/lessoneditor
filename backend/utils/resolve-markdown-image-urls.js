module.exports = (markdownContent) => {
  return markdownContent.replace(/(!\[.*?\]\()(.+?)(\))/gs, function (
    whole,
    prefix,
    imagePathRaw,
    postfix
  ) {
    const imgPathSplit = imagePathRaw.split("/");
    const imageName = imgPathSplit[imgPathSplit.length - 1];
    return prefix + imageName + postfix;
  });
};
