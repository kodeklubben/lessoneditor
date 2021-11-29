import { LANGUAGEOPTIONS } from "../components/frontpage/settings/newLessonOptions";

export type FilenameData = {
  language: string;
  languageName: string;
  isMarkdown: boolean;
  isReadme: boolean;
};
/**
 * Samler alle funksjoner som tolker innholdet i filenavnet ett sted.
 * @param filename
 */
export const filenameParser = (filename?: string): FilenameData => {
  if (filename) {
    const [name, ext] = filename.split(".");

    const isMarkdown = ext === "md";
    const language = isMarkdown ? (name.includes("_") ? name.split("_")[1] : "nb") : "";

    const isReadme = name === "README";
    const languageName = isMarkdown
      ? LANGUAGEOPTIONS.filter((item) => item.value === language)[0].text
      : "";

    console.log({ filename, language, isMarkdown, isReadme, languageName });

    return {
      language,
      isMarkdown,
      isReadme,
      languageName,
    };
  } else {
    return { language: "", languageName: "", isMarkdown: false, isReadme: false };
  }
};
