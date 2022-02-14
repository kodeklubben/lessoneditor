import { useEffect, useRef, useState, FC } from "react";
import { SAVED, SAVING } from "./settingsFiles/languages/editor_NO";
import { useFileContext } from "../../contexts/FileContext";

interface AutosaveProps {
  mdText: string;
}

const Autosave: FC<AutosaveProps> = ({ mdText }) => {
  const [autoSaveMessage, setAutoSaveMessage] = useState("");
  const { saveFileBody, updateThumbnail } = useFileContext();

  useEffect(() => {
    const timeoutHandler = setTimeout(async () => {
      try {
        saveFileBody(mdText).then(() => {
          updateThumbnail()
            .then(() => {
              setAutoSaveMessage(SAVED);
            })
            .then(() => {
              setTimeout(() => {
                setAutoSaveMessage("");
              }, 3000);
            });
        });
      } catch (e) {
        console.error(e);
      }
    }, 1500);

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
