import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router";
import { LessonContext } from "contexts/LessonContext";
import saveMdText from "../../api/save-md-text";
import { SAVING, SAVED } from "./settingsFiles/languages/editor_NO";
import createNewHeader from ".//buttonpanel/utils/createNewHeader";

const Autosave = ({ mdText, setRenderContent }) => {
  const [savedText, setSavedText] = useState("");
  const [counter, setCounter] = useState(0);
  const [autoSaveMessage, setAutoSaveMessage] = useState("");
  const { lessonId, file, language } = useParams();
  const lessonContext = useContext(LessonContext);
  const { headerData } = lessonContext;

  const newHeader = async () => {
    const header = createNewHeader(await headerData, await language);

    return header;
  };

  useInterval(async () => {
    if (counter < 17) {
      setCounter(counter + 1);
    }

    if (counter >= 0 && mdText !== savedText) {
      setRenderContent(false);
      setSavedText(mdText);
      setCounter(0);
      setAutoSaveMessage(SAVING);
    } else if (counter === 5 && autoSaveMessage !== SAVED) {
      setRenderContent(true);
      newHeader().then(async (newHeader) => {
        let filename = "";
        if (language === "nb") {
          filename = file;
        } else {
          filename = `${file}_${language}`;
        }
        const newMdText =
          typeof newHeader !== "undefined"
            ? newHeader + "\n\n\n" + mdText
            : mdText;
        await saveMdText(lessonId, filename, newMdText).then(
          setAutoSaveMessage(SAVED)
        );
      });
    }
    if (counter === 15) {
      setAutoSaveMessage("");
    }
  }, 300);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  return (
    <div style={{ display: "block" }}>{savedText ? autoSaveMessage : ""}</div>
  );
};

export default Autosave;
