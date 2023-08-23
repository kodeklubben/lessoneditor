import { Button, Modal, Header, Dropdown, Radio } from "semantic-ui-react";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import { useLessonContext } from "../../contexts/LessonContext";
import * as yaml from "js-yaml";
import { FileDTO, paths } from "@lessoneditor/contracts";
import { lessonGuideDefaultText } from "./settingsFiles/defaultTexts";
import axios from "axios";
import insertMetaDataInTeacherGuide from "./utils/insertMetaDataInTeacherGuide";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { chatGPT } from "./utils/chatGPT";

const separator = "---\n";

type TextMode = "lessontext" | "teacherguide";

interface FilenameBuilders {
  lessontext: (slug: string, lang: string) => string;
  teacherguide: (lang: string) => string;
}

const filenames: FilenameBuilders = {
  lessontext: (lang: string, slug: string) => (lang === "nb" ? slug : `${slug}_${lang}`),
  teacherguide: (lang: string) => (lang === "nb" ? "README" : `README_${lang}`),
};

const replaceAPIPath = (lessonId: string, filename: string) =>
  paths.LESSON_FILE.replace(":lessonId", String(lessonId)).replace(":filename", filename);

const getFilename = (textMode: TextMode, lang: string, slug?: string) => {
  if (textMode === "teacherguide") return filenames[textMode](lang);

  return filenames[textMode](lang, slug || "");
};

const prepareHeader = (lessonTitle: string, name: string, username: string, language: string) => ({
  title: lessonTitle,
  author: "",
  authorList: [name || username],
  language,
  translator: "",
  translatorList: [],
});

const NewLessontextModal: FC<any> = ({
  openNewLessontextModal,
  setOpenNewLessontextModal,
  lessontextLang,
  teacherguideLang,
  setLessontextLang,
  setTeacherguideLang,
  unusedLessontextLanguages,
  unusedTeacherguideLanguages,
  usedLessontextLanguages,
  usedTeacherguideLanguages,
  translateFromLang,
  setTranslateFromLang,
  translateToLang,
  setTranslateToLang,
}) => {
  const [textMode, setTextMode] = useState<TextMode>(
    unusedLessontextLanguages.length > 0 ? "lessontext" : "teacherguide"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [translateWithGPT, setTranslateWithGPT] = useState<boolean>(false);

  const navigate = useNavigate();
  const { yml, state: lessonState } = useLessonContext();
  const { state } = useUserContext();
  const { lessonTitle, lessonSlug, lessonId } = lessonState.lesson;

  useEffect(() => {
    if (textMode === "lessontext" && usedLessontextLanguages.length > 0) {
      setTranslateFromLang(usedLessontextLanguages[0].value);
    }
    if (textMode === "teacherguide" && usedTeacherguideLanguages.length > 0) {
      setTranslateFromLang(usedTeacherguideLanguages[0].value);
    }
  }, [textMode]);

  useEffect(() => {
    if (translateWithGPT && textMode === "lessontext") {
      setTranslateToLang(unusedLessontextLanguages[0].value);
    } else if (translateWithGPT && textMode === "teacherguide") {
      setTranslateToLang(unusedTeacherguideLanguages[0].value);
    } else {
      setTranslateToLang("-1");
    }
  }, [translateWithGPT]);

  const isTranslateFromLangEnabled =
    ["lessontext", "teacherguide"].includes(textMode) &&
    (textMode === "lessontext" ? usedLessontextLanguages : usedTeacherguideLanguages).length > 0;

  async function fetchLessonData() {
    try {
      setLoading(true);
      console.log({ lessonId, textMode, translateFromLang, lessonSlug });
      const filename = getFilename(textMode, translateFromLang, lessonSlug);
      console.log({ filename });
      const result = await axios.get<FileDTO<string>>(replaceAPIPath(String(lessonId), filename));
      const [_, header, body] = result.data.content.split(separator);
      return body;
    } catch (error) {
      return error;
    }
  }

  const translateLessonText = async () => {
    const lessonText = await fetchLessonData();
    const lang = LANGUAGEOPTIONS.find((item) => item.value === translateToLang);

    const packageForGPT = {
      conversationHistory: [
        {
          role: "system",
          content:
            "Vær så snill å hjelpe meg å oversette tekster skrevet i markdown. Behold all markdownsyntax,og kodeblokker, og oversett bare teksten.",
        },
        {
          role: "user",
          content: `Kan du oversette denne teksten til ${lang!.text}?
          

          
          ${lessonText}`,
        },
      ],
      chatGPTModel: "gpt-3.5-turbo-16k",
    };

    const response = await chatGPT(packageForGPT);
    return response.conversationHistory.pop().content;
  };

  const onSubmit = async () => {
    const { name = "", username = "" } = state.user || {};
    let target, language, lessonText;

    if (translateWithGPT) {
      lessonText = await translateLessonText();
      console.log({ lessonText });
      language = translateToLang;
    } else if (textMode === "lessontext") {
      lessonText = lessonGuideDefaultText[lessontextLang];
      language = lessontextLang;
    } else {
      lessonText = insertMetaDataInTeacherGuide(yml, teacherguideLang);
      language = teacherguideLang;
    }

    const header = prepareHeader(lessonTitle, name, username, language);

    const rawBody = `---\n${yaml.dump(header)}---\n${lessonText}`;
    const filename = getFilename(textMode, language, lessonSlug);
    const newFileDTO = {
      filename,
      ext: ".md",
      content: rawBody,
    };

    console.log({ newFileDTO, lessonId, textMode, language, lessonSlug });

    try {
      await axios.post<number>(
        paths.LESSON_FILES.replace(":lessonId", lessonId.toString()),
        newFileDTO
      );
    } catch (e) {
      console.error(e);
    }

    target = [
      "/editor",
      lessonId,
      textMode === "lessontext" ? lessonSlug : "README",
      `${language}?init`,
    ].join("/");

    navigate(target);
  };

  const onChange = (e: SyntheticEvent, { value }: Record<string, string>) => {
    if (textMode === "lessontext") {
      setLessontextLang(value);
    } else {
      setTeacherguideLang(value);
    }
  };

  const onRadiobuttonChange = (s: TextMode) => {
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
                disabled={unusedLessontextLanguages.length <= 0}
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
            {(!translateWithGPT || !isTranslateFromLangEnabled) && (
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
            )}
          </Modal.Content>
          {isTranslateFromLangEnabled && (
            <Modal.Content style={{ display: "flex", flexFlow: "row wrap" }}>
              <Modal.Description style={{ display: "flex", flexFlow: "row wrap" }}>
                <Header style={{ marginRight: "1em" }}>Oversette oppgave med chatGPT? </Header>
                <Radio
                  label="Ja"
                  name="translateWithGPT"
                  value="translateWithGPT"
                  checked={translateWithGPT}
                  onChange={() => setTranslateWithGPT(true)}
                  style={{
                    marginRight: "1em",
                  }}
                  disabled={unusedLessontextLanguages.length <= 0}
                />
                <Radio
                  label="Nei"
                  name="translateWithGPT"
                  value="translateWithGPT"
                  checked={!translateWithGPT}
                  onChange={() => setTranslateWithGPT(false)}
                  disabled={unusedTeacherguideLanguages.length <= 0}
                />
              </Modal.Description>
            </Modal.Content>
          )}
          {translateWithGPT && isTranslateFromLangEnabled && (
            <>
              <i style={{ paddingLeft: "1.5rem" }}>Merk: Oversetting kan ta lang tid</i>
              <Modal.Content style={{ display: "flex", flexFlow: "row wrap" }}>
                <Modal.Description style={{ display: "flex", flexFlow: "row wrap" }}>
                  <p style={{ marginRight: "1em", fontWeight: "700" }}>Oversett fra: </p>
                  {textMode === "lessontext" && unusedLessontextLanguages.length > 0 ? (
                    <Dropdown
                      name="translateFromLang"
                      value={translateFromLang}
                      onChange={(e: any, data: any) => {
                        const { value } = data;
                        setTranslateFromLang(value);
                      }}
                      options={usedLessontextLanguages}
                    />
                  ) : textMode === "teacherguide" && unusedTeacherguideLanguages.length > 0 ? (
                    <Dropdown
                      name="translateFromLang"
                      value={translateFromLang}
                      onChange={(e: any, data: any) => {
                        const { value } = data;
                        setTranslateFromLang;
                      }}
                      options={usedTeacherguideLanguages}
                    />
                  ) : (
                    ""
                  )}
                  <p style={{ margin: "0 1em", fontWeight: "700" }}>Oversett til: </p>
                  {textMode === "lessontext" && unusedLessontextLanguages.length > 0 ? (
                    <Dropdown
                      name="translateToLang"
                      value={translateToLang}
                      onChange={(e: any, data: any) => {
                        const { value } = data;
                        setTranslateToLang(value);
                      }}
                      options={unusedLessontextLanguages}
                    />
                  ) : textMode === "teacherguide" && unusedTeacherguideLanguages.length > 0 ? (
                    <Dropdown
                      name="translateToLang"
                      value={translateToLang}
                      onChange={(e: any, data: any) => {
                        const { value } = data;
                        setTranslateToLang(value);
                      }}
                      options={unusedTeacherguideLanguages}
                    />
                  ) : (
                    ""
                  )}
                </Modal.Description>
              </Modal.Content>
            </>
          )}
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
