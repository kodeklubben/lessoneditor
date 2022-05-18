import "./lessoncard.scss";
import React, { useState, useEffect } from "react";
import { Card, Divider, Icon, Button, Header } from "semantic-ui-react";
import { filenameParser } from "../../utils/filename-parser";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { useLessonContext } from "../../contexts/LessonContext";
import NewLessontextModal from "./NewLessontextModal";

const NewLessontextCard = () => {
  const [openNewLessontextModal, setOpenNewLessontextModal] = useState(false);

  const [unusedLanguages, setUnusedLanguages] = useState<Record<string, any>[]>([]);
  const [unusedLessontextLanguages, setUnusedLessontextLanguages] = useState<Record<string, any>[]>(
    []
  );
  const [unusedTeacherguideLanguages, setUnusedTeacherguideLanguages] = useState<
    Record<string, any>[]
  >([]);

  const [lessontextLang, setLessontextLang] = useState<string>("-1");
  const [teacherguideLang, setTeacherguideLang] = useState<string>("-1");

  const { fetchFileList, state: lessonState } = useLessonContext();

  const { lessonId } = lessonState.lesson;

  useEffect(() => {
    const fetchData = async () => {
      const fileList = await fetchFileList();
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
      setUnusedLessontextLanguages(tempUnusedLang);

      tempUnusedLang.length > 0
        ? setLessontextLang(tempUnusedLang[0].value)
        : setLessontextLang("-1");
    };
    fetchData();
  }, [lessonState.files]);

  useEffect(() => {
    const fetchData = async () => {
      const fileList = await fetchFileList();
      const tempUsedLang: string[] = [];
      const tempUnusedLang: Record<string, string>[] = [...LANGUAGEOPTIONS];
      fileList.forEach((filename: string) => {
        const { isReadme, language } = filenameParser(filename);
        if (isReadme && language.length > 0) {
          tempUsedLang.push(language);
          const index = tempUnusedLang.findIndex((item) => item.value === language);
          tempUnusedLang.splice(index, 1);
        }
      });
      setUnusedTeacherguideLanguages(tempUnusedLang);

      tempUnusedLang.length > 0
        ? setTeacherguideLang(tempUnusedLang[0].value)
        : setTeacherguideLang("-1");
    };

    fetchData();
  }, [lessonState.files]);

  return (
    <>
      {openNewLessontextModal && (
        <NewLessontextModal
          openNewLessontextModal={openNewLessontextModal}
          setOpenNewLessontextModal={setOpenNewLessontextModal}
          lessontextLang={lessontextLang}
          teacherguideLang={teacherguideLang}
          setLessontextLang={setLessontextLang}
          setTeacherguideLang={setTeacherguideLang}
          setUnusedLanguages={setUnusedLanguages}
          unusedLessontextLanguages={unusedLessontextLanguages}
          unusedTeacherguideLanguages={unusedTeacherguideLanguages}
          lessonId={lessonId}
        />
      )}

      <div
        style={{
          display:
            unusedLessontextLanguages.length > 0 || unusedTeacherguideLanguages.length > 0
              ? "block"
              : "none",
        }}
      >
        <Header>Opprett ny tekstfil</Header>
        <Card className="new-lesson_card">
          <div className="new-lesson_card__content">
            <div
              className="new-lesson_card__image"
              onClick={() => setOpenNewLessontextModal(true)}
              style={{}}
            >
              <Icon color="grey" name="file text outline" size="huge" />
            </div>
          </div>

          <Divider />

          <Button
            onClick={() => setOpenNewLessontextModal(true)}
            content="Ny tekstfil "
            positive
            icon="plus"
            labelPosition="left"
          />
        </Card>
      </div>
    </>
  );
};

export default NewLessontextCard;
