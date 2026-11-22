import { load } from "js-yaml";
// Runtime code from the shared lib is imported by path: tsc does not rewrite the alias.
import {
  parseLessonMarkdown,
  stringifyLessonMarkdown,
} from "../../../../libs/contracts/src/lib/frontmatter";
import { splitTextName } from "../../../../libs/contracts/src/lib/files";
import { isRepoName } from "../../../../libs/contracts/src/lib/validation";
import { IMAGE_EXTENSIONS } from "./submission-files";

/** A file in a lesson folder, as the GitHub contents API lists it. */
export interface RepoEntry {
  name: string;
  sha: string;
  size: number;
  type: string;
}

export type ImportPlan =
  { ok: true; textBase: string; files: RepoEntry[] } | { ok: false; reason: string };

/** The editor's limit for an image, also used for what is copied. */
export const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024;

const extension = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot).toLowerCase() : "";
};
const stem = (name: string) => name.slice(0, name.lastIndexOf("."));

/**
 * Chooses what to copy from a lesson folder: the texts, the teacher guides, lesson.yml and the
 * images in the folder itself. Code, archives and subfolders stay in the repo; the editor does
 * not edit them and a submission never touches them. Refuses folders the editor cannot represent
 * yet instead of guessing (see docs/rediger-oppgave.md).
 */
export function planImport(entries: RepoEntry[]): ImportPlan {
  const files = entries.filter((entry) => entry.type === "file");
  if (!files.some((file) => file.name === "lesson.yml")) {
    return { ok: false, reason: "Oppgaven mangler lesson.yml." };
  }
  const markdown = files.filter((file) => extension(file.name) === ".md");
  const guides = markdown.filter((file) => splitTextName(stem(file.name)).base === "README");
  const texts = markdown.filter((file) => !stem(file.name).startsWith("README"));
  const bases = [...new Set(texts.map((file) => splitTextName(stem(file.name)).base))];
  if (bases.length === 0) return { ok: false, reason: "Oppgaven har ingen oppgavetekst." };
  if (bases.length > 1) {
    return {
      ok: false,
      reason: `Oppgaven har tekster med flere navn (${bases.join(", ")}), og det kan ikke editoren redigere ennå.`,
    };
  }
  for (const kind of [texts, guides]) {
    const languages = kind.map((file) => splitTextName(stem(file.name)).language);
    const twice = languages.find((language, index) => languages.indexOf(language) !== index);
    if (twice) {
      return {
        ok: false,
        reason: `Oppgaven har to tekster på samme språk (${twice}), og det kan ikke editoren redigere ennå.`,
      };
    }
  }
  if (!isRepoName(bases[0])) {
    return { ok: false, reason: `Tekstnavnet ${bases[0]} kan ikke brukes i editoren.` };
  }
  const images = files.filter(
    (file) =>
      IMAGE_EXTENSIONS.includes(extension(file.name)) &&
      file.name !== "preview.png" &&
      isRepoName(stem(file.name)),
  );
  const copied = [...texts, ...guides, ...files.filter((f) => f.name === "lesson.yml"), ...images];
  const tooBig = copied.find((file) => file.size > MAX_IMPORT_FILE_SIZE);
  if (tooBig) return { ok: false, reason: `${tooBig.name} er større enn 5 MB.` };
  return { ok: true, textBase: bases[0], files: copied };
}

const list = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map(String)
    : typeof value === "string"
      ? value
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
      : [];

/**
 * A text from the repo in the editor's format: author and translator as lists (authorList,
 * translatorList). Fields the editor does not know, such as level, are kept, and the body is
 * not touched.
 */
export function toEditorMarkdown(raw: string, language: string): string {
  const { data, body } = parseLessonMarkdown<Record<string, unknown>>(raw);
  const { author, translator, ...rest } = data;
  return stringifyLessonMarkdown(
    {
      ...rest,
      title: typeof data.title === "string" ? data.title : "",
      author: "",
      authorList: list(author),
      translator: "",
      translatorList: list(translator),
      language: typeof data.language === "string" ? data.language : language,
    },
    body,
  );
}

/** lesson.yml as the editor stores it: JSON, with the three tag lists always present. */
export function toEditorLessonData(yml: string): string {
  const data = (load(yml) ?? {}) as Record<string, unknown>;
  const tags = (data.tags ?? {}) as Record<string, unknown>;
  return JSON.stringify({
    ...data,
    level: typeof data.level === "number" ? data.level : 1,
    tags: {
      ...tags,
      topic: list(tags.topic),
      subject: list(tags.subject),
      grade: list(tags.grade),
    },
  });
}

/** The title the copy is listed under: the bokmål text's, or else the first one's. */
export function lessonTitleFrom(texts: { name: string; raw: string }[], fallback: string): string {
  const titleOf = (raw: string) => parseLessonMarkdown<{ title?: unknown }>(raw).data.title;
  const ordered = [
    ...texts.filter((text) => splitTextName(stem(text.name)).language === "nb"),
    ...texts,
  ];
  for (const text of ordered) {
    const title = titleOf(text.raw);
    if (typeof title === "string" && title.trim()) return title.trim().slice(0, 200);
  }
  return fallback;
}
