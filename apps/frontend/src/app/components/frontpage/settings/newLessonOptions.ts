import nbFlag from "../../../../assets/public/languagesFlag/flag_nb.svg";
import nnFlag from "../../../../assets/public/languagesFlag/flag_nn.svg";
import enFlag from "../../../../assets/public/languagesFlag/flag_en.svg";
import isFlag from "../../../../assets/public/languagesFlag/flag_is.svg";
import frFlag from "../../../../assets/public/languagesFlag/flag_fr.svg";
import samFlag from "../../../../assets/public/languagesFlag/flag_sam.svg";
import uaFlag from "../../../../assets/public/languagesFlag/flag_ua.svg";

export const LANGUAGEOPTIONS: Record<string, any>[] = [
  {
    key: "nb",
    text: "Bokmål",
    value: "nb",
    image: { avatar: true, src: nbFlag },
  },
  {
    key: "nn",
    text: "Nynorsk",
    value: "nn",
    image: { avatar: true, src: nnFlag },
  },
  {
    // ISO 639-1 for Northern Sami, as in kodeklubben/oppgaver. Older files may still say "sam".
    key: "se",
    text: "Nordsamisk",
    value: "se",
    image: { avatar: true, src: samFlag },
  },
  {
    key: "en",
    text: "Engelsk",
    value: "en",
    image: { avatar: true, src: enFlag },
  },
  {
    key: "is",
    text: "Islandsk",
    value: "is",
    image: { avatar: true, src: isFlag },
  },
  {
    key: "fr",
    text: "Fransk",
    value: "fr",
    image: { avatar: true, src: frFlag },
  },
  {
    // "ua", as kodeklubben/oppgaver names its Ukrainian texts (ISO 639-1 would be "uk").
    key: "ua",
    text: "Ukrainsk",
    value: "ua",
    image: { avatar: true, src: uaFlag },
  },
];

/** Language codes that were used before and now mean another entry. */
const LANGUAGE_ALIASES: Record<string, string> = { sam: "se" };

/** Never undefined: unknown codes get a plain entry instead of crashing the page. */
/** Sorts language codes in the order of the language list (bokmål, nynorsk, samisk …). */
export function compareLanguages(a: string, b: string): number {
  const order = LANGUAGEOPTIONS.map((option) => option.value);
  const rank = (code: string) => {
    const index = order.indexOf(languageOption(code).value);
    return index === -1 ? order.length : index;
  };
  return rank(a) - rank(b) || a.localeCompare(b);
}

export function languageOption(code: string): Record<string, any> {
  const value = LANGUAGE_ALIASES[code] ?? code;
  return (
    LANGUAGEOPTIONS.find((item) => item.value === value) ?? {
      key: code,
      text: code,
      value: code,
      image: { avatar: true, src: "" },
    }
  );
}

export const COURSESLIST: { key: any; text: any; value: any }[] = [
  {
    key: "appinventor",
    text: "App Inventor",
    value: "appinventor",
  },
  {
    key: "arduino",
    text: "Arduino",
    value: "arduino",
  },
  {
    key: "codestudio",
    text: "Code Studio",
    value: "codestudio",
  },
  {
    key: "computercraft",
    text: "Computer Craft",
    value: "computercraft",
  },
  {
    key: "diverse",
    text: "Diverse",
    value: "diverse",
  },
  {
    key: "elm",
    text: "Elm",
    value: "elm",
  },
  {
    key: "lego",
    text: "Lego",
    value: "lego",
  },
  {
    key: "legomindstorms",
    text: "Lego Mindstorms",
    value: "legomindstorms",
  },
  {
    key: "microbit",
    text: "Micro:bit",
    value: "microbit",
  },
  {
    key: "processing",
    text: "Processing",
    value: "processing",
  },
  {
    key: "python",
    text: "Python",
    value: "python",
  },
  {
    key: "scratch",
    text: "Scratch",
    value: "scratch",
  },
  {
    key: "scratchjr",
    text: "Scratch Jr",
    value: "scratchjr",
  },
  {
    key: "web",
    text: "Web",
    value: "web",
  },
  {
    key: "uten_datamaskin",
    text: "Uten datamaskin",
    value: "uten_datamaskin",
  },
];
