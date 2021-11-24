import { useNavigate, useParams } from "react-router";
import { Dropdown, Popup } from "semantic-ui-react";
import languageOptions from "./buttoncontroller/settings/LanguageOptions";
import { FC, SyntheticEvent } from "react";
import { filenameParser } from "../../../utils/filename-parser";

interface LanguagesProps {
  saveEditorText: (regenThumb: boolean) => void;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}

const Languages: FC<LanguagesProps> = ({ saveEditorText, setShowSpinner }) => {
  const { lessonId, file } = useParams<any>();
  const navigate = useNavigate();
  const { language } = filenameParser(file);

  const filename = file && file.slice(-3, -2) === "_" ? file.slice(0, -3) : file;

  const handleChange = async (event: SyntheticEvent, { value }: Record<string, string>) => {
    setShowSpinner(true);
    const target = lessonId
      ? ["/editor", lessonId, value === "nb" ? filename : `${filename}_${value}`].join("/")
      : "";

    saveEditorText(true);
    if (target !== "") {
      navigate(target);
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
