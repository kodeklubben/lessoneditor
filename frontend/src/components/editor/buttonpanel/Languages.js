import React, { useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { LessonContext } from "contexts/LessonContext";
import { Dropdown } from "semantic-ui-react";
import saveMdText from "../../../api/save-md-text";
import createNewHeader from "./utils/createNewHeader";

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

const Languages = ({ mdText, setShowSpinner }) => {
  const history = useHistory();
  const { lessonId, file, language } = useParams();
  const lessonContext = useContext(LessonContext);
  const { headerData, setLanguage } = lessonContext;

  const newHeader = async (language) => {
    const header = createNewHeader(await headerData, language);

    return header;
  };

  // const defaultValue = (file = "_nb") => {
  //   let returnvalue;
  //   switch (file.slice(-3)) {
  //     case "_nn":
  //       returnvalue = "nn";
  //       break;
  //     case "_en":
  //       returnvalue = "en";
  //       break;
  //     case "_is":
  //       returnvalue = "is";
  //       break;
  //     default:
  //       returnvalue = "nb";
  //       break;
  //   }
  //   return returnvalue;
  // };

  useEffect(() => {
    setLanguage(language);
  }, [language, setLanguage]);

  const handleChange = async (event, { value }) => {
    setShowSpinner(true);
    let target;
    if (lessonId) {
      target = ["/editor", lessonId, file, value].join("/");
    }
    newHeader(value).then(async (newHeader) => {
      const newMdText =
        typeof newHeader !== "undefined"
          ? newHeader + "\n\n\n" + mdText
          : mdText;
      await saveMdText(
        lessonId,
        language === "nb" ? file : `${file}_${language}`,
        newMdText
      ).then(() => {
        history.push("/");
        history.replace(target);
        setShowSpinner(false);
        return;
      });
    });
  };
  return (
    <>
      <Dropdown
        style={{
          width: "13em",
        }}
        placeholder="Velg Språk"
        name="language"
        defaultValue={language}
        fluid
        selection
        onChange={handleChange}
        options={languageOptions}
      />
    </>
  );
};

export default Languages;
