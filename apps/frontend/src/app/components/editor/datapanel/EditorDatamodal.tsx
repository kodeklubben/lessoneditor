import "./editordatamodal.scss";
import { Dispatch, SetStateAction, SyntheticEvent, FC, useEffect, useRef } from "react";
import { LANGUAGEOPTIONS } from "../../frontpage/settings/newLessonOptions";
import { useParams } from "react-router";
import { useState } from "react";
import { Button, Header, Input, Modal, Popup } from "semantic-ui-react";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO";
import { useFileContext } from "../../../contexts/FileContext";
import { shallowEqual } from "fast-equals";

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

  const languageName = LANGUAGEOPTIONS.filter((item) => item.value === lang)[0].text;

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

  const onSubmit = async () => {
    if (shallowEqual(state.headerData, prevData.current.headerData)) {
      saveFileHeader(state.headerData);
      return setOpenSettings(false);
    }
    if (saveFileHeader) {
      try {
        setLoading(true);
        await saveFileHeader(state.headerData);
        setLoading(false);
        setOpenSettings(false);
      } catch (e) {
        console.error(e);
      }
    }
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
            onClick={() => setOpenSettings(true)}
          />
        }
      />
      <Modal
        closeOnDimmerClick={
          typeof state.headerData.authorList === "object" &&
          !!state.headerData?.title &&
          (!!state.headerData.author || state.headerData.authorList.length > 0)
        }
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
            <span style={{ color: "grey", marginRight: "1ch" }}>{`Prosjekttittel: `}</span>
            {lessonTitle}
            <Header.Subheader>{`Kurs: ${courseTitle}`}</Header.Subheader>
          </Header>
        </Modal.Header>
        <Modal.Content className="editor_modal">
          <Header as="h3" className="formLabel">
            {`${FORM_TEXT.TITLE.heading} på ${languageName}`}
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
          {!state.headerData.title ? (
            <p style={{ color: "red" }}>
              <i>Må ha tittel</i>
            </p>
          ) : (
            <p style={{ height: "1.35em" }}></p>
          )}
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
          {typeof state.headerData.authorList === "object" &&
          !(state.headerData.author || state.headerData!.authorList!.length > 0) ? (
            <p>
              <i style={{ color: "red" }}>Må ha forfatter</i>
            </p>
          ) : (
            <p style={{ height: "1.35em" }}></p>
          )}
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
          {/* <Button
            disabled={
              !state.headerData?.title ||
              (!state.headerData.author && state.headerData.authorList.length === 0)
            }
            color={
              state.headerData?.title &&
              (state.headerData.author || state.headerData.authorList.length > 0)
                ? "black"
                : "grey"
            }
            onClick={onCancel}
            content="Avbryt"
          /> */}
          <Button
            disabled={
              typeof state.headerData.authorList === "object" &&
              !(state.headerData.author || state.headerData!.authorList!.length > 0)
            }
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
