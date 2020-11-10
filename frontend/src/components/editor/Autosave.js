import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router";
import { LessonContext } from "contexts/LessonContext";
import saveMdText from "../../api/save-md-text";
import { SAVING, SAVED } from "./settingsFiles/languages/editor_NO";
import createNewHeader from ".//buttonpanel/utils/createNewHeader";

const Autosave = ({ mdText, setRenderContent, language }) => {
  const [savedText, setSavedText] = useState("");
  const [counter, setCounter] = useState(0);
  const [autoSaveMessage, setAutoSaveMessage] = useState("");
  const { lessonId, file } = useParams();
  const lessonContext = useContext(LessonContext);
  const { getHeaderData } = lessonContext;

  const newHeader = () => {
    return getHeaderData().then((res) => {
      return createNewHeader(res, language);
    });
  };

  useInterval(() => {
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
      newHeader().then((newHeader) => {
        const newMdText =
          typeof newHeader !== "undefined"
            ? newHeader + "\n\n\n" + mdText
            : mdText;
        saveMdText(lessonId, file, newMdText).then(setAutoSaveMessage(SAVED));
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
