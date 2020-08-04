import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router";
import saveMdText from "../../api/save-md-text";
import { UserContext } from "../../contexts/UserContext";
import { SAVING, SAVED } from "./settingsFiles/languages/editor_NO";

const Autosave = ({ mdText, counter, setCounter }) => {
  const context = useContext(UserContext);
  const [savedText, setSavedText] = useState("");

  const { course, lesson, file } = useParams();
  const [autoSaveMessage, setAutoSaveMessage] = useState("");

  useInterval(async () => {
    if (counter < 17) {
      setCounter(counter + 1);
    }
    if (counter >= 0 && mdText !== savedText) {
      setSavedText(mdText);
      setCounter(0);
      setAutoSaveMessage(SAVING);
    } else if (counter === 5 && autoSaveMessage !== SAVED) {
      await saveMdText(course, lesson, file, mdText);
      if (!context.getLesson(course, lesson)) {
        await context.addLesson(course, lesson, lesson);
      }
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
