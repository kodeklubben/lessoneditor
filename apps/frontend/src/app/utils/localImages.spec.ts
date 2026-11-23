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

  it("finds an image whose alt text holds a link", () => {
    expect(replaceLocalImageUrls("![[Kilde](https://example.org/side)](./a.png)", images)).toBe(
      "![[Kilde](https://example.org/side)](blob:a)",
    );
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

  it("shows every image the copy does not hold from GitHub too (P1-4)", () => {
    const algoritmia = upstreamImageBase({
      upstream_path: "src/uten_datamaskin/Algoritmia",
      upstream_commit: "2fe66d1",
    });
    const raw = "https://raw.githubusercontent.com/kodeklubben/oppgaver/2fe66d1/src/";
    const md = [
      "![Ada](Ada_Lovelace.600x751.jpg)",
      "![Nivå](./level3.svg)",
      "![Kart](images/kart.png)",
      "![Kopiert](a.png)",
      "![Ekstern](https://example.org/x.png)",
    ].join("\n");
    expect(replaceLocalImageUrls(md, { "a.png": "blob:a" }, algoritmia)).toBe(
      [
        `![Ada](${raw}uten_datamaskin/Algoritmia/Ada_Lovelace.600x751.jpg)`,
        `![Nivå](${raw}uten_datamaskin/Algoritmia/level3.svg)`,
        `![Kart](${raw}uten_datamaskin/Algoritmia/images/kart.png)`,
        "![Kopiert](blob:a)",
        "![Ekstern](https://example.org/x.png)",
      ].join("\n"),
    );
  });

  it("leaves the editor's own lessons alone", () => {
    expect(upstreamImageBase({ upstream_path: null, upstream_commit: null })).toBeUndefined();
    expect(replaceLocalImageUrls("![x](../bilder/x.png)", {})).toBe("![x](../bilder/x.png)");
  });
});
