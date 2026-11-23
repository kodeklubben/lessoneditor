import {
  lessonTitleFrom,
  planImport,
  RepoEntry,
  toEditorLessonData,
  toEditorMarkdown,
} from "./import-lesson";
import { parseLessonMarkdown } from "../../../../libs/contracts/src/lib/frontmatter";

const file = (name: string, size = 100): RepoEntry => ({
  name,
  sha: `sha-${name}`,
  size,
  type: "file",
});
const names = (plan: ReturnType<typeof planImport>) =>
  plan.ok ? plan.files.map((f) => f.name).sort() : plan.reason;

describe("planImport", () => {
  it("copies texts, teacher guides, lesson.yml and the folder's images, nothing else", () => {
    const plan = planImport([
      file("asteroids.md"),
      file("asteroids_nn.md"),
      file("asteroids_ua.md"),
      file("README.md"),
      file("README_nn.md"),
      file("lesson.yml"),
      file("asteroids.png"),
      file("asteroids_ua.png"),
      file("kode.py"),
      file("prosjekt.sb2"),
      { name: "bilder", sha: "x", size: 0, type: "dir" },
    ]);
    expect(plan.ok && plan.textBase).toBe("asteroids");
    expect(names(plan)).toEqual([
      "README.md",
      "README_nn.md",
      "asteroids.md",
      "asteroids.png",
      "asteroids_nn.md",
      "asteroids_ua.md",
      "asteroids_ua.png",
      "lesson.yml",
    ]);
  });

  it("keeps names from the repo that the editor's slugs do not allow", () => {
    const plan = planImport([file("PaintPot1.md"), file("lesson.yml")]);
    expect(plan.ok && plan.textBase).toBe("PaintPot1");
    const underscore = planImport([
      file("lunar_lander.md"),
      file("lunar_lander_nn.md"),
      file("lesson.yml"),
    ]);
    expect(underscore.ok && underscore.textBase).toBe("lunar_lander");
  });

  it("refuses folders it cannot represent instead of guessing", () => {
    expect(planImport([file("a.md")])).toEqual({
      ok: false,
      reason: "Oppgaven mangler lesson.yml.",
    });
    // python_buttons.md is English and python_buttons_nb.md bokmål: both would read as bokmål.
    const sameLanguage = planImport([
      file("python_buttons.md"),
      file("python_buttons_nb.md"),
      file("lesson.yml"),
    ]);
    expect(!sameLanguage.ok && sameLanguage.reason).toContain("samme språk (nb)");
    const two = planImport([file("del1.md"), file("del2.md"), file("lesson.yml")]);
    expect(two.ok).toBe(false);
    expect(!two.ok && two.reason).toContain("del1, del2");
    expect(planImport([file("lesson.yml"), file("README.md")]).ok).toBe(false);
    const big = planImport([file("a.md"), file("lesson.yml"), file("stor.png", 6 * 1024 * 1024)]);
    expect(!big.ok && big.reason).toContain("stor.png");
  });
});

describe("toEditorMarkdown", () => {
  const repo =
    "---\ntitle: Asteroids\nlevel: 4\nauthor: 'Geir Arne Hjelle, Ola Nordmann'\nlanguage: nb\n---\n\n\n# Introduksjon {.intro}\n\nTekst.\n";

  it("turns author into a list, keeps unknown fields and the body", () => {
    const { data, body } = parseLessonMarkdown<Record<string, unknown>>(
      toEditorMarkdown(repo, "nb"),
    );
    expect(data).toMatchObject({
      title: "Asteroids",
      level: 4,
      authorList: ["Geir Arne Hjelle", "Ola Nordmann"],
      translatorList: [],
      language: "nb",
    });
    expect(body).toBe(parseLessonMarkdown(repo).body);
  });

  it("takes the language from the file name when the text does not say", () => {
    const { data } = parseLessonMarkdown<Record<string, unknown>>(
      toEditorMarkdown("---\ntitle: X\ntranslator: Kari\n---\nHei\n", "nn"),
    );
    expect(data).toMatchObject({ language: "nn", translatorList: ["Kari"] });
  });
});

describe("toEditorLessonData", () => {
  it("reads level and tags, and keeps other fields", () => {
    const json = JSON.parse(
      toEditorLessonData(
        "level: 4\nindexed: false\ntags:\n  topic: [block_based, game]\n  subject: [programming]\n  grade: [junior]\n",
      ),
    );
    expect(json).toEqual({
      level: 4,
      indexed: false,
      tags: { topic: ["block_based", "game"], subject: ["programming"], grade: ["junior"] },
    });
  });

  it("gives a lesson.yml without tags empty tag lists", () => {
    expect(JSON.parse(toEditorLessonData("level: 2\n")).tags).toEqual({
      topic: [],
      subject: [],
      grade: [],
    });
  });
});

describe("lessonTitleFrom", () => {
  it("prefers the bokmål title", () => {
    expect(
      lessonTitleFrom(
        [
          { name: "a_nn.md", raw: "---\ntitle: Nynorsk\n---\n" },
          { name: "a.md", raw: "---\ntitle: Bokmål\n---\n" },
        ],
        "a",
      ),
    ).toBe("Bokmål");
    expect(lessonTitleFrom([{ name: "a_en.md", raw: "Ingen front matter" }], "a")).toBe("a");
  });
});
