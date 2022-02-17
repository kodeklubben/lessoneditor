import { Button, Modal, Header, Dropdown, Radio } from "semantic-ui-react";
import { FC, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import { filenameParser } from "../../utils/filename-parser";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { useLessonContext } from "../../contexts/LessonContext";
import * as yaml from "js-yaml";
import { HeaderData, NewFileDTO, paths } from "@lessoneditor/contracts";
import { lessonGuideDefaultText } from "./settingsFiles/defaultTexts";
import axios from "axios";
import insertMetaDataInTeacherGuide from "./utils/insertMetaDataInTeacherGuide";

const NewLessontextModal: FC<any> = ({ openNewLessontextModal, setOpenNewLessontextModal }) => {
  const [, updateState] = useState<any>();

  const [textMode, setTextMode] = useState<String>("lessontext");
  const [loading, setLoading] = useState<boolean>(false);
  const [unusedLessontextLanguages, setUnusedLessontextLanguages] = useState<Record<string, any>[]>(
    []
  );
  const [unusedTeacherguideLanguages, setUnusedTeacherguideLanguages] = useState<
    Record<string, any>[]
  >([]);
  const [lessontextLang, setLessontextLang] = useState<string>("-1");
  const [teacherguideLang, setTeacherguideLang] = useState<string>("-1");

  const [unusedLanguages, setUnusedLanguages] = useState<Record<string, any>[]>([]);

  const navigate = useNavigate();
  const { fetchFileList, yml, setFiles, state: lessonState } = useLessonContext();
  const { state } = useUserContext();
  const { lessonTitle, lessonSlug, lessonId } = lessonState.lesson;
  const forceUpdate = useCallback(() => updateState({}), [textMode]);

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
      setUnusedLanguages(tempUnusedLang);
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

  const onSubmit = async () => {
    let target;
    if (textMode === "lessontext") {
      const header: HeaderData = {
        title: lessonTitle,
        author: state.user!.name || state.user!.username,
        authorList: [],
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
        const newLessonFileRes = await axios.post<number>(
          paths.LESSON_FILES.replace(":lessonId", lessonId.toString()),
          newLessonFileDTO
        );
      } catch (e) {
        console.error(e);
      }

      target = ["/editor", lessonId, lessonSlug, lessontextLang].join("/");
    } else {
      const header: HeaderData = {
        title: lessonTitle,
        author: state.user!.name || state.user!.username,
        authorList: [],
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
        const newLessonFileRes = await axios.post<number>(
          paths.LESSON_FILES.replace(":lessonId", lessonId.toString()),
          newFileDTO
        );
      } catch (e) {
        console.error(e);
      }

      target = ["/editor", lessonId, "README", teacherguideLang].join("/");
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
    if (s === "lessontext") {
      setUnusedLanguages(unusedLessontextLanguages.sort());
      forceUpdate();
    } else {
      setUnusedLanguages(unusedTeacherguideLanguages.sort());
      forceUpdate();
    }
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
          <Modal.Content style={{ display: "flex" }}>
            <Modal.Description style={{ display: "flex" }}>
              <Header style={{ marginRight: "1em" }}>Velg type tekst: </Header>

              <Radio
                label="Oppgavetekst"
                name="lessontext"
                value="lessontext"
                checked={textMode === "lessontext"}
                onChange={() => onRadiobuttonChange("lessontext")}
                style={{ marginRight: "1em" }}
                defaultChecked
              />
              <Radio
                label="Lærerveiledning"
                name="teacherguide"
                value="teacherguide"
                checked={textMode === "teacherguide"}
                onChange={() => onRadiobuttonChange("teacherguide")}
              />
            </Modal.Description>
            <Modal.Description style={{ display: "flex" }}>
              <Header style={{ marginRight: "1em" }}>Velg språk: </Header>

              {textMode === "lessontext" && unusedLanguages.length > 0 ? (
                <Dropdown
                  name="language"
                  defaultValue={unusedLanguages[0].value}
                  onChange={onChange}
                  options={unusedLanguages}
                />
              ) : textMode === "teacherguide" && unusedLanguages.length > 0 ? (
                <Dropdown
                  name="language"
                  defaultValue={unusedLanguages[0].value}
                  onChange={onChange}
                  options={unusedLanguages}
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
                Nei
              </Button>
              <Button
                content="Ja"
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
