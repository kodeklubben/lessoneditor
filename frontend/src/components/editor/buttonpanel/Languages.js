import React from "react";
import { useHistory } from "react-router";
import { Dropdown, Popup } from "semantic-ui-react";
import languageOptions from "./LanguageOptions";

const Languages = ({ saveEditorText, lessonId, file, setShowSpinner }) => {
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
      history.push("/");
      history.replace(target);
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
            placeholder="Velg Språk"
            name="language"
            defaultValue={language}
            selection
            onChange={handleChange}
            options={languageOptions}
            id="lang_dropdown"
          ></Dropdown>
        }
      />
    </>
  );
};

export default Languages;
