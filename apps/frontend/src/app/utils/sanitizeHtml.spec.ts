import { sanitizeLessonHtml } from "./sanitizeHtml";

const parse = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div;
};

describe("sanitizeLessonHtml", () => {
  it("keeps the icons of Scratch blocks: <use> pointing into the same SVG", () => {
    const html = sanitizeLessonHtml(
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
        '<defs><g id="sb3-greenFlag"><path d="M0 0h5v5z"></path></g></defs>' +
        '<g><text>når</text><use href="#sb3-greenFlag"></use>' +
        '<use xlink:href="#sb3-greenFlag"></use><text>klikkes</text></g></svg>',
    );
    const uses = [...parse(html).querySelectorAll("use")];
    expect(uses).toHaveLength(2);
    expect(uses.map((use) => use.getAttribute("href") ?? use.getAttribute("xlink:href"))).toEqual([
      "#sb3-greenFlag",
      "#sb3-greenFlag",
    ]);
  });

  it("removes <use> that points to another file or a data URL", () => {
    const html = sanitizeLessonHtml(
      '<svg><use href="https://evil.example/icons.svg#x"></use>' +
        '<use xlink:href="data:image/svg+xml;base64,PHN2Zy8+#x"></use><use></use></svg>',
    );
    expect(parse(html).querySelectorAll("use")).toHaveLength(0);
  });

  it("still removes scripts and frames from other sites", () => {
    const html = sanitizeLessonHtml(
      '<p>ok</p><script>alert(1)</script><iframe src="https://evil.example/"></iframe>' +
        '<iframe src="https://www.youtube-nocookie.com/embed/abc"></iframe>',
    );
    const div = parse(html);
    expect(div.querySelector("script")).toBeNull();
    expect([...div.querySelectorAll("iframe")].map((f) => f.getAttribute("src"))).toEqual([
      "https://www.youtube-nocookie.com/embed/abc",
    ]);
  });
});
