import resolveMarkdownUrls from "./resolve-markdown-urls";

//import * as urlRegexSafe from "url-regex-safe"

it("should resolve markdown urls", () => {
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
    const resolved = resolveMarkdownUrls(
        markdownContent,
        "https://somedomain.com/images"
    );
    /*
    const urls = resolved.match(urlRegexSafe());
    expect(urls[0]).toBe("https://somedomain.com/bilder/hent-fra-bibliotek.png");
    expect(urls[1]).toBe("https://somedomain.com/images/hent-fra-bibliotek.png");
    expect(urls[2]).toBe("https://somedomain.com/images/hent-fra-bibliotek.png");
    expect(urls[3]).toBe("https://example.com/images/hent-fra-bibliotek.png");
    expect(urls[4]).toBe("https://somedomain.com/bilder/hent-fra-bibliotek.png");
    expect(urls[5]).toBe("https://somedomain.com/images/hent-fra-bibliotek.png");
    expect(urls[6]).toBe("https://somedomain.com/images/hent-fra-bibliotek.png");
    expect(urls[7]).toBe("https://example.com/images/hent-fra-bibliotek.png");
     */
  expect(resolved.length).toBe(762)
});
