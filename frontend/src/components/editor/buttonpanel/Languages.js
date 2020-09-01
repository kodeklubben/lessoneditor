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

const Languages = ({ mdText, file, setShowSpinner }) => {
  const history = useHistory();
  const { lessonId } = useParams();
  const lessonContext = useContext(LessonContext);
  const { headerData, setLanguage } = lessonContext;

  const newHeader = async (language) => {
    const header = createNewHeader(await headerData, language);

    return header;
  };

  const defaultValue = (file = "_nb") => {
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
  }, [file, setLanguage]);

  const handleChange = async (event, { value }) => {
    setShowSpinner(true);
    let target;
    if (lessonId) {
      if (defaultValue(file) !== "nb" && value !== "nb") {
        target = ["/editor", lessonId, file.slice(0, -2) + value].join("/");
      } else if (defaultValue(file) === "nb" && value !== "nb") {
        target = ["/editor", lessonId, file + "_" + value].join("/");
      } else if (defaultValue(file) !== "nb" && value === "nb") {
        target = ["/editor", lessonId, file.slice(0, -3)].join("/");
      } else {
        console.log("change language dropdown error");
      }
    }
    newHeader(value).then(async (newHeader) => {
      const newMdText =
        typeof newHeader !== "undefined"
          ? newHeader + "\n\n\n" + mdText
          : mdText;
      await saveMdText(lessonId, file, newMdText).then(() => {
        history.push(target);
        history.replace(target);
        setShowSpinner(false);
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
