import "./editordatamodal.scss";
import { Dispatch, SetStateAction, SyntheticEvent, FC, useEffect, useRef } from "react";
import { languageOption } from "../../frontpage/settings/newLessonOptions";
import { useParams } from "react-router";
import { useState } from "react";
import { Button, Header, Input, Modal, Popup } from "semantic-ui-react";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO";
import { useFileContext } from "../../../contexts/FileContext";
import { shallowEqual } from "fast-equals";
import FieldError from "../../shared/FieldError";

interface EditorDatamodalProps {
  courseTitle: string;
  lessonTitle: string;
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
}

const EditorDatamodal: FC<EditorDatamodalProps> = ({
  courseTitle,
  lessonTitle,
  openSettings,
  setOpenSettings,
}) => {
  const { lang } = useParams<any>();
  const { state, saveFileHeader, setFileContextState } = useFileContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [saveError, setSaveError] = useState("");

  const prevData = useRef<any>(null);

  // useEffect(() => {
  //   if (state.headerData.author && state.headerData.title) {
  //     setFileContextState((s) => {
  //       return {
  //         ...s,
  //         headerData: {
  //           ...s.headerData,
  //           err: "",
  //         },
  //       };
  //     });
  //   }
  // }, [state.headerData.author, state.headerData.title]);

  useEffect(() => {
    prevData.current = { ...state };
  }, [openSettings]);

  const languageName = languageOption(lang ?? "nb").text;

  const changeHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    const { name, value } = data;

    setFileContextState((s) => {
      return {
        ...s,
        headerData: {
          ...s.headerData,
          [name]: value,
        },
      };
    });
  };

  // A text needs a title and an author; the dialog does not close or save without them.
  const isValid: boolean =
    typeof state.headerData.authorList === "object" &&
    !!state.headerData?.title?.trim() &&
    (!!state.headerData.author || state.headerData.authorList.length > 0);

  const onSubmit = async () => {
    if (!isValid) return;
    if (shallowEqual(state.headerData, prevData.current.headerData)) {
      return setOpenSettings(false);
    }
    // A failed save used to close the dialog as if it had worked, and the change was gone.
    setLoading(true);
    setSaveError("");
    const status = await saveFileHeader(state.headerData);
    setLoading(false);
    if (status === 200) setOpenSettings(false);
    else
      setSaveError(
        status === 409
          ? "Teksten er endret et annet sted. Last inn siden på nytt for å se den nyeste versjonen."
          : "Kunne ikke lagre. Prøv igjen.",
      );
  };

  return (
    <>
      <Popup
        content={"Endre data for oppgavetekst"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            basic
            style={{ height: "3rem", padding: "0 1em 0 1em", margin: "0" }}
            id="next"
            size="big"
            icon="address card"
            aria-label="Endre data for oppgavetekst"
            onClick={() => setOpenSettings(true)}
          />
        }
      />
      <Modal
        closeOnDimmerClick={isValid}
        onClose={() => {
          onSubmit();
        }}
        onOpen={() => setOpenSettings(true)}
        open={openSettings}
        size="large"
        dimmer="inverted"
        className="editor_modal"
      >
        <Modal.Header className="editor_modal">
          <Header as="h1">
            <span style={{ color: "grey", marginRight: "1ch" }}>{`Oppgave: `}</span>
            {lessonTitle}
            <Header.Subheader>{`Kurs: ${courseTitle}`}</Header.Subheader>
          </Header>
        </Modal.Header>
        <Modal.Content className="editor_modal">
          <Header as="h3" className="formLabel">
            {`${FORM_TEXT.TITLE.heading} på ${languageName.toLocaleLowerCase("nb")}`}
            <span className="labelTextSpan">(obligatorisk)</span>
          </Header>

          <Input
            autoFocus
            autoComplete="off"
            type="text"
            name="title"
            placeholder={FORM_TEXT.TITLE.placeholder}
            value={state.headerData.title}
            onChange={changeHandler}
            fluid
          />
          <FieldError>{!state.headerData.title?.trim() && "Skriv en tittel."}</FieldError>
        </Modal.Content>
        <Modal.Content className="editor_modal">
          <MultiInput
            changeHandler={changeHandler}
            inputArray={state.headerData.authorList ?? []}
            inputValue={state.headerData.author}
            name="author"
            placeholder={FORM_TEXT.AUTHOR.placeholder}
            required="(obligatorisk)"
            title={FORM_TEXT.AUTHOR.heading}
          />
          <FieldError>
            {typeof state.headerData.authorList === "object" &&
              !(state.headerData.author || state.headerData!.authorList!.length > 0) &&
              "Legg til minst én forfatter."}
          </FieldError>
        </Modal.Content>
        <Modal.Content className="editor_modal">
          <MultiInput
            changeHandler={changeHandler}
            inputArray={state.headerData.translatorList ?? []}
            inputValue={state.headerData?.translator ?? ""}
            name="translator"
            placeholder={FORM_TEXT.TRANSLATOR.placeholder}
            required=""
            title={FORM_TEXT.TRANSLATOR.heading}
          />
        </Modal.Content>

        <Modal.Actions className="editor_modal">
          {saveError && (
            <div style={{ textAlign: "left", marginBottom: "0.75em" }}>
              <FieldError>{saveError}</FieldError>
            </div>
          )}
          <Button
            disabled={!isValid}
            onClick={onSubmit}
            content="OK"
            positive
            labelPosition="right"
            icon="checkmark"
            loading={loading}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditorDatamodal;
