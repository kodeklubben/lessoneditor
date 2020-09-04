const resolveMarkdownUrlsEdit = require("./resolve-markdown-urls-edit");

it("should resolve markdown urls for edit, including scratch defaults", async () => {
  const lessonId = "asdfqwe";
  const markdownContent = `# Introduksjon {.intro}
  En test oppgave.
  
  ![Bilde av en katt i verdensrommet](astrokatt.png)
  
  ![Bilde av en katt i verdensrommet]( astrokatt.png )
  
  ![Bilde av en katt i verdensrommet](/astrokatt.png)
  
  ![Velg figur fra
  biblioteket](../bilder/hent-fra-bibliotek.png)
  
  ![Velg figur fra biblioteket](../bilder/hent-fra-bibliotek.png)
  
  ![Velg ny bakgrunn](../bilder/velg-bakgrunn.png)
  
  ![Velg ny bakgrunn](../bilder/bakgrunn-fra-bibliotek.png)
  
  ![Velg ny bakgrunn](../bilder/gjor-storre.png)
  
  ![Velg ny bakgrunn](../bilder/hent-fra-fil.png)
  
  ![Velg ny bakgrunn](../bilder/scratch3-last-opp-bakgrunn.png)`;

  const resolved = await resolveMarkdownUrlsEdit(markdownContent, lessonId);
  const matches = [...resolved.matchAll(/(!\[.*?\]\()(.+?)(\))/gs)];
  let res = [];
  matches.forEach((match) => {
    res.push(match[2]);
  });
  expect(res[0]).toBe("/file/drafts/asdfqwe/astrokatt.png");
  expect(res[1]).toBe("/file/drafts/asdfqwe/astrokatt.png");
  expect(res[2]).toBe("/file/drafts/asdfqwe/astrokatt.png");
  expect(res[3]).toBe("/file/bilder/hent-fra-bibliotek.png");
  expect(res[4]).toBe("/file/bilder/hent-fra-bibliotek.png");
  expect(res[5]).toBe("/file/bilder/velg-bakgrunn.png");
  expect(res[6]).toBe("/file/bilder/bakgrunn-fra-bibliotek.png");
  expect(res[7]).toBe("/file/bilder/gjor-storre.png");
  expect(res[8]).toBe("/file/bilder/hent-fra-fil.png");
  expect(res[9]).toBe("/file/bilder/scratch3-last-opp-bakgrunn.png");
});
