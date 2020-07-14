module.exports = (markdownContent) => {
  const images = [];
  const resolvedMarkdown = markdownContent.replace(
    /(!\[.*?\]\()(.+?)(\))/gs,
    function (whole, prefix, imagePathRaw, postfix) {
      const imgPathSplit = imagePathRaw.split("/");
      const imageName = imgPathSplit[imgPathSplit.length - 1];
      images.push({ name: imageName, url: imagePathRaw });
    }
  );
  return images;
};
