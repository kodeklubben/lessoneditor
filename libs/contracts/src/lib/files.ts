export type FileName = { filename: string; ext: string };

/** "hei_en.md" → { filename: "hei_en", ext: ".md" }; the extension is the part after the last dot. */
export function splitFilename(name: string): FileName {
  const dot = name.lastIndexOf(".");
  return dot > 0
    ? { filename: name.slice(0, dot), ext: name.slice(dot) }
    : { filename: name, ext: "" };
}

/**
 * Language codes that appear as a suffix on lesson texts in kodeklubben/oppgaver and the editor
 * (bokmål has none). "sam" is the editor's old code for Northern Sami.
 */
export const TEXT_LANGUAGES = ["nb", "nn", "se", "sam", "en", "is", "fr", "ua"];

/**
 * "lunar_lander_nn" → { base: "lunar_lander", language: "nn" }; "lunar_lander" → bokmål. Only a
 * known language code counts as a suffix, so an underscore in the name is not read as a language.
 */
export function splitTextName(name: string): { base: string; language: string } {
  const match = /^(.+)_([a-z]{2,3})$/.exec(name);
  return match && TEXT_LANGUAGES.includes(match[2])
    ? { base: match[1], language: match[2] }
    : { base: name, language: "nb" };
}

const isLessonText = (file: FileName) => file.ext === ".md" && !/^README(_|$)/.test(file.filename);

/**
 * lesson.yml, preview.png and the last lesson text hold a lesson together: without them the
 * landing page, the thumbnail and the submission break. Returns why a file cannot be deleted,
 * or null. The server enforces it; the editor uses it to hide the delete button.
 */
export function deletionBlocker(file: FileName, files: FileName[]): string | null {
  if (file.filename === "lesson" && file.ext === ".yml")
    return "lesson.yml hører til oppgaven og kan ikke slettes.";
  if (file.filename === "preview" && file.ext === ".png")
    return "Miniatyrbildet hører til oppgaven og kan ikke slettes.";
  if (isLessonText(file) && files.filter(isLessonText).length <= 1)
    return "Den siste oppgaveteksten kan ikke slettes. Slett heller hele oppgaven.";
  return null;
}
