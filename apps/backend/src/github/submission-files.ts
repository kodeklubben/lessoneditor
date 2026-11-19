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

/** The editor's front matter (lists) becomes the lesson repo's (comma separated strings). */
export function toRepoMarkdown(raw: string): string {
  const { data, body } = parseLessonMarkdown<StoredHeader>(raw);
  const header: Record<string, string> = {
    title: data.title ?? "",
    author: (data.authorList ?? []).join(", "),
  };
  if ((data.translatorList ?? []).length > 0) header.translator = data.translatorList.join(", ");
  header.language = data.language ?? "nb";
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
    const path = [lessonPath, file.filename + file.ext].join("/");
    if (file.ext === ".yml") {
      uploads.push({
        path,
        buffer: Buffer.from(dump(JSON.parse(file.content.toString())), "utf-8"),
      });
    } else if (file.ext === ".md") {
      uploads.push({ path, buffer: Buffer.from(toRepoMarkdown(file.content.toString()), "utf-8") });
    } else if (IMAGE_EXTENSIONS.includes(file.ext)) {
      const name = file.filename + file.ext;
      if (name === "preview.png" || (name === TEMPLATE_IMAGE && !templateImageUsed)) continue;
      uploads.push({ path, buffer: Buffer.from(file.content) });
    }
  }
  return uploads;
}
