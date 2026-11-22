import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useLessonContext } from "../../contexts/LessonContext";
import LessontextItem from "./LessontextItem";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { filenameParser } from "../../utils/filename-parser";
import { Item, Message } from "semantic-ui-react";

const LessontextItems = () => {
  const [usedLanguages, setUsedLanguages] = useState<string[]>([]);

  const { fetchFileList, setFiles, state: lessonState } = useLessonContext();
  const { lessonId } = useParams() as any;

  const { lessonTitle, lessonSlug } = lessonState.lesson;

  useEffect(() => {
    const fetchData = async () => {
      const fileList = await fetchFileList();
      setUsedLanguages(
        fileList
          .map(filenameParser)
          .filter(({ isReadme, language }) => !isReadme && language.length > 0)
          .map(({ language }) => language),
      );
    };

    fetchData();
  }, [lessonState.files]);

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
      {usedLanguages.length > 0 ? (
        [...usedLanguages]
          .sort((i, j) => j.localeCompare(i))
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
