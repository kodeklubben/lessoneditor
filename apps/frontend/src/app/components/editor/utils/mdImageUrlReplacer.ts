

export const resolveMarkdownImageUrls = (markdownContent: string) => {
  return markdownContent.replace(
    /(!\[.*?\]\()(.+?)(\))/gs,
    (whole, prefix, imagePathRaw, postfix) => {
      const imageName = imagePathRaw.split("/").pop().replace(/\s/g, "");
      return prefix + imageName + postfix;
    }
  );
};
