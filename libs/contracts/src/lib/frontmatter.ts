import { dump, load } from "js-yaml";

// require keeps this file usable from both the CommonJS backend and the webpack frontend.
const matter: typeof import("gray-matter") = require("gray-matter");

/** js-yaml 4 for both directions; passing options also bypasses gray-matter's shared cache. */
const options = {
  engines: {
    yaml: {
      parse: (text: string) => (load(text) ?? {}) as object,
      stringify: (data: object) => dump(data),
    },
  },
};

export interface LessonMarkdown<T = Record<string, unknown>> {
  data: T;
  body: string;
}

/**
 * Splits a lesson file into its YAML front matter and the markdown body. Unlike
 * split("---\n"), a horizontal rule (---) in the body stays in the body.
 */
export function parseLessonMarkdown<T = Record<string, unknown>>(raw: string): LessonMarkdown<T> {
  const file = matter(raw ?? "", options);
  return { data: (file.data ?? {}) as T, body: file.content };
}

/** The inverse of parseLessonMarkdown, in the format the lesson repo uses. */
export function stringifyLessonMarkdown(data: object, body: string): string {
  return `---\n${dump(data)}---\n${body ?? ""}`;
}

/** Replaces the body and keeps the front matter exactly as it is. */
export function replaceLessonBody(raw: string, body: string): string {
  return stringifyLessonMarkdown(parseLessonMarkdown(raw).data, body);
}
