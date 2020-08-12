import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import saveMdText from "../../api/save-md-text";
import { SAVING, SAVED } from "./settingsFiles/languages/editor_NO";

const Autosave = ({ mdText, setRenderContent }) => {
  const [savedText, setSavedText] = useState("");
  const [counter, setCounter] = useState(0);
  const { lessonId, file } = useParams();
  const [autoSaveMessage, setAutoSaveMessage] = useState("");

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
      await saveMdText(lessonId, file, mdText);
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

  return <div>{savedText ? autoSaveMessage : ""}</div>;
};

export default Autosave;
