import { getVideoId, mdParser } from "./mdParser";
import { sanitizeLessonHtml } from "./sanitizeHtml";

describe("lesson markdown", () => {
  it("renders headings, line numbers, code and emoji with the upgraded plugins", () => {
    const html = mdParser("# Hei :smile:\n\n```javascript\nconst n = 1;\n```\n");
    expect(html).toContain("Hei 😄");
    expect(html).toContain('id="line-1"');
    expect(html).toContain("hljs-keyword");
  });

  it("escapes raw HTML in lesson content", () => {
    expect(mdParser('<script>alert("x")</script>')).not.toContain("<script>");
  });

  it("does not let a video link break out of the iframe attribute", () => {
    const html = mdParser(
      ':::video[https://youtu.be/abcdefghijk" onload="alert(1)]\n:::\n' +
        ':::video[https://www.youtube.com/watch?v=abc"onload=x]\n:::\n',
    );
    expect(html).not.toContain("onload");
    expect(html).not.toContain("<iframe");
  });

  it("embeds valid YouTube and Vimeo links", () => {
    expect(getVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1")).toEqual({
      provider: "youtube",
      id: "dQw4w9WgXcQ",
    });
    expect(getVideoId("youtu.be/dQw4w9WgXcQ")).toEqual({ provider: "youtube", id: "dQw4w9WgXcQ" });
    expect(getVideoId("https://vimeo.com/76979871")).toEqual({ provider: "vimeo", id: "76979871" });
    expect(getVideoId("https://evil.example/watch?v=dQw4w9WgXcQ")).toBeUndefined();
    const html = mdParser(":::video[https://vimeo.com/76979871]\n:::\n");
    expect(html).toContain('src="https://player.vimeo.com/video/76979871"');
  });

  it("ignores style attributes from {style=...}", () => {
    const html = mdParser('Tekst {style="position:fixed;inset:0"}\n');
    expect(html).not.toContain("position:fixed");
  });
});

describe("preview sanitising", () => {
  it("keeps lesson markup and allowed embeds", () => {
    const html = sanitizeLessonHtml(
      mdParser("# Tittel\n\n- [ ] Sjekk\n\n:::video[https://youtu.be/dQw4w9WgXcQ]\n:::\n"),
    );
    expect(html).toContain('id="line-1"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("removes scripts, handlers, javascript links and foreign frames", () => {
    const html = sanitizeLessonHtml(
      '<img src="x" onerror="alert(1)"><a href="javascript:alert(1)">x</a>' +
        '<iframe src="https://evil.example/"></iframe><svg><script>alert(1)</script></svg>',
    );
    expect(html).not.toMatch(/onerror|javascript:|evil\.example|<script/);
  });

  it("keeps the lesson's own images, which the editor shows as blob: URLs", () => {
    expect(sanitizeLessonHtml('<img src="blob:http://localhost/abc" alt="Katt">')).toContain(
      'src="blob:http://localhost/abc"',
    );
  });

  it("adds rel=noopener to links that open a new tab", () => {
    expect(sanitizeLessonHtml('<a href="https://kidsakoder.no" target="_blank">x</a>')).toContain(
      'rel="noopener noreferrer"',
    );
  });
});

describe("hints written as <toggle> in the lessons", () => {
  const lesson = [
    "- [ ] Lag en overskrift.",
    "",
    "<toggle>",
    "  <strong>Hint</strong>",
    "  <hide>",
    "",
    "  ```html",
    "  <h1>Hei</h1>",
    "  ```",
    "",
    "  </hide>",
    "</toggle>",
    "",
    "Videre.",
  ].join("\n");

  it("opens and closes in the preview, with the Markdown inside rendered", () => {
    const html = sanitizeLessonHtml(mdParser(lesson));
    expect(html).toContain('<details class="toggle"><summary>Hint</summary>');
    expect(html).toContain('<div class="toggle__content">');
    expect(html).toMatch(/<pre><code class="html">[\s\S]*Hei/);
    expect(html).toMatch(/<\/div><\/details>[\s\S]*Videre/);
    expect(html).not.toContain("&lt;toggle&gt;");
  });

  it("also reads the tags on one line, and leaves any other HTML as text", () => {
    const html = mdParser("<toggle><strong>Se koden</strong><hide>\n\nKode\n\n</hide></toggle>\n");
    expect(html).toContain("<summary>Se koden</summary>");
    expect(mdParser("<strong>Fet</strong>\n")).toContain("&lt;strong&gt;Fet&lt;/strong&gt;");
    expect(mdParser("<hide>x</hide>\n")).toContain("&lt;hide&gt;");
    expect(mdParser('<toggle><strong onclick="x">Hint</strong>\n')).not.toMatch(/<strong onclick/);
  });
});
