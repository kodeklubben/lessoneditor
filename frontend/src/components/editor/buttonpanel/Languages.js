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

const Languages = ({ mdText, file }) => {
  const history = useHistory();
  const { lessonId } = useParams();
  const lessonContext = useContext(LessonContext);
  const { data, language, setLang, saveLesson } = lessonContext;

  let header;

  if (
    data.header[language] &&
    Object.keys(data.header[language]).length !== 0
  ) {
    header = `---
title: ${
      data.header[language].title.length > 0 ? data.header[language].title : ""
    }
author: ${
      data.header[language].authorList.length > 0
        ? data.header[language].authorList
        : ""
    }
${
  data.header[language].translatorList &&
  data.header[language].translatorList.length > 0
    ? `translator: ${data.header[language].translatorList}`
    : ``
}
language: ${language ? language : ""}
---
`;
  }

  let newMdText = header !== undefined ? header + "\n\n\n" + mdText : mdText;

  const defaultValue = (file) => {
    let returnvalue;
    switch (file?.slice(-3)) {
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
    setLang(defaultValue(file));
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
    saveLesson(data);
    setLang(value);
    history.push({ pathname: "/empty" });
    history.replace({ pathname: target });
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
