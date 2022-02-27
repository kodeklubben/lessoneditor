import { Button, Modal, Header, Dropdown, Radio } from "semantic-ui-react";
import { FC, SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useUserContext } from "../../contexts/UserContext";

import { useLessonContext } from "../../contexts/LessonContext";
import * as yaml from "js-yaml";
import { HeaderData, NewFileDTO, paths } from "@lessoneditor/contracts";
import { lessonGuideDefaultText } from "./settingsFiles/defaultTexts";
import axios from "axios";
import insertMetaDataInTeacherGuide from "./utils/insertMetaDataInTeacherGuide";

const NewLessontextModal: FC<any> = ({
  openNewLessontextModal,
  setOpenNewLessontextModal,
  lessontextLang,
  teacherguideLang,
  setLessontextLang,
  setTeacherguideLang,
  unusedLessontextLanguages,
  unusedTeacherguideLanguages,
}) => {
  const [textMode, setTextMode] = useState<String>(
    unusedLessontextLanguages.length > 0 ? "lessontext" : "teacherguide"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { yml, state: lessonState } = useLessonContext();
  const { state } = useUserContext();
  const { lessonTitle, lessonSlug, lessonId } = lessonState.lesson;

  const onSubmit = async () => {
    let target;
    if (textMode === "lessontext") {
      const header: HeaderData = {
        title: lessonTitle,
        author: "",
        authorList: [state.user!.name || state.user!.username],
        language: lessontextLang,
        translator: "",
        translatorList: [],
      };
      try {
        const rawBody =
          "---\n" + yaml.dump(header) + "---\n" + lessonGuideDefaultText[lessontextLang];
        const filename = lessontextLang === "nb" ? lessonSlug : `${lessonSlug}_${lessontextLang}`;
        const newLessonFileDTO: NewFileDTO = {
          filename,
          ext: ".md",
          content: rawBody,
        };
        const _newLessonFileRes = await axios.post<number>(
          paths.LESSON_FILES.replace(":lessonId", lessonId.toString()),
          newLessonFileDTO
        );
      } catch (e) {
        console.error(e);
      }

      target = ["/editor", lessonId, lessonSlug, `${lessontextLang}?init`].join("/");
    } else {
      const header: HeaderData = {
        title: lessonTitle,
        author: "",
        authorList: [state.user!.name || state.user!.username],
        language: teacherguideLang,
        translator: "",
        translatorList: [],
      };
      try {
        const lessonText = insertMetaDataInTeacherGuide(yml, teacherguideLang);
        const rawBody = "---\n" + yaml.dump(header) + "---\n" + lessonText;

        const filename = teacherguideLang === "nb" ? "README" : `README_${teacherguideLang}`;
        const newFileDTO: NewFileDTO = {
          filename,
          ext: ".md",
          content: rawBody,
        };
        const _newLessonFileRes = await axios.post<number>(
          paths.LESSON_FILES.replace(":lessonId", lessonId.toString()),
          newFileDTO
        );
      } catch (e) {
        console.error(e);
      }

      target = ["/editor", lessonId, "README", `${teacherguideLang}?init`].join("/");
    }
    navigate(target);
  };

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    if (textMode === "lessontext") {
      setLessontextLang(value);
    } else {
      setTeacherguideLang(value);
    }
  };

  const onRadiobuttonChange = (s: String) => {
    setTextMode(s);
  };

  const onClose = () => {
    setOpenNewLessontextModal(false);
  };

  return (
    <>
      <Modal
        onClose={() => onClose()}
        onOpen={() => setOpenNewLessontextModal(true)}
        open={openNewLessontextModal}
        closeOnDimmerClick={!loading}
        dimmer={"inverted"}
      >
        <>
          <Modal.Header>Opprett ny tekstfil</Modal.Header>
          <Modal.Content style={{ display: "flex", flexFlow: "row wrap" }}>
            <Modal.Description style={{ display: "flex", flexFlow: "row wrap" }}>
              <Header style={{ marginRight: "1em" }}>Velg type tekst: </Header>
              <Radio
                label="Oppgavetekst"
                name="lessontext"
                value="lessontext"
                checked={textMode === "lessontext"}
                onChange={() => onRadiobuttonChange("lessontext")}
                style={{
                  marginRight: "1em",
                }}
                disabled={unusedLessontextLanguages <= 0}
              />
              <Radio
                label="Lærerveiledning"
                name="teacherguide"
                value="teacherguide"
                checked={textMode === "teacherguide"}
                onChange={() => onRadiobuttonChange("teacherguide")}
                disabled={unusedTeacherguideLanguages.length <= 0}
              />
            </Modal.Description>
            <Modal.Description style={{ display: "flex", flexFlow: "row wrap" }}>
              <Header style={{ marginRight: "1em" }}>Velg språk: </Header>

              {textMode === "lessontext" && unusedLessontextLanguages.length > 0 ? (
                <Dropdown
                  name="language"
                  value={lessontextLang}
                  onChange={onChange}
                  options={unusedLessontextLanguages}
                />
              ) : textMode === "teacherguide" && unusedTeacherguideLanguages.length > 0 ? (
                <Dropdown
                  name="language"
                  value={teacherguideLang}
                  onChange={onChange}
                  options={unusedTeacherguideLanguages}
                />
              ) : (
                ""
              )}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <>
              <Button
                disabled={loading}
                color="black"
                onClick={() => setOpenNewLessontextModal(false)}
              >
                Avbryt
              </Button>
              <Button
                content="Fortsett"
                labelPosition="right"
                icon="checkmark"
                onClick={() => onSubmit()}
                positive
                loading={loading}
              />
            </>
          </Modal.Actions>
        </>
      </Modal>
    </>
  );
};

export default NewLessontextModal;
