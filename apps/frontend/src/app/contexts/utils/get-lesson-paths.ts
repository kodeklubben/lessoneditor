import { paths, resolveUrlTemplate } from "@lessoneditor/api-interfaces";

export const getLessonPaths = (lessonId: string) => {
  return {
    lessonFilesPath: resolveUrlTemplate(paths.LESSON_FILES, { lessonId }),
    lessonDataPath: resolveUrlTemplate(paths.LESSON_DATA, {
      lessonId,
      filename: "data.json"
    }),
    lessonYamlPath: resolveUrlTemplate(paths.LESSON_DATA, {
      lessonId,
      filename: "lesson.yml"
    })
  };
};
