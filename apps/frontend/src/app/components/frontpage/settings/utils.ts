import { LANGUAGEOPTIONS } from "./newLessonOptions";

export const getLangName = (lang?: string) => {
  const langRecord = LANGUAGEOPTIONS.find((item) => item.value === lang);
  if (langRecord) {
    return langRecord.text;
  } else {
    console.warn(`Can't find language "${lang}".`);
  }
};
