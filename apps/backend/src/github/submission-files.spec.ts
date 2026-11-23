import {
  buildChangedUploads,
  buildUploadFiles,
  changedInRepo,
  gitBlobSha,
  machineTranslationNote,
  toRepoMarkdown,
} from "./submission-files";
import { toEditorMarkdown } from "./import-lesson";

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

  it("sends the template image only while a text still refers to it", () => {
    const image = { filename: "image_rT34Yx", ext: ".png", content: Buffer.from("png") };
    const text = (body: string) => ({
      filename: "hei",
      ext: ".md",
      content: md("title: Hei\nauthorList: [Ada]\n", body),
    });
    const lesson = { courseSlug: "python", lessonSlug: "hei" };
    expect(
      buildUploadFiles(lesson, [text("![X](./image_rT34Yx.png)"), image]).map((u) => u.path),
    ).toContain("src/python/hei/image_rT34Yx.png");
    expect(
      buildUploadFiles(lesson, [text("Ingen bilder"), image]).map((u) => u.path),
    ).not.toContain("src/python/hei/image_rT34Yx.png");
  });
});

describe("old language codes", () => {
  it("submits Northern Sami as se, as the lesson repo names it", () => {
    const [upload] = buildUploadFiles({ courseSlug: "python", lessonSlug: "hei" }, [
      {
        filename: "hei_sam",
        ext: ".md",
        content: md("title: Hei\nauthorList: [Ada]\nlanguage: sam\n", "Tekst"),
      },
    ]);
    expect(upload.path).toBe("src/python/hei/hei_se.md");
    expect(upload.buffer.toString()).toContain("language: se\n");
  });
});

describe("git blob ids", () => {
  it("match what git computes", () => {
    // printf 'hei\n' | git hash-object --stdin
    expect(gitBlobSha(Buffer.from("hei\n"))).toBe("5eca02534fe1cf75a80560d9b943b4b88ca16a75");
  });
});

describe("machine translated texts", () => {
  it("are listed in the pull request and not marked in the repo front matter", () => {
    const files = [
      { filename: "hei", ext: ".md", content: md("title: Hei\nauthorList: [Ada]\n", "Tekst") },
      {
        filename: "hei_en",
        ext: ".md",
        content: md(
          "title: Hei\nauthorList: [Ada]\ntranslatorList: [Bo]\nlanguage: en\nmachineTranslated: true\ntranslatedFrom: nb\n",
          "Text",
        ),
      },
    ];
    expect(machineTranslationNote(files)).toContain("hei_en.md (fra nb)");
    expect(machineTranslationNote(files.slice(0, 1))).toBe("");
    expect(
      buildUploadFiles({ courseSlug: "python", lessonSlug: "hei" }, files)[1].buffer.toString(),
    ).toBe("---\ntitle: Hei\nauthor: Ada\ntranslator: Bo\nlanguage: en\n---\nText");
  });
});

describe("submitting a copy of a published lesson", () => {
  const repoText =
    "---\ntitle: Asteroids\nlevel: 4\nauthor: Geir Arne Hjelle\nlanguage: nb\n---\n\n# Intro {.intro}\n";
  const stored = (filename: string, ext: string, content: string, imported = true) => {
    const buffer = Buffer.from(content);
    return {
      filename,
      ext,
      content: buffer,
      imported_sha: imported ? gitBlobSha(buffer) : null,
      upstream_sha: imported ? `repo-${filename}${ext}` : null,
    };
  };
  const editorText = toEditorMarkdown(repoText, "nb");

  it("keeps fields the editor does not know, such as level", () => {
    expect(toRepoMarkdown(editorText)).toBe(
      "---\ntitle: Asteroids\nlevel: 4\nlanguage: nb\nauthor: Geir Arne Hjelle\n---\n\n# Intro {.intro}\n",
    );
  });

  it("sends nothing for a copy nobody changed", () => {
    const files = [
      stored("asteroids", ".md", editorText),
      stored("lesson", ".yml", '{"level":4}'),
      stored("asteroids", ".png", "png"),
      stored("preview", ".png", " ", false),
    ];
    expect(buildChangedUploads("src/scratch/asteroids", files)).toEqual([]);
  });

  it("sends only the changed text and a new image, under the repo's folder", () => {
    const text = stored("asteroids", ".md", editorText);
    const files = [
      { ...text, content: Buffer.from(editorText + "Ny linje.\n") },
      stored("asteroids_nn", ".md", toEditorMarkdown(repoText, "nn")),
      stored("nytt_bilde", ".png", "png", false),
    ];
    const changed = buildChangedUploads("src/scratch/asteroids", files);
    expect(changed.map(({ upload, upstreamSha }) => [upload.path, upstreamSha])).toEqual([
      ["src/scratch/asteroids/asteroids.md", "repo-asteroids.md"],
      ["src/scratch/asteroids/nytt_bilde.png", null],
    ]);
    expect(changed[0].upload.buffer.toString()).toContain("level: 4");
    expect(changed[0].upload.buffer.toString()).toContain("Ny linje.");
  });

  it("finds files changed in the repo since the copy was made", () => {
    const changed = [
      { upload: { path: "src/s/a/a.md", buffer: Buffer.from("x") }, upstreamSha: "old" },
      { upload: { path: "src/s/a/b.md", buffer: Buffer.from("x") }, upstreamSha: "same" },
      { upload: { path: "src/s/a/ny.png", buffer: Buffer.from("x") }, upstreamSha: null },
      { upload: { path: "src/s/a/annen.png", buffer: Buffer.from("x") }, upstreamSha: null },
    ];
    const repo = [
      { path: "src/s/a/a.md", sha: "new" },
      { path: "src/s/a/b.md", sha: "same" },
      { path: "src/s/a/annen.png", sha: "someone-else" },
    ];
    expect(changedInRepo(changed, repo)).toEqual(["a.md", "annen.png"]);
  });
});
