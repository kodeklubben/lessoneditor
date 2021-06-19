const resolveMarkdownImageUrls = (markdownContent) => {
    return markdownContent.replace(/(!\[.*?\]\()(.+?)(\))/gs, function (
        whole,
        prefix,
        imagePathRaw,
        postfix
    ) {
        const imageName = imagePathRaw.split("/").pop().replace(/\s/g, "");
        return prefix + imageName + postfix;
    });
};

export default resolveMarkdownImageUrls
