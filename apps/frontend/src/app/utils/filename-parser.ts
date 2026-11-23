import { splitTextName } from "@lessoneditor/contracts";
import { languageOption } from "../components/frontpage/settings/newLessonOptions";

export type FilenameData = {
  language: string;
  languageName: string;
  isMarkdown: boolean;
  isReadme: boolean;
};

/**
 * Reads language and kind from a file name: "lunar_lander_nn.md" is a Nynorsk lesson text,
 * "README.md" a bokmål teacher guide. An underscore in the name itself is not a language.
 */
export const filenameParser = (filename?: string): FilenameData => {
  if (!filename) return { language: "", languageName: "", isMarkdown: false, isReadme: false };
  const dot = filename.lastIndexOf(".");
  const name = dot > 0 ? filename.slice(0, dot) : filename;
  const isMarkdown = filename.slice(dot + 1) === "md";
  const { base, language } = splitTextName(name);
  return {
    language: isMarkdown ? language : "",
    isMarkdown,
    isReadme: base === "README",
    languageName: isMarkdown ? languageOption(language).text : "",
  };
};
