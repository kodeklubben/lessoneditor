import { Button, Modal, Header, Dropdown, Radio, Message } from "semantic-ui-react";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserContext } from "../../contexts/UserContext";
import { useLessonContext } from "../../contexts/LessonContext";
import { paths, stringifyLessonMarkdown } from "@lessoneditor/contracts";
import { lessonGuideDefaultText } from "./settingsFiles/defaultTexts";
import axios from "axios";
import insertMetaDataInTeacherGuide from "./utils/insertMetaDataInTeacherGuide";
import { copyForTranslation, copySourceLanguage } from "./utils/copyForTranslation";

type TextMode = "lessontext" | "teacherguide";
type LanguageOption = { key: string; text: string; value: string };

/** <slug> / <slug>_<lang> for lesson texts, README / README_<lang> for teacher guides. */
export const textFilename = (textMode: TextMode, lang: string, slug: string) => {
  const base = textMode === "teacherguide" ? "README" : slug;
  return lang === "nb" ? base : `${base}_${lang}`;
};

const prepareHeader = (lessonTitle: string, name: string, username: string, language: string) => ({
  title: lessonTitle,
  author: "",
  authorList: [name || username],
  language,
  translator: "",
  translatorList: [],
});

/** The server's own message for 4xx/502 (e.g. limit reached), otherwise a general one. */
const errorMessage = (error: unknown, fallback: string) => {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })
    ?.response;
  return typeof response?.data?.message === "string" && response.status !== 500
    ? response.data.message
    : fallback;
};

interface Props {
  openNewLessontextModal: boolean;
  setOpenNewLessontextModal: (open: boolean) => void;
  unusedLessontextLanguages: LanguageOption[];
  unusedTeacherguideLanguages: LanguageOption[];
  usedLessontextLanguages: LanguageOption[];
  usedTeacherguideLanguages: LanguageOption[];
}

const NewLessontextModal: FC<Props> = ({
  openNewLessontextModal,
  setOpenNewLessontextModal,
  unusedLessontextLanguages,
  unusedTeacherguideLanguages,
  usedLessontextLanguages,
  usedTeacherguideLanguages,
}) => {
  const [textMode, setTextMode] = useState<TextMode>(
    unusedLessontextLanguages.length > 0 ? "lessontext" : "teacherguide",
  );
  const unused =
    textMode === "lessontext" ? unusedLessontextLanguages : unusedTeacherguideLanguages;
  const used = textMode === "lessontext" ? usedLessontextLanguages : usedTeacherguideLanguages;

  const [language, setLanguage] = useState<string>(unused[0]?.value ?? "");
  const [translate, setTranslate] = useState<boolean>(false);
  const [translateFrom, setTranslateFrom] = useState<string>(used[0]?.value ?? "");
  const [translationEnabled, setTranslationEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const { yml, state: lessonState } = useLessonContext();
  const { state } = useUserContext();
  const { lessonTitle, lessonSlug, lessonId } = lessonState.lesson;

  // Without a configured EU provider the server says no, and the option is not shown.
  useEffect(() => {
    let active = true;
    axios
      .get<{ enabled: boolean }>(paths.TRANSLATE_STATUS)
      .then(({ data }) => active && setTranslationEnabled(data?.enabled === true))
      .catch(() => active && setTranslationEnabled(false));
    return () => {
      active = false;
    };
  }, []);

  // Each kind of text has its own lists, so the choices follow the selected kind.
  useEffect(() => {
    setLanguage(unused[0]?.value ?? "");
    setTranslateFrom(used[0]?.value ?? "");
    setCopyChoice(undefined);
    setError("");
  }, [textMode]);

  const canTranslate = translationEnabled && used.length > 0 && unused.length > 0;
  const translating = translate && canTranslate;
  // Without machine translation, a new language starts as a copy of an existing text (V6). Which
  // one is the teacher's choice (9c), bokmål first; "" starts from the template.
  const [copyChoice, setCopyChoice] = useState<string | undefined>(undefined);
  const copyFrom = translating ? undefined : (copyChoice ?? copySourceLanguage(used)) || undefined;
  const copyFromName = used.find((option) => option.value === copyFrom)?.text;
  const copyOptions = [
    ...[...used].sort((a, b) => (a.value === "nb" ? -1 : b.value === "nb" ? 1 : 0)),
    { key: "template", value: "", text: "Malen (en tom oppgave)" },
  ];

  const openEditor = (lang: string) =>
    navigate(
      ["/editor", lessonId, textMode === "lessontext" ? lessonSlug : "README", `${lang}?init`].join(
        "/",
      ),
    );

  const onSubmit = async () => {
    if (!language) return;
    setLoading(true);
    setError("");
    try {
      if (translating) {
        await axios.post(paths.LESSON_TRANSLATE.replace(":lessonId", String(lessonId)), {
          source: textFilename(textMode, translateFrom, lessonSlug),
          language,
        });
      } else {
        const { name = "", username = "" } = state.user || {};
        let content: string;
        if (copyFrom) {
          const source = await axios.get<{ content: string }>(
            paths.LESSON_FILE.replace(":lessonId", String(lessonId)).replace(
              ":filename",
              encodeURIComponent(textFilename(textMode, copyFrom, lessonSlug)),
            ),
          );
          content = copyForTranslation(source.data.content, language, name || username || "");
        } else {
          const text =
            textMode === "lessontext"
              ? lessonGuideDefaultText[language]
              : insertMetaDataInTeacherGuide(yml, language);
          content = stringifyLessonMarkdown(
            prepareHeader(lessonTitle, name ?? "", username ?? "", language),
            text,
          );
        }
        await axios.post(paths.LESSON_FILES.replace(":lessonId", String(lessonId)), {
          filename: textFilename(textMode, language, lessonSlug),
          ext: ".md",
          content,
        });
      }
      openEditor(language);
    } catch (e) {
      console.error(e);
      setError(
        errorMessage(
          e,
          translating
            ? "Oversettelsen feilet, og ingen fil ble laget. Prøv igjen senere."
            : "Kunne ikke lage tekstfilen. Prøv igjen.",
        ),
      );
      setLoading(false);
    }
  };

  const onClose = () => {
    if (!loading) setOpenNewLessontextModal(false);
  };

  return (
    <Modal
      onClose={onClose}
      onOpen={() => setOpenNewLessontextModal(true)}
      open={openNewLessontextModal}
      closeOnDimmerClick={!loading}
      closeOnEscape={!loading}
      dimmer={"inverted"}
    >
      <Modal.Header>Opprett ny tekstfil</Modal.Header>
      <Modal.Content style={{ display: "flex", flexFlow: "row wrap", gap: "1em" }}>
        <Header as="h3" id="new-text-kind" style={{ margin: 0 }}>
          Velg type tekst:
        </Header>
        <div
          role="radiogroup"
          aria-labelledby="new-text-kind"
          style={{ display: "flex", gap: "1em" }}
        >
          <Radio
            label="Oppgavetekst"
            name="textMode"
            value="lessontext"
            checked={textMode === "lessontext"}
            onChange={() => setTextMode("lessontext")}
            disabled={unusedLessontextLanguages.length <= 0 || loading}
          />
          <Radio
            label="Lærerveiledning"
            name="textMode"
            value="teacherguide"
            checked={textMode === "teacherguide"}
            onChange={() => setTextMode("teacherguide")}
            disabled={unusedTeacherguideLanguages.length <= 0 || loading}
          />
        </div>
      </Modal.Content>

      {canTranslate && (
        <Modal.Content style={{ display: "flex", flexFlow: "row wrap", gap: "1em" }}>
          <Header as="h3" id="new-text-translate" style={{ margin: 0 }}>
            Lag teksten ved å oversette en eksisterende?
          </Header>
          <div
            role="radiogroup"
            aria-labelledby="new-text-translate"
            style={{ display: "flex", gap: "1em" }}
          >
            <Radio
              label="Ja, maskinoversett"
              name="translate"
              checked={translate}
              onChange={() => setTranslate(true)}
              disabled={loading}
            />
            <Radio
              label="Nei, start fra malen"
              name="translate"
              checked={!translate}
              onChange={() => setTranslate(false)}
              disabled={loading}
            />
          </div>
        </Modal.Content>
      )}

      <Modal.Content
        style={{ display: "flex", flexFlow: "row wrap", alignItems: "center", gap: "1em" }}
      >
        {/* The new text's language first, then what it starts from (it confused the other way). */}
        <label htmlFor="new-text-language" style={{ fontWeight: 700 }}>
          {translating ? "Oversett til:" : "Ny tekst på:"}
        </label>
        <Dropdown
          id="new-text-language"
          selection
          value={language}
          onChange={(_e, data) => setLanguage(String(data.value))}
          options={unused}
          disabled={loading || unused.length === 0}
        />
        {translating && (
          <>
            <label htmlFor="translate-from" style={{ fontWeight: 700 }}>
              Oversett fra:
            </label>
            <Dropdown
              id="translate-from"
              selection
              value={translateFrom}
              onChange={(_e, data) => setTranslateFrom(String(data.value))}
              options={used}
              disabled={loading}
            />
          </>
        )}
        {!translating && used.length > 0 && (
          <>
            <label htmlFor="copy-from" style={{ fontWeight: 700 }}>
              Start fra:
            </label>
            <Dropdown
              id="copy-from"
              selection
              value={copyFrom ?? ""}
              onChange={(_e, data) => setCopyChoice(String(data.value))}
              options={copyOptions}
              disabled={loading}
            />
          </>
        )}
      </Modal.Content>

      {copyFrom && copyFromName && unused.length > 0 && (
        <Modal.Content>
          <Message info size="small">
            Den nye teksten på{" "}
            {String(unused.find((option) => option.value === language)?.text ?? "").toLowerCase()}{" "}
            starter som en kopi av teksten på {copyFromName.toLowerCase()}, med bilder og kode.
            Editoren minner deg på å oversette den, også tittelen.
          </Message>
        </Modal.Content>
      )}

      {translating && (
        <Modal.Content>
          <Message info size="small">
            Teksten sendes uten tittel, navn, e-post, kode og lenker til en oversettelsestjeneste i
            EU. Resultatet merkes som maskinoversatt med deg som oversetter. Les gjennom og rett det
            før du sender inn, og husk å oversette tittelen. Det kan ta et minutt.
          </Message>
        </Modal.Content>
      )}

      {error && (
        <Modal.Content>
          <Message negative role="alert">
            {error}
          </Message>
        </Modal.Content>
      )}

      <Modal.Actions>
        <Button disabled={loading} basic onClick={onClose}>
          Avbryt
        </Button>
        <Button
          content={translating ? "Oversett" : "Fortsett"}
          labelPosition="right"
          icon="checkmark"
          onClick={onSubmit}
          positive
          loading={loading}
          disabled={loading || !language || (translating && !translateFrom)}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default NewLessontextModal;
