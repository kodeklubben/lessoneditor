import {
  parseLessonMarkdown,
  replaceLessonBody,
  stringifyLessonMarkdown,
} from "../../../../../libs/contracts/src/lib/frontmatter";

const raw = `---
title: Hei
authorList:
  - Ada
language: nb
---
# Del 1

---

# Del 2 med horisontal linje over
`;

describe("lesson front matter", () => {
  it("keeps horizontal rules in the body instead of cutting the text there", () => {
    const { data, body } = parseLessonMarkdown<{ title: string; authorList: string[] }>(raw);
    expect(data.title).toBe("Hei");
    expect(data.authorList).toEqual(["Ada"]);
    expect(body).toContain("# Del 2 med horisontal linje over");
    expect(body.startsWith("# Del 1")).toBe(true);
  });

  it("round-trips the header and body", () => {
    const { data, body } = parseLessonMarkdown(raw);
    expect(parseLessonMarkdown(stringifyLessonMarkdown(data, body))).toEqual({ data, body });
  });

  it("replaces only the body", () => {
    const updated = replaceLessonBody(raw, "Ny tekst\n\n---\n\nmer");
    expect(parseLessonMarkdown(updated)).toEqual({
      data: { title: "Hei", authorList: ["Ada"], language: "nb" },
      body: "Ny tekst\n\n---\n\nmer",
    });
  });

  it("treats a file without front matter as body only", () => {
    expect(parseLessonMarkdown("# Bare tekst")).toEqual({ data: {}, body: "# Bare tekst" });
  });

  it("does not share parsed objects between calls", () => {
    const first = parseLessonMarkdown<{ title: string }>(raw);
    first.data.title = "endret";
    expect(parseLessonMarkdown<{ title: string }>(raw).data.title).toBe("Hei");
  });
});
