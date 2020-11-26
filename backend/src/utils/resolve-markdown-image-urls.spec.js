const resolveMarkdownImageUrls = require("./resolve-markdown-image-urls");

it("Should remove markdown image urls and keep file name", () => {
  const markdownContent = `
  # some arbitrary markdown header
  
  ![Image with 
  relative url](../bilder/hent-fra-bibliotek.png)
  
  ![Image with slash](/hent-fra-bibliotek.png)
  
  ![Image without slash ](hent-fra-bibliotek.png)
  
  ![Image with absoulte url](https://example.com/images/hent-fra-bibliotek.png)
  
  ![Image with relative url and spaces]( ../bilder/hent-fra-bibliotek.png )
  
  ![Image with slash and spaces]( /hent-fra-bibliotek.png )
  
  ![Image without slash and spaces]( hent-fra-bibliotek.png )
  
  ![Image with absoulte url and spaces]( https://example.com/images/hent-fra-bibliotek.png )
  `;
  const resolvedMarkdown = resolveMarkdownImageUrls(markdownContent);
  const matches = [...resolvedMarkdown.matchAll(/(!\[.*?\]\()(.+?)(\))/gs)];
  let res = [];
  matches.forEach((match) => {
    res.push(match[2]);
  });
  res.forEach((filename) => {
    expect(filename).toBe("hent-fra-bibliotek.png");
  });
});
