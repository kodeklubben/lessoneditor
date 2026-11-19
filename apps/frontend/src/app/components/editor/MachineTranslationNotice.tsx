import { FC, useState } from "react";
import { Button, Message } from "semantic-ui-react";
import { useFileContext } from "../../contexts/FileContext";

/** Shown on machine translated texts until someone has read them through. */
const MachineTranslationNotice: FC = () => {
  const { state, saveFileHeader, setFileContextState } = useFileContext();
  const [saving, setSaving] = useState(false);
  if (!state.headerData?.machineTranslated) return null;

  const markReviewed = async () => {
    setSaving(true);
    const headerData = { ...state.headerData, machineTranslated: false };
    if ((await saveFileHeader(headerData)) === 200) {
      setFileContextState((s) => ({ ...s, headerData }));
    }
    setSaving(false);
  };

  return (
    <Message warning size="small" style={{ margin: "0.5rem 0" }}>
      Denne teksten er maskinoversatt
      {state.headerData.translatedFrom ? ` fra «${state.headerData.translatedFrom}»` : ""}. Les
      gjennom og rett den før du sender inn.{" "}
      <Button size="mini" basic onClick={markReviewed} loading={saving} disabled={saving}>
        Jeg har lest gjennom
      </Button>
    </Message>
  );
};

export default MachineTranslationNotice;
