import { parseLessonMarkdown, stringifyLessonMarkdown } from "@lessoneditor/contracts";

/** The text a new language starts from: bokmål when the lesson has it, else its first text. */
export const copySourceLanguage = (used: { value: string }[]): string | undefined =>
  used.find((option) => option.value === "nb")?.value ?? used[0]?.value;

/**
 * A new language version as a copy of an existing text (V6): the whole body, so translating means
 * replacing words instead of writing the lesson again with its images, code and steps. The
 * authors stay the authors; the one making the copy is the translator. Fields the editor does not
 * show (level and others from the lesson repo) are kept.
 */
export function copyForTranslation(raw: string, language: string, translator: string): string {
  const { data, body } = parseLessonMarkdown<Record<string, unknown>>(raw);
  const header: Record<string, unknown> = { ...data };
  delete header.author;
  delete header.translator;
  delete header.copiedFrom;
  return stringifyLessonMarkdown(
    {
      ...header,
      title: typeof data.title === "string" ? data.title : "",
      author: "",
      authorList: Array.isArray(data.authorList) ? data.authorList : [],
      language,
      translator: "",
      translatorList: translator ? [translator] : [],
      // The editor shows «Kopiert fra bokmål» until the translator is done (never submitted).
      ...(typeof data.language === "string" && data.language !== language
        ? { copiedFrom: data.language }
        : {}),
    },
    body,
  );
}
