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
      if ((file.filename === "preview" || file.filename === "image_rT34Yx") && file.ext === ".png")
        continue;
      uploads.push({ path, buffer: Buffer.from(file.content) });
    }
  }
  return uploads;
}
