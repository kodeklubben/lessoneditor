import React, { useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { LessonContext } from "contexts/LessonContext";
import { Dropdown } from "semantic-ui-react";
import saveMdText from "../../../api/save-md-text";

const languageOptions = [
  {
    key: 1,
    text: "Bokmål",
    value: "nb",
    image: { avatar: true, src: "/languagesFlag/flag_nb.svg" },
  },
  {
    key: 2,
    text: "Nynorsk",
    value: "nn",
    image: { avatar: true, src: "/languagesFlag/flag_nn.svg" },
  },
  {
    key: 3,
    text: "Engelsk",
    value: "en",
    image: { avatar: true, src: "/languagesFlag/flag_en.svg" },
  },
  {
    key: 4,
    text: "Islandsk",
    value: "is",
    image: { avatar: true, src: "/languagesFlag/flag_is.svg" },
  },
];

const Languages = (mdText) => {
  const history = useHistory();
  const { lessonId, file } = useParams();
  const lessonContext = useContext(LessonContext);
  const { data, language, setLanguage, headerData } = lessonContext;

  let header;

  if (headerData[language] && Object.keys(headerData[language]).length !== 0) {
    header = `---
title: ${headerData[language].title ? headerData[language].title : `test`}
author: ${
      headerData[language].authorList ? headerData[language].authorList : ""
    }
${
  headerData[language].translatorList
    ? `translator: ${headerData[language].translatorList}`
    : ``
}
language: ${language ? language : ""}
---
`;
  }

  let newMdText = header !== undefined ? header + "\n\n\n" + mdText : mdText;

  const defaultValue = (file) => {
    let returnvalue;
    switch (file.slice(-3)) {
      case "_nn":
        returnvalue = "nn";
        break;
      case "_en":
        returnvalue = "en";
        break;
      case "_is":
        returnvalue = "is";
        break;
      default:
        returnvalue = "nb";
        break;
    }
    return returnvalue;
  };

  useEffect(() => {
    setLanguage(defaultValue(file));
  });

  const handleChange = async (event, { value }) => {
    let target;
    if (lessonId && file && value !== "nb") {
      target = ["/editor", lessonId, (await data.lesson) + "_" + value].join(
        "/"
      );
    } else if (lessonId && file) {
      target = ["/editor", lessonId, await data.lesson].join("/");
    }
    if (newMdText.length > 0) await saveMdText(lessonId, file, newMdText);
    history.push(target);
  };
  return (
    <>
      <Dropdown
        style={{
          width: "13em",
        }}
        placeholder="Velg Språk"
        name="language"
        defaultValue={file ? defaultValue(file) : ""}
        fluid
        selection
        onChange={handleChange}
        options={languageOptions}
      />
    </>
  );
};

export default Languages;
