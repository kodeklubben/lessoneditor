export type FilenameData = {
  language: string;
  languageName?: string;
  isMarkdown: boolean;
  isReadme: boolean;
}
/**
 * Samler alle funksjoner som tolker innholdet i filenavnet ett sted.
 * @param filename
 */
export const filenameParser = (filename?: string): FilenameData => {
  const language = filename && filename.slice(-3, -2) === "_" ? filename.slice(-2) : "nb";
  const isMarkdown = filename ? filename.slice(-2) === "md" : false;
  const isReadme = filename ? filename.slice(0, 6) === "README" : false;
  const languageName = {
    nb: "Bokmål",
    nn: "Nynorsk",
    en: "Engelsk",
    is: "Islandsk"
  }[language];
  return {
    language,
    isMarkdown,
    isReadme,
    languageName
  };
};

