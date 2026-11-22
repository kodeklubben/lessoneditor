import { replaceLocalImageUrls, upstreamImageBase } from "./localImages";

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

describe("shared course images of a copied lesson", () => {
  const base = upstreamImageBase({
    upstream_path: "src/scratch/heksens_kjøkken",
    upstream_commit: "2fe66d1",
  });

  it("shows ../bilder/ images from the commit the copy was made from", () => {
    expect(replaceLocalImageUrls("![Velg](../bilder/velg-bakgrunn.png)", {}, base)).toBe(
      "![Velg](https://raw.githubusercontent.com/kodeklubben/oppgaver/2fe66d1/src/scratch/bilder/velg-bakgrunn.png)",
    );
  });

  it("leaves the editor's own lessons alone", () => {
    expect(upstreamImageBase({ upstream_path: null, upstream_commit: null })).toBeUndefined();
    expect(replaceLocalImageUrls("![x](../bilder/x.png)", {})).toBe("![x](../bilder/x.png)");
  });
});
