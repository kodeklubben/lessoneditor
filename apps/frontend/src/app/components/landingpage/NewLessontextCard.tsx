import React, { useEffect, useState } from "react";
import { Button, Card, Divider, Header, Icon } from "semantic-ui-react";
import { useLessonContext } from "../../contexts/LessonContext";
import { LANGUAGEOPTIONS, languageOption } from "../frontpage/settings/newLessonOptions";
import { filenameParser } from "../../utils/filename-parser";
import NewLessontextModal from "./NewLessontextModal";
import "./lessoncard.scss";

const NewLessontextCard = () => {
  const [openNewLessontextModal, setOpenNewLessontextModal] = useState(false);
  const [unusedLessontextLanguages, setUnusedLessontextLanguages] = useState<any[]>([]);
  const [unusedTeacherguideLanguages, setUnusedTeacherguideLanguages] = useState<any[]>([]);
  const [usedLessontextLanguages, setUsedLessontextLanguages] = useState<any[]>([]);
  const [usedTeacherguideLanguages, setUsedTeacherguideLanguages] = useState<any[]>([]);

  const { fetchFileList, state: lessonState } = useLessonContext();

  useEffect(() => {
    const fetchData = async () => {
      const fileList = await fetchFileList();
      let unusedTextLang = [...LANGUAGEOPTIONS];
      let unusedGuideLang = [...LANGUAGEOPTIONS];
      const usedText: any[] = [];
      const usedGuide: any[] = [];

      fileList.forEach((filename) => {
        const { isReadme, language } = filenameParser(filename);

        if (!language) return;

        // The option is only for display; the file's own code (also an old "sam") is kept as value.
        const usedLangOption = { ...languageOption(language), key: language, value: language };
        const canonical = languageOption(language).value;
        if (isReadme) {
          usedGuide.push(usedLangOption);
          unusedGuideLang = unusedGuideLang.filter((lang) => lang.value !== canonical);
        } else {
          usedText.push(usedLangOption);
          unusedTextLang = unusedTextLang.filter((lang) => lang.value !== canonical);
        }
      });

      setUsedLessontextLanguages(usedText);
      setUsedTeacherguideLanguages(usedGuide);
      setUnusedLessontextLanguages(unusedTextLang);
      setUnusedTeacherguideLanguages(unusedGuideLang);
    };

    fetchData();
  }, []);

  const { lessonId } = lessonState.lesson;

  return (
    <>
      {openNewLessontextModal && (
        <NewLessontextModal
          openNewLessontextModal={openNewLessontextModal}
          setOpenNewLessontextModal={setOpenNewLessontextModal}
          unusedLessontextLanguages={unusedLessontextLanguages}
          unusedTeacherguideLanguages={unusedTeacherguideLanguages}
          usedLessontextLanguages={usedLessontextLanguages}
          usedTeacherguideLanguages={usedTeacherguideLanguages}
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
