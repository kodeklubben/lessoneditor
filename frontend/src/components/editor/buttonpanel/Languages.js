import React from "react";
import { useHistory } from "react-router";
import { Dropdown, Popup } from "semantic-ui-react";
import languageOptions from "./LanguageOptions";

const Languages = ({ setShowSpinner, saveEditorText, lessonId, file }) => {
  const history = useHistory();

  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

  const filename =
    file && file.slice(-3, -2) === "_" ? file.slice(0, -3) : file;

  const handleChange = async (event, { value }) => {
    setShowSpinner(true);
    let target = "";
    if (lessonId) {
      target = [
        "/editor",
        lessonId,
        value === "nb" ? filename : `${filename}_${value}`,
      ].join("/");
    }
    await saveEditorText();
    if (target !== "") {
      history.push({ pathname: target });
    } else {
      console.error("error targetLanguage is not set");
    }
    setShowSpinner(false);
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
