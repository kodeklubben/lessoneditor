/** Lesson slugs become folder and file names in kodeklubben/oppgaver: src/<course>/<lesson>/. */
export const LESSON_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Course folders in the lesson repo also use underscores, e.g. uten_datamaskin. */
export const COURSE_SLUG_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
export const LANGUAGE_PATTERN = /^[a-z]{2,3}$/;
/**
 * Folder and file names of lessons already in kodeklubben/oppgaver, which do not all follow the
 * editor's slugs: PaintPot_part1, HelloPurr, lunar_lander, heksens_kjøkken. No dots, slashes or
 * spaces, so they stay single path segments.
 */
export const REPO_NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u;
export const MAX_SLUG_LENGTH = 100;
export const MAX_TITLE_LENGTH = 200;

export const isLessonSlug = (value: unknown): value is string =>
  typeof value === "string" && value.length <= MAX_SLUG_LENGTH && LESSON_SLUG_PATTERN.test(value);

export const isCourseSlug = (value: unknown): value is string =>
  typeof value === "string" && value.length <= MAX_SLUG_LENGTH && COURSE_SLUG_PATTERN.test(value);

export const isRepoName = (value: unknown): value is string =>
  typeof value === "string" && value.length <= MAX_SLUG_LENGTH && REPO_NAME_PATTERN.test(value);

export const isLanguageCode = (value: unknown): value is string =>
  typeof value === "string" && LANGUAGE_PATTERN.test(value);

export const isTitle = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= MAX_TITLE_LENGTH;

/** Returns the names of invalid fields; empty when the lesson can be stored and submitted. */
export function invalidLessonFields(lesson: {
  lessonSlug?: unknown;
  lessonTitle?: unknown;
  courseSlug?: unknown;
  courseTitle?: unknown;
  language?: unknown;
}): string[] {
  const invalid: string[] = [];
  if (!isLessonSlug(lesson.lessonSlug)) invalid.push("lessonSlug");
  if (!isTitle(lesson.lessonTitle)) invalid.push("lessonTitle");
  if (!isCourseSlug(lesson.courseSlug)) invalid.push("courseSlug");
  if (lesson.courseTitle !== undefined && typeof lesson.courseTitle !== "string")
    invalid.push("courseTitle");
  if (lesson.language !== undefined && !isLanguageCode(lesson.language)) invalid.push("language");
  return invalid;
}
