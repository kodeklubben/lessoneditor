import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useLessonContext } from "../../contexts/LessonContext";
import LessontextItem from "./LessontextItem";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { filenameParser } from "../../utils/filename-parser";
import { Button, Item, Loader, Message } from "semantic-ui-react";
import { compareLanguages } from "../frontpage/settings/newLessonOptions";

const LessontextItems = () => {
  // undefined until the file list has loaded, so "no text yet" is not shown while loading.
  const [usedLanguages, setUsedLanguages] = useState<string[] | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const { fetchFileList, setFiles, state: lessonState } = useLessonContext();
  const { lessonId } = useParams() as any;

  const { lessonTitle, lessonSlug } = lessonState.lesson;

  useEffect(() => {
    let active = true;
    // A failed list was a blank tab with no sign of what happened (P2-11).
    fetchFileList()
      .then((fileList) => {
        if (!active) return;
        setFailed(false);
        setUsedLanguages(
          fileList
            .map(filenameParser)
            .filter(({ isReadme, language }) => !isReadme && language.length > 0)
            .map(({ language }) => language),
        );
      })
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [lessonState.files, attempt]);

  /** Throws on failure, so the dialog can say so. The server keeps the last lesson text (K15). */
  const removeMD = async (language: string, file: string) => {
    const filename = language === "nb" ? file : `${file}_${language}`;
    await axios.delete(
      paths.LESSON_FILE_DELETE.replace(":lessonId", lessonId.toString())
        .replace(":filename", filename)
        .replace(":ext", "md"),
    );
    setFiles(await fetchFileList());
  };

  return (
    <Item.Group divided>
      {failed ? (
        <Message warning>
          <p>Kunne ikke hente tekstene.</p>
          <Button size="small" onClick={() => setAttempt((n) => n + 1)} content="Prøv igjen" />
        </Message>
      ) : usedLanguages === undefined ? (
        <Loader active inline="centered" content="Henter tekstene …" />
      ) : usedLanguages.length > 0 ? (
        [...usedLanguages]
          .sort(compareLanguages)
          .map((language: string) => (
            <LessontextItem
              key={language}
              language={language}
              lessonId={lessonId}
              lessonSlug={lessonSlug}
              lessonTitle={lessonTitle}
              removeMD={removeMD}
              canDelete={usedLanguages.length > 1}
            />
          ))
      ) : (
        <Message>
          <Message.Header>Du har ikke skrevet oppgavetekst</Message.Header>
          <p>Opprett ny tekst ved å trykke på knappen "Ny tekstfil"</p>
        </Message>
      )}
    </Item.Group>
  );
};

export default LessontextItems;
