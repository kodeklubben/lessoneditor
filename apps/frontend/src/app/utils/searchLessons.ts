import { CatalogLesson } from "@lessoneditor/contracts";

export interface LessonFilters {
  query: string;
  course?: string;
  level?: number;
  language?: string;
}

/** Lower case and without accents: «Å» finds «a», «Ü» finds «u» (ø and æ stay themselves). */
export const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * The lessons that match every word of the query (in the title, the course, the folder name or
 * a topic) and every filter. Titles that start with the query come first, then titles that have
 * a word starting with it, then the rest in the catalogue's order.
 */
export function searchLessons(
  lessons: CatalogLesson[],
  { query, course, level, language }: LessonFilters,
  topicNames: Record<string, string> = {},
): CatalogLesson[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const phrase = words.join(" ");
  const scored = lessons
    .filter(
      (lesson) =>
        (!course || lesson.course === course) &&
        (!level || lesson.level === level) &&
        (!language || lesson.languages.includes(language)),
    )
    .map((lesson, index) => {
      if (!words.length) return { lesson, index, score: 0 };
      const title = normalize(lesson.title);
      const haystack = [
        title,
        normalize(lesson.courseTitle),
        normalize(lesson.slug),
        ...lesson.tags.topic.map((tag) => normalize(topicNames[tag] ?? tag)),
      ].join(" ");
      if (!words.every((word) => haystack.includes(word))) return null;
      const score = title.startsWith(phrase)
        ? 3
        : title.split(/\W+/).some((word) => word.startsWith(words[0]))
          ? 2
          : title.includes(words[0])
            ? 1
            : 0;
      return { lesson, index, score };
    })
    .filter((entry): entry is { lesson: CatalogLesson; index: number; score: number } => !!entry);
  return scored.sort((a, b) => b.score - a.score || a.index - b.index).map(({ lesson }) => lesson);
}
