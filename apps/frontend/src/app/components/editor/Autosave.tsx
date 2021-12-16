import { useEffect, useRef, useState, FC } from "react";
import { SAVED, SAVING } from "./settingsFiles/languages/editor_NO";
import { useFileContext } from "../../contexts/FileContext";

interface AutosaveProps {
  mdText: string;
}

const Autosave: FC<AutosaveProps> = ({ mdText }) => {
  const [autoSaveMessage, setAutoSaveMessage] = useState("");
  const { saveFileBody } = useFileContext();

  useEffect(() => {
    const timeoutHandler = setTimeout(async () => {
      try {
        await saveFileBody(mdText);
        setAutoSaveMessage(SAVED);
      } catch (e) {
        console.error(e);
      }
      setTimeout(() => {
        setAutoSaveMessage("");
      }, 2000);
    }, 750);

    return () => {
      clearTimeout(timeoutHandler);
      setAutoSaveMessage(SAVING);
    };
  }, [mdText]);

  return (
    <>
      <p>{autoSaveMessage}</p>
    </>
  );
};

export default Autosave;
