import { useEffect, useRef, useState } from "react";
import { SAVED, SAVING } from "./settingsFiles/languages/editor_NO";

// @ts-ignore
const Autosave = ({ mdText, setRenderContent, saveEditorText }) => {
  const [savedText, setSavedText] = useState("");
  const [counter, setCounter] = useState(0);
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
      await saveEditorText();
      setAutoSaveMessage(SAVED);
    }
    if (counter === 15) {
      setAutoSaveMessage("");
    }
  }, 300);

  function useInterval(
    callback: (() => Promise<void>) | undefined,
    delay: number | null | undefined
  ) {
    const savedCallback = useRef();

    useEffect(() => {
      // @ts-ignore
      savedCallback.current = callback;
    }, [callback]);

    // @ts-ignore
    useEffect(() => {
      function tick() {
        // @ts-ignore
        savedCallback.current();
      }

      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  return (
    <div>
      <p>{savedText ? autoSaveMessage : ""}</p>
    </div>
  );
};

export default Autosave;
