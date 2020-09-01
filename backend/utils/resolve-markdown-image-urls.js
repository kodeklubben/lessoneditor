module.exports = (markdownContent) => {
  return markdownContent.replace(/(!\[.*?\]\()(.+?)(\))/gs, function (
    whole,
    prefix,
    imagePathRaw,
    postfix
  ) {
    const imageName = imagePathRaw.split("/").pop().replace(/\s/g, "");
    //const imageName = imgPathSplit[imgPathSplit.length - 1].replace(/\s/g, "");
    return prefix + imageName + postfix;
  });
};
