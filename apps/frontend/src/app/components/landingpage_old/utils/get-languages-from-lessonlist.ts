import { filenameParser } from "../../../utils/filename-parser";

export const getLanguagesFromLessonlist = (lessonList: [filename: string]) => {
  const languages: string[] = [];

  lessonList.forEach((element) => {
    const { isMarkdown, isReadme, language } = filenameParser(element);
    if (!isMarkdown) {
      return;
    }
    if (!isReadme && !languages.includes(language)) languages.push(language);
  });

  return languages;
};
