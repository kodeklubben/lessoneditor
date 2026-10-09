import { mdParser } from "./mdParser";

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
});
