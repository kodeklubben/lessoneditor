import { buildUploadFiles, toRepoMarkdown } from "./submission-files";

const md = (header: string, body: string) => Buffer.from(`---\n${header}---\n${body}`);

describe("files sent to the lesson repo", () => {
  it("writes the repo's front matter and keeps the whole body", () => {
    const out = toRepoMarkdown(
      "---\ntitle: Hei\nauthor: ''\nauthorList:\n  - Ada\n  - Bo\ntranslator: ''\ntranslatorList: []\nlanguage: nb\n---\nA\n\n---\n\nB\n",
    );
    expect(out).toBe("---\ntitle: Hei\nauthor: Ada, Bo\nlanguage: nb\n---\nA\n\n---\n\nB\n");
  });

  it("includes translators when there are any", () => {
    const out = toRepoMarkdown(
      "---\ntitle: Hi\nauthorList: [Ada]\ntranslatorList: [Cy]\nlanguage: en\n---\nText",
    );
    expect(out).toContain("translator: Cy\n");
  });

  it("puts every file under src/<course>/<lesson>/ and skips the preview thumbnail", () => {
    const uploads = buildUploadFiles({ courseSlug: "python", lessonSlug: "hei" }, [
      { filename: "lesson", ext: ".yml", content: Buffer.from('{"level":1,"tags":{"topic":[]}}') },
      { filename: "hei", ext: ".md", content: md("title: Hei\nauthorList: [Ada]\n", "Tekst") },
      { filename: "preview", ext: ".png", content: Buffer.from("png") },
      { filename: "bilde", ext: ".png", content: Buffer.from("png") },
    ]);
    expect(uploads.map((upload) => upload.path)).toEqual([
      "src/python/hei/lesson.yml",
      "src/python/hei/hei.md",
      "src/python/hei/bilde.png",
    ]);
    expect(uploads[0].buffer.toString()).toBe("level: 1\ntags:\n  topic: []\n");
  });
});
