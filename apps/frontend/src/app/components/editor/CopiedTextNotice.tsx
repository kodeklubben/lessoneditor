import { FC, useState } from "react";
import { useParams } from "react-router";
import { Button, Message } from "semantic-ui-react";
import { useFileContext } from "../../contexts/FileContext";
import { languageOption } from "../frontpage/settings/newLessonOptions";

/**
 * A text copied from another language to be translated: it still reads as the original until it
 * is translated, which was confusing (bokmål words in the English text). Says so until the
 * translator marks it done.
 */
const CopiedTextNotice: FC = () => {
  const { lang } = useParams() as { lang: string };
  const { state, saveFileHeader, setFileContextState } = useFileContext();
  const [saving, setSaving] = useState(false);
  const from = state.headerData?.copiedFrom;
  if (!from || from === lang) return null;

  const markDone = async () => {
    setSaving(true);
    const headerData = { ...state.headerData };
    delete headerData.copiedFrom;
    if ((await saveFileHeader(headerData)) === 200) {
      setFileContextState((s) => ({ ...s, headerData }));
    }
    setSaving(false);
  };

  const source = String(languageOption(from).text).toLowerCase();
  const target = String(languageOption(lang).text).toLowerCase();
  return (
    <Message info size="small" className="copied-text-notice">
      <img src={languageOption(lang).image?.src} alt="" className="text-switcher__flag" />
      <span>
        Denne teksten er en kopi av teksten på <strong>{source}</strong>. Skriv den om til{" "}
        <strong>{target}</strong>; det du ikke har oversatt ennå, står fortsatt på {source}.
      </span>
      <Button size="mini" basic onClick={markDone} loading={saving} disabled={saving}>
        Ferdig oversatt
      </Button>
    </Message>
  );
};

export default CopiedTextNotice;
