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
  const { lessonId, file } = useParams();
  const lessonContext = useContext(LessonContext);
  const { getHeaderData } = lessonContext;

  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

  const newHeader = (language) => {
    const res = getHeaderData();
    const header = createNewHeader(res, language);
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
      const newHeaderText = newHeader(language);
      const newMdText =
        typeof newHeaderText !== "undefined"
          ? newHeaderText + "\n\n\n" + mdText
          : mdText;
      await saveMdText(lessonId, file, newMdText);
      setAutoSaveMessage(SAVED);
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
