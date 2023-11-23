import { useEffect, useState, FC, useCallback, useRef } from "react";
import { SAVED, SAVING } from "./settingsFiles/languages/editor_NO";
import { useFileContext } from "../../contexts/FileContext";
import debounce from "lodash.debounce";

interface AutosaveProps {
  mdText: string;
}

const Autosave: FC<AutosaveProps> = ({ mdText }) => {
  const [autoSaveMessage, setAutoSaveMessage] = useState("");
  const { saveFileBody } = useFileContext();
  const lastTypingTime = useRef<Date | null>(null);

  const checkTypingFrequency = useCallback(() => {
    const now = new Date();
    if (lastTypingTime.current) {
      // Sjekk om tidsforskjellen mellom nåværende og siste tastetrykk er mindre enn et sekund
      return now.getTime() - lastTypingTime.current.getTime() < 1000;
    }
    lastTypingTime.current = now;
    return false;
  }, []);

  const debouncedSave = useCallback(
    debounce(async (text: string) => {
      if (!checkTypingFrequency()) {
        try {
          const status = await saveFileBody(text);
          if (status === 200) {
            setAutoSaveMessage(SAVED);
            setTimeout(() => {
              setAutoSaveMessage("");
            }, 2000);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }, 3000), // Øk tidsintervallet for debounce til et par sekunder
    [checkTypingFrequency]
  );

  useEffect(() => {
    debouncedSave(mdText);

    return () => {
      debouncedSave.cancel();
      setAutoSaveMessage(SAVING);
    };
  }, [mdText, debouncedSave]);

  return (
    <>
      <p>{autoSaveMessage}</p>
    </>
  );
};

export default Autosave;
