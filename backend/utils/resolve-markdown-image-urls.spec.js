const resolveMarkdownImageUrls = require("./resolve-markdown-image-urls");

it("Should remove markdown image urls and keep file name", () => {
  const markdownContent = `
  # some arbitrary markdown header
  
  ![Image with 
  relative url](/filer/bilder/hent-fra-bibliotek.png)
  
  ![Image with slash](/hent-fra-bibliotek.png)
  
  ![Image without slash ](hent-fra-bibliotek.png)
  
  ![Image with absoulte url](https://example.com/images/hent-fra-bibliotek.png)
  
  ![Image with relative url and spaces]( /filer/bilder/hent-fra-bibliotek.png )
  
  ![Image with slash and spaces]( /hent-fra-bibliotek.png )
  
  ![Image without slash and spaces]( hent-fra-bibliotek.png )
  
  ![Image with absoulte url and spaces]( https://example.com/images/hent-fra-bibliotek.png )
  
  ![Image with absoulte url and spaces]( /filer/drafts/asdfqwe/hent-fra-bibliotek.png )
  `;
  const resolvedMarkdown = resolveMarkdownImageUrls(markdownContent);
  const matches = [...resolvedMarkdown.matchAll(/(!\[.*?\]\()(.+?)(\))/gs)];
  let res = [];
  matches.forEach((match) => {
    res.push(match[2]);
  });
  expect(res[0]).toBe("../bilder/hent-fra-bibliotek.png");
  expect(res[1]).toBe("hent-fra-bibliotek.png");
  expect(res[2]).toBe("hent-fra-bibliotek.png");
  expect(res[3]).toBe("hent-fra-bibliotek.png");
  expect(res[4]).toBe("../bilder/hent-fra-bibliotek.png");
  expect(res[5]).toBe("hent-fra-bibliotek.png");
  expect(res[6]).toBe("hent-fra-bibliotek.png");
  expect(res[7]).toBe("hent-fra-bibliotek.png");
  expect(res[8]).toBe("hent-fra-bibliotek.png");
});
