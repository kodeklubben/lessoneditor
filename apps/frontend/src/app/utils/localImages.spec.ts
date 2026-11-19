import { replaceLocalImageUrls } from "./localImages";

describe("local image URLs in the preview", () => {
  const images = { "a.png": "blob:a", "b.png": "blob:b" };

  it("matches each image by name, not by position", () => {
    const md = "![B](./b.png)\n![ekstern](https://example.org/x.png)\n![A](./a.png)";
    expect(replaceLocalImageUrls(md, images)).toBe(
      "![B](blob:b)\n![ekstern](https://example.org/x.png)\n![A](blob:a)",
    );
  });

  it("keeps titles, unknown files and links without ./", () => {
    expect(replaceLocalImageUrls('![A](./a.png "Tittel")', images)).toBe('![A](blob:a "Tittel")');
    expect(replaceLocalImageUrls("![X](./mangler.png)", images)).toBe("![X](./mangler.png)");
    expect(replaceLocalImageUrls("![A](a.png)", images)).toBe("![A](blob:a)");
  });

  it("does not use the image list for paths in other folders", () => {
    expect(replaceLocalImageUrls("![A](../a.png)", images)).toBe("![A](../a.png)");
  });
});
