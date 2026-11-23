import { lessonTemplate, teacherGuideTemplate } from "@lessoneditor/contracts";

/*
 * The templates themselves are in libs/contracts (templates.ts), shared with the backend, which
 * writes the first text of a new lesson. A language without a translation gets bokmål.
 */

/** Lookups never return undefined, also for a language added to the list later. */
const byLanguage = (template: (language?: string) => string): Record<string, string> =>
  new Proxy({} as Record<string, string>, { get: (_target, key: string) => template(key) });

export const teacherGuideDefaultText: Record<string, string> = byLanguage(teacherGuideTemplate);

export const lessonGuideDefaultText: Record<string, string> = byLanguage(lessonTemplate);
