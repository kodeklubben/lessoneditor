import { useHistory, useParams } from "react-router";
import { Dropdown, Popup } from "semantic-ui-react";
import languageOptions from "./settings/LanguageOptions";
import { FC } from "react";
import { filenameParser } from "../../../utils/filename-parser";

const Languages: FC<any> = ({ saveEditorText, setShowSpinner }) => {
  const { lessonId, file } = useParams<any>();
  const history = useHistory();
  const { language } = filenameParser(file);

  const filename =
    file && file.slice(-3, -2) === "_" ? file.slice(0, -3) : file;

  const handleChange = async (event: any, { value }: any) => {
    setShowSpinner(true);
    let target = "";
    if (lessonId) {
      target = [
        "/editor",
        lessonId,
        value === "nb" ? filename : `${filename}_${value}`
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
    <div>
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
    </div>
  );
};

export default Languages;
