import React, { useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { LessonContext } from "contexts/LessonContext";
import { Popup, Dropdown } from "semantic-ui-react";
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

const Languages = ({ mdText, setShowSpinner, language }) => {
  const history = useHistory();
  const { lessonId, file } = useParams();
  const lessonContext = useContext(LessonContext);
  const { getHeaderData, setLanguage } = lessonContext;

  const newHeader = async (language) => {
    const header = getHeaderData().then((res) => {
      return createNewHeader(res, language);
    });

    return header;
  };

  const filename =
    file && file.slice(-3, -2) === "_" ? file.slice(0, -3) : file;

  useEffect(() => {
    setLanguage(language);
  }, [language, setLanguage]);

  const handleChange = (event, { value }) => {
    setShowSpinner(true);
    let target = "";
    if (lessonId) {
      target = [
        "/editor",
        lessonId,
        value === "nb" ? filename : `${filename}_${value}`,
      ].join("/");
    }
    newHeader(value).then((newHeader) => {
      const newMdText =
        typeof newHeader !== "undefined"
          ? newHeader + "\n\n\n" + mdText
          : mdText;

      saveMdText(lessonId, file, newMdText).then(() => {
        if (target !== "") {
          history.push(target);
          window.location.reload();
          // setShowSpinner(false);
          return;
        } else {
          console.log("error");
        }
      });
    });
  };
  return (
    <>
      <Popup
        content={"Endre språk for oppgavetekst"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Dropdown
            style={{
              width: "12em",
            }}
            placeholder="Velg Språk"
            name="language"
            defaultValue={language}
            fluid
            selection
            onChange={handleChange}
            options={languageOptions}
          />
        }
      />
    </>
  );
};

export default Languages;
