// imagePopup text
const PHOTO_TEXT = "Bildebeskrivelse her";

//buttons default text
const DEFAULT_TEXT = "Tekst her";

/**
 * The placeholder the buttons insert, in the language of the text being written (9d): «Tekst
 * her» in an English or Ukrainian text had to be replaced word by word. Bokmål, nynorsk and the
 * languages without a translation here keep «Tekst her».
 */
const PLACEHOLDERS: Record<string, string> = {
  en: "Text here",
  is: "Texti hér",
  fr: "Texte ici",
  ua: "Текст тут",
  uk: "Текст тут",
};
export const placeholderText = (language?: string) =>
  (language && PLACEHOLDERS[language]) || DEFAULT_TEXT;

// Page navigation buttons
const NAV_BUTTONS = {
  prev: "Tilbake",
  next: "Neste",
  submit: "Send inn",
};

// Button Names
const BUTTON_TITLE = {
  bold: "Fet",
  italic: "Kursiv",
  heading: "Overskrift",
  strikethrough: "Gjennomstreking",
  undo: "Angre",
  redo: "Gjøre om",
  hyperlink: "Sett inn lenke",
  image: "Bilde",
  video: "Video",
  preview: "Forhåndsvisning",
  listUl: "Uordnet liste",
  listOl: "Ordnet liste",
  listCheck: "Sjekkliste",
  explorer: "Filutforsker",
  activity: "Steg",
  intro: "Intro",
  check: "Sjekkliste",
  tip: "Tips",
  protip: "ProTips",
  challenge: "Utfordring",
  flag: "Flagg",
  try: "Prøv selv",
  inline: "Kode i teksten",
  codeblock: "Kodeblokk",
  save: "Lagre",
};

export { PHOTO_TEXT, DEFAULT_TEXT, BUTTON_TITLE, NAV_BUTTONS };
