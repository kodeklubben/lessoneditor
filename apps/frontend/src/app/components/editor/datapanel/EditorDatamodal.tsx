import "./editordatamodal.scss";
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Header, Input, Modal, Popup } from "semantic-ui-react";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO";
import { useFileContext } from "../../../contexts/FileContext";
import { filenameParser } from "../../../utils/filename-parser";
import { stat } from "fs/promises";

// @ts-ignore
const EditorDatamodal = ({ courseTitle, lessonTitle, setShowSpinner }) => {
  const history = useHistory();
  const { lessonId, file } = useParams<any>();
  const { state, saveFileHeader, setFileContextState } = useFileContext();
  const [open, setOpen] = useState<boolean>(false);


  const { language, languageName } = filenameParser(file);


  const changeHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    if (setFileContextState) {
      setFileContextState((s) => {
        return {
          ...s,
          headerData: {
            ...s.headerData,
            [name]: value
          }

        }
      })
      // setHeaderData((prevState) => ({ ...prevState, [name]: value }));
      // if (headerData?.author) {
      //   setHeaderData((prevState) => ({ ...prevState, err: "" }));
      // }
      // if (headerData?.title) {
      //   setHeaderData((prevState) => ({ ...prevState, err: "" }));
      // }
    }
  };

  const multiInputHandler = (
    object: { [s: string]: unknown } | ArrayLike<unknown>,
    name: any
  ) => {
    const key = Object.keys(object)[0];
    const value = Object.values(object)[0];
    if (setFileContextState) {
      setFileContextState((s) => {
        return {
          ...s,
          headerData: {
            ...s.headerData,
            [key]:value

          }
        }
      })
    }
  };

  const onSubmit = async () => {
    if (saveFileHeader) {
      setShowSpinner(true);
      await saveFileHeader(state.headerData);
      setShowSpinner(false);
      setOpen(false);
      history.push("/");
      history.replace(["editor", lessonId, file].join("/"));
    }
  };

  const onCancel = async () => {
    if (setFileContextState && state.headerData) {
      setFileContextState((s) => {
        return {
          ...s,
          headerData: state.headerData
        }
      })
      setOpen(false);
    }
  };

  return (
    <div>
      <Popup
        content={"Endre data for oppgavetekst"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            basic
            style={{ height: "2em", padding: "0 1em 0 1em", margin: "0" }}
            id="next"
            size="big"
            icon="address card"
            content="Oppgavedata"
            onClick={() => setOpen(true)}
          />
        }
      />
      <Modal
        closeOnDimmerClick={
          !(!state.headerData?.title ||
            (!state.headerData?.author && state.headerData.authorList.length === 0))
        }
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="large"
        dimmer="inverted"
        className="editor_modal"
      >
        <Modal.Header className="editor_modal">
          <Header as="h1">
            <span
              style={{ color: "grey", marginRight: "1ch" }}
            >{`Prosjekttittel: `}</span>
            {lessonTitle}
            <Header.Subheader>{`Kurs: ${courseTitle}`}</Header.Subheader>
          </Header>
        </Modal.Header>
        <Modal.Content className="editor_modal">
          <Header as="h3" className="formLabel">
            { /* @ts-ignore */}
            {`${FORM_TEXT.TITLE.heading} på ${languageName}`}
            <span className="labelTextSpan">(obligatorisk)</span>
          </Header>

          <Input
            autoFocus
            autoComplete="off"
            type="text"
            name="title"
            placeholder={FORM_TEXT.TITLE.placeholder}
            value={state.headerData?.title}
            onChange={changeHandler}
            fluid
          />
          {!state.headerData?.title ? (
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
            inputArray={state.headerData?.authorList}
            inputValue={state.headerData?.author}
            multiInputHandler={multiInputHandler}
            name="author"
            placeholder={FORM_TEXT.AUTHOR.placeholder}
            required="(obligatorisk)"
            title={FORM_TEXT.AUTHOR.heading}
          />
          {state.headerData?.authorList.length === 0 && !state.headerData?.author ? (
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
            inputArray={state.headerData?.translatorList}
            inputValue={state.headerData?.translator}
            multiInputHandler={multiInputHandler}
            name="translator"
            placeholder={FORM_TEXT.TRANSLATOR.placeholder}
            title={FORM_TEXT.TRANSLATOR.heading}
          />
        </Modal.Content>

        <Modal.Actions className="editor_modal">
          <Button
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
          />
          <Button
            disabled={
              !state.headerData?.title || (!state.headerData.author && state.headerData.authorList.length === 0)
            }
            onClick={onSubmit}
            content="OK"
            positive
            labelPosition="right"
            icon="checkmark"
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default EditorDatamodal;
