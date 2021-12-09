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
      const status: number = await saveFileBody(mdText);
      if (status === 200) setAutoSaveMessage(SAVED);
      setTimeout(() => {
        setAutoSaveMessage("");
      }, 1000);
    }, 500);

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
