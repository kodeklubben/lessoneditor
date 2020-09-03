const resolveMdUrlsSub = require("./get-markdown-urls-submit");

it("should generate list with object of image names and urls", async () => {
  const markdownContent = `
  # some arbitrary markdown header
  
  ![Image with 
  relative url](http://localhost:3232/api/display/bilder/hent-fra-bibliotek.png)
  
  ![Velg figur fra biblioteket]( http://localhost:3232/api/display/bilder/hent-fra-bibliotek.png )
  
  ![Velg figur fra biblioteket](http://localhost:3232/api/display/bilder/hent-fra-bibliotek.png)
  
  ![Bilde av et skummelt halloween ansikt]( http://localhost:3232/api/display/qk13wsf/halloweenimasjon.jpg )
  
  `;
  const images = await resolveMdUrlsSub(markdownContent);
  expect(images[0].name).toBe("halloweenimasjon.jpg");
  expect(images[0].url).toBe(
    "http://localhost:3232/api/display/qk13wsf/halloweenimasjon.jpg"
  );
});
