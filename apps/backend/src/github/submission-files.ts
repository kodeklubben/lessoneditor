import { createHash } from "crypto";
import { dump } from "js-yaml";
import {
  parseLessonMarkdown,
  stringifyLessonMarkdown,
} from "../../../../libs/contracts/src/lib/frontmatter";

export interface UploadObject {
  path: string;
  buffer: Buffer;
}

interface StoredFile {
  filename: string;
  ext: string;
  content: Buffer;
}

interface StoredHeader {
  title?: string;
  authorList?: string[];
  translatorList?: string[];
  language?: string;
}

export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".gif", ".png"];
/** The placeholder image every new lesson starts with (see fileTemplates.ts). */
export const TEMPLATE_IMAGE = "image_rT34Yx.png";

/** Older editor versions wrote "sam" for Northern Sami; the lesson repo uses ISO 639-1 "se". */
const LANGUAGE_ALIASES: Record<string, string> = { sam: "se" };
const repoLanguage = (language: string) => LANGUAGE_ALIASES[language] ?? language;
const repoFilename = (filename: string) =>
  filename.replace(/_([a-z]{2,3})$/, (whole, language: string) =>
    LANGUAGE_ALIASES[language] ? `_${LANGUAGE_ALIASES[language]}` : whole,
  );

/** The editor's front matter (lists) becomes the lesson repo's (comma separated strings). */
export function toRepoMarkdown(raw: string): string {
  const { data, body } = parseLessonMarkdown<StoredHeader>(raw);
  const header: Record<string, string> = {
    title: data.title ?? "",
    author: (data.authorList ?? []).join(", "),
  };
  const translators = data.translatorList ?? [];
  if (translators.length > 0) header.translator = translators.join(", ");
  header.language = repoLanguage(data.language ?? "nb");
  return stringifyLessonMarkdown(header, body);
}

/** Every file the lesson folder src/<course>/<lesson>/ should contain after the submission. */
export function buildUploadFiles(
  lesson: { courseSlug: string; lessonSlug: string },
  files: StoredFile[],
): UploadObject[] {
  const lessonPath = ["src", lesson.courseSlug, lesson.lessonSlug].join("/");
  const uploads: UploadObject[] = [];
  // The template image is only sent when a text still shows it; otherwise the lesson would
  // reference an image that is missing in the repo (or ship an unused placeholder).
  const templateImageUsed = files.some(
    (file) => file.ext === ".md" && file.content.toString().includes(TEMPLATE_IMAGE),
  );
  for (const file of files) {
    const name = file.ext === ".md" ? repoFilename(file.filename) : file.filename;
    const path = [lessonPath, name + file.ext].join("/");
    if (file.ext === ".yml") {
      uploads.push({
        path,
        buffer: Buffer.from(dump(JSON.parse(file.content.toString())), "utf-8"),
      });
    } else if (file.ext === ".md") {
      uploads.push({ path, buffer: Buffer.from(toRepoMarkdown(file.content.toString()), "utf-8") });
    } else if (IMAGE_EXTENSIONS.includes(file.ext)) {
      const image = file.filename + file.ext;
      if (image === "preview.png" || (image === TEMPLATE_IMAGE && !templateImageUsed)) continue;
      uploads.push({ path, buffer: Buffer.from(file.content) });
    }
  }
  return uploads;
}

/** Git's blob id, so unchanged files can be skipped without downloading them from GitHub. */
export function gitBlobSha(buffer: Buffer): string {
  return createHash("sha1").update(`blob ${buffer.length}\0`).update(buffer).digest("hex");
}

export interface RepoFile {
  path: string;
  sha: string;
}

/** Uploads whose content differs from what the branch already has. */
export function changedUploads(existing: RepoFile[], uploads: UploadObject[]): UploadObject[] {
  const shas = new Map(existing.map((file) => [file.path, file.sha]));
  return uploads.filter((upload) => shas.get(upload.path) !== gitBlobSha(upload.buffer));
}

/** Files in the lesson folder on the branch that were deleted in the editor. */
export function pathsToDelete(existing: RepoFile[], uploads: UploadObject[]): string[] {
  const kept = new Set(uploads.map((upload) => upload.path));
  return existing.map((file) => file.path).filter((path) => !kept.has(path));
}

/** GitHub answers 422 for many things; only this one means "the PR is already open". */
export function isPullRequestAlreadyExists(error: unknown): boolean {
  const e = error as {
    status?: number;
    message?: string;
    response?: { data?: { errors?: { message?: string }[] } };
  };
  if (e?.status !== 422) return false;
  const messages = [e.message, ...(e.response?.data?.errors ?? []).map((item) => item?.message)];
  return messages.some((message) => /pull request already exists/i.test(message ?? ""));
}

/** A line for the PR so reviewers know which texts were machine translated and not yet checked. */
export function machineTranslationNote(files: StoredFile[]): string {
  const translated = files
    .filter((file) => file.ext === ".md")
    .map((file) => ({
      file,
      data: parseLessonMarkdown<{ machineTranslated?: boolean; translatedFrom?: string }>(
        file.content.toString(),
      ).data,
    }))
    .filter(({ data }) => data.machineTranslated === true)
    .map(
      ({ file, data }) =>
        `${repoFilename(file.filename)}${file.ext}${data.translatedFrom ? ` (fra ${data.translatedFrom})` : ""}`,
    );
  return translated.length > 0
    ? `\n\n---\nMaskinoversatt i Lesson Editor, bør leses gjennom: ${translated.join(", ")}`
    : "";
}
