const resolveMdUrlsSub = require("./resolve-markdown-urls-submit");

it("should generate list with object of image names and urls", () => {
  const markdownContent = `
  # some arbitrary markdown header
  
  ![Image with 
  relative url](https://somedomain.com/bilder/hent-fra-bibliotek.png)
  
  ![Image with slash](https://example.com/images/hent-fra-bibliotek.png)
  
  `;
  const images = resolveMdUrlsSub(markdownContent);
  expect(images[0].name).toBe("hent-fra-bibliotek.png");
  expect(images[0].url).toBe(
    "https://somedomain.com/bilder/hent-fra-bibliotek.png"
  );
  expect(images[1].name).toBe("hent-fra-bibliotek.png");
  expect(images[1].url).toBe(
    "https://example.com/images/hent-fra-bibliotek.png"
  );
});
