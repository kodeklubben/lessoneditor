import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useLessonContext } from "../../contexts/LessonContext";
import LessontextItem from "./LessontextItem";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { filenameParser } from "../../utils/filename-parser";
import { Item, Message } from "semantic-ui-react";

const LessontextItems = () => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [usedLanguages, setUsedLanguages] = useState<string[]>([]);
  const [unusedLanguages, setUnusedLanguages] = useState<Record<string, any>[]>([]);
  const [lang, setLang] = useState<string>("-1");

  const { fetchFileList, setFiles, state: lessonState, loading } = useLessonContext();
  const { lessonId } = useParams() as any;

  const { lessonTitle, lessonSlug } = lessonState.lesson;

  useEffect(() => {
    const fetchData = async () => {
      const fileList = await fetchFileList();
      setFileList(fileList);
      const tempUsedLang: string[] = [];
      const tempUnusedLang: Record<string, string>[] = [...LANGUAGEOPTIONS];
      fileList.forEach((filename: string) => {
        const { isReadme, language } = filenameParser(filename);

        if (!isReadme && language.length > 0) {
          tempUsedLang.push(language);
          const index = tempUnusedLang.findIndex((item) => item.value === language);
          tempUnusedLang.splice(index, 1);
        }
      });
      setUsedLanguages(tempUsedLang);
      setUnusedLanguages(tempUnusedLang);
      tempUnusedLang.length > 0 ? setLang(tempUnusedLang[0].value) : setLang("-1");
    };

    fetchData();
  }, [lessonState.files]);

  const removeMD: (language: string, file: string) => void = async (
    language: string,
    file: string
  ) => {
    const filename = language === "nb" ? file : `${file}_${language}`;
    const ext = "md";

    try {
      const files = await fetchFileList();
      await axios.delete(
        paths.LESSON_FILE_DELETE.replace(":lessonId", lessonId.toString())
          .replace(":filename", filename)
          .replace(":ext", ext)
      );

      const index = files.findIndex((item: string) => item === filename);
      const newList = files.splice(index, 1);
      setFiles(newList);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Item.Group divided>
      {usedLanguages.length > 0 ? (
        usedLanguages
          .sort((i, j) => {
            return j.localeCompare(i);
          })!
          .map((language: string) => {
            return (
              <LessontextItem
                key={language}
                content={"Oppgavetekst"}
                language={language}
                lessonId={lessonId}
                lessonSlug={lessonSlug}
                lessonTitle={lessonTitle}
                removeMD={removeMD}
              />
            );
          })
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
