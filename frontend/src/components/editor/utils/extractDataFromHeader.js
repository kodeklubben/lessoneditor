export const extractDataFromHeader = (tekst) => {
  if (
    !tekst ||
    typeof tekst === "object" ||
    (tekst.slice(0, 3) !== "---" && tekst.length > 3)
  ) {
    return false;
  }

  let returnValue = "";
  let parsedText = "";
  let indexHeaderEnding = -1;
  let indexTitle = -1;
  let indexAuthor = -1;
  let indexTranslator = -1;
  let title = "";
  let author = "";
  let translator = "";

  indexHeaderEnding = tekst.slice(3).indexOf("---");
  parsedText = tekst.slice(3, indexHeaderEnding + 3);

  let indexLessonStart = indexHeaderEnding + 6;

  indexTitle = parsedText.indexOf("title");
  indexAuthor = parsedText.indexOf("author");
  indexTranslator = parsedText.indexOf("translator");

  while (parsedText[indexTitle + 6] !== "\n") {
    title += parsedText[indexTitle + 6];
    indexTitle++;
  }
  while (parsedText[indexAuthor + 7] !== "\n") {
    author += parsedText[indexAuthor + 7];
    indexAuthor++;
  }
  if (indexTranslator !== -1) {
    while (parsedText[indexTranslator + 11] !== "\n") {
      translator += parsedText[indexTranslator + 11];
      indexTranslator++;
    }
  }
  let authorList = author.split(",");
  let translatorList = translator.split(",");

  title = title.trim();
  for (let i = 0; i < authorList.length; i++) {
    authorList[i] = authorList[i].trim();
  }
  for (let i = 0; i < translatorList.length; i++) {
    translatorList[i] = translatorList[i].trim();
  }

  returnValue = {
    title,
    authorList,
    indexLessonStart,
  };
  if (translatorList.length > 0 && translatorList[0] !== "")
    returnValue.translatorList = translatorList;

  return returnValue;
};
