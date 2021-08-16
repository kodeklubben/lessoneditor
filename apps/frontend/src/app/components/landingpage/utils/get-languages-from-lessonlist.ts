import { filenameParser } from "../../../utils/filename-parser";

export const getLanguagesFromLessonlist = (lessonList: [{ filename: string }]) => {
  const languages: string[] = [];
  if (Object.keys(lessonList).length !== 0 && lessonList.constructor !== Object) {
    lessonList.forEach((element: { filename: string }) => {
      const { isMarkdown, isReadme, language } = filenameParser(element.filename);
      if (!isMarkdown) {
        return;
      }
      if (!isReadme && !languages.includes(language)) languages.push(language);
    });
  }
  return languages;
};
