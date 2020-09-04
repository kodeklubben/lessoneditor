const resolveMdUrlsSub = require("./get-markdown-urls-submit");

it("should generate list with object of image names and urls", async () => {
  const markdownContent = `
  # some arbitrary markdown header
  
  ![Image with 
  relative url](/file/bilder/hent-fra-bibliotek.png)
  
  ![Velg figur fra biblioteket]( /file/bilder/hent-fra-bibliotek.png )
  
  ![Velg figur fra biblioteket](/file/bilder/hent-fra-bibliotek.png)
  
  ![Bilde av et skummelt halloween ansikt]( /file/drafts/asdfqwe/halloweenimasjon.jpg )
  
  ![Bilde av et skummelt halloween ansikt]( https://example.com/images/halloweenimasjon.jpg )
  
  `;
  const images = await resolveMdUrlsSub(
    markdownContent,
    "asdfqwe",
    "http://lessoneditor.com"
  );
  expect(images[0].name).toBe("halloweenimasjon.jpg");
  expect(images[0].url).toBe(
    "http://lessoneditor.com/api/display/asdfqwe/halloweenimasjon.jpg"
  );
  expect(images[1].name).toBe("halloweenimasjon.jpg");
  expect(images[1].url).toBe("https://example.com/images/halloweenimasjon.jpg");
});
