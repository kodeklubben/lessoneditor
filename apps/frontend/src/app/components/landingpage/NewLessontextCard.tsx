import React, { useEffect, useState } from "react";
import { Button, Card, Divider, Header, Icon } from "semantic-ui-react";
import { useLessonContext } from "../../contexts/LessonContext";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { filenameParser } from "../../utils/filename-parser";
import NewLessontextModal from "./NewLessontextModal";
import "./lessoncard.scss";

const NewLessontextCard = () => {
  const [openNewLessontextModal, setOpenNewLessontextModal] = useState(false);
  const [unusedLessontextLanguages, setUnusedLessontextLanguages] = useState<any[]>([]);
  const [unusedTeacherguideLanguages, setUnusedTeacherguideLanguages] = useState<any[]>([]);
  const [usedLessontextLanguages, setUsedLessontextLanguages] = useState<any[]>([]);
  const [usedTeacherguideLanguages, setUsedTeacherguideLanguages] = useState<any[]>([]);
  const [translateFromLang, setTranslateFromLang] = useState<string>("-1");
  const [translateToLang, setTranslateToLang] = useState<string>("-1");

  const [lessontextLang, setLessontextLang] = useState("-1");
  const [teacherguideLang, setTeacherguideLang] = useState("-1");

  const { fetchFileList, state: lessonState } = useLessonContext();

  useEffect(() => {
    const fetchData = async () => {
      const fileList = await fetchFileList();
      let unusedTextLang = [...LANGUAGEOPTIONS];
      let unusedGuideLang = [...LANGUAGEOPTIONS];

      fileList.forEach((filename) => {
        const { isReadme, language } = filenameParser(filename);

        if (!language) return;

        const usedLangOption = LANGUAGEOPTIONS.find((item) => item.value === language);
        if (usedLangOption) {
          if (isReadme) {
            setUsedTeacherguideLanguages((langs) => {
              const langSet = new Set(langs);
              langSet.add(usedLangOption);
              return Array.from(langSet);
            });
            unusedGuideLang = unusedGuideLang.filter((lang) => lang.value !== language);
          } else {
            setUsedLessontextLanguages((langs) => {
              const langSet = new Set(langs);
              langSet.add(usedLangOption);
              return Array.from(langSet);
            });
            unusedTextLang = unusedTextLang.filter((lang) => lang.value !== language);
          }
        }
      });

      setUnusedLessontextLanguages(unusedTextLang);
      setUnusedTeacherguideLanguages(unusedGuideLang);
      setLessontextLang(unusedTextLang[0]?.value || "-1");
      setTeacherguideLang(unusedGuideLang[0]?.value || "-1");
    };

    fetchData();
  }, [translateFromLang, translateToLang]);

  const { lessonId } = lessonState.lesson;

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
          unusedLessontextLanguages={unusedLessontextLanguages}
          unusedTeacherguideLanguages={unusedTeacherguideLanguages}
          usedLessontextLanguages={usedLessontextLanguages}
          usedTeacherguideLanguages={usedTeacherguideLanguages}
          translateFromLang={translateFromLang}
          setTranslateFromLang={setTranslateFromLang}
          translateToLang={translateToLang}
          setTranslateToLang={setTranslateToLang}
          lessonId={lessonId}
        />
      )}

      {(unusedLessontextLanguages.length > 0 || unusedTeacherguideLanguages.length > 0) && (
        <div>
          <Header>Opprett ny tekstfil</Header>
          <Card className="new-lesson_card">
            <div className="new-lesson_card__content">
              <div
                className="new-lesson_card__image"
                onClick={() => setOpenNewLessontextModal(true)}
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
      )}
    </>
  );
};

export default NewLessontextCard;
