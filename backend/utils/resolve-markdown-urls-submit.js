module.exports = (markdownContent) => {
  let imgNames = [];
  let imgUrls = [];
  const resolvedMarkdown = markdownContent.replace(
    /(!\[.*?\]\()(.+?)(\))/gs,
    function (whole, prefix, imagePathRaw, postfix) {
      imgUrls.push(imagePathRaw);
      const imgPathSplit = imagePathRaw.split("/");
      imgNames.push(imgPathSplit[imgPathSplit.length - 1]);
      return prefix + imgNames[imgNames.length - 1] + postfix;
    }
  );
  return [resolvedMarkdown, imgNames, imgUrls];
};
