import "./editordatamodal.scss";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Popup, Modal, Header, Input } from "semantic-ui-react";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO.js";
import { FileContext } from "contexts/FileContext";

const EditorDatamodal = ({ courseTitle, lessonTitle, setShowSpinner }) => {
  const history = useHistory();
  const { lessonId, file } = useParams();
  const { headerData, saveFileHeader, rawMdFileContent } =
    useContext(FileContext);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    title: "",
    authorList: [],
    translatorList: [],
  });

  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

  const getLanguageFromSlug = {
    nb: "Bokmål",
    nn: "Nynorsk",
    en: "Engelsk",
    is: "Islandsk",
  };

  //useeffect her for å forhindre infinite loop når metadata åpnes
  useEffect(() => {
    setOpen(rawMdFileContent.slice(0, 8) === "---\n---\n");
    setState(headerData);
  }, [headerData, rawMdFileContent]);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    if (state.author) {
      setState((prevState) => ({ ...prevState, err: "" }));
    }
    if (state.title) {
      setState((prevState) => ({ ...prevState, err: "" }));
    }
  };

  const multiInputHandler = (object, name) => {
    const key = Object.keys(object)[0];
    const value = Object.values(object)[0];
    setState((prevState) => ({ ...prevState, [key]: value }));
    setState((prevState) => ({ ...prevState, [name]: "" }));
  };

  const onSubmit = async () => {
    const newHeaderData = Object.assign({ language }, state);
    setShowSpinner(true);
    await saveFileHeader(lessonId, file, newHeaderData);
    setShowSpinner(false);
    setOpen(false);
    history.push("/");
    history.replace(["editor", lessonId, file].join("/"));
  };

  const onCancel = async () => {
    setState(headerData);
    setOpen(false);
  };

  return (
    <>
      <Popup
        content={"Endre data for oppgavetekst"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
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
        closeOnDimmerClick={false}
        closeIcon={
          !(!state.title || (!state.author && state.authorList.length === 0))
        }
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="large"
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
            {`${FORM_TEXT.TITLE.heading} på ${getLanguageFromSlug[language]}`}
            <span className="labelTextSpan">(obligatorisk)</span>
          </Header>

          <Input
            autoFocus
            autoComplete="off"
            type="text"
            name="title"
            placeholder={FORM_TEXT.TITLE.placeholder}
            value={state.title}
            onChange={changeHandler}
            fluid
          />
          {!state.title ? (
            <p style={{ color: "red" }}>Må ha tittel</p>
          ) : (
            <p> </p>
          )}

          <div className="validateError">{state.err}</div>
        </Modal.Content>
        <Modal.Content className="editor_modal">
          <MultiInput
            changeHandler={changeHandler}
            inputArray={state.authorList}
            inputValue={state.author}
            multiInputHandler={multiInputHandler}
            name="author"
            placeholder={FORM_TEXT.AUTHOR.placeholder}
            required="(obligatorisk)"
            title={FORM_TEXT.AUTHOR.heading}
            validateMessage={state.err}
          />
          {state.authorList.length === 0 && !state.author ? (
            <p style={{ color: "red" }}>Må ha forfatter</p>
          ) : (
            <p></p>
          )}
        </Modal.Content>
        <Modal.Content className="editor_modal">
          <MultiInput
            changeHandler={changeHandler}
            inputArray={state.translatorList}
            inputValue={state.translator}
            multiInputHandler={multiInputHandler}
            name="translator"
            placeholder={FORM_TEXT.TRANSLATOR.placeholder}
            title={FORM_TEXT.TRANSLATOR.heading}
          />
        </Modal.Content>

        <Modal.Actions className="editor_modal">
          <Button
            disabled={
              !state.title || (!state.author && state.authorList.length === 0)
            }
            onClick={onSubmit}
            content="OK"
            positive
          />
          <Button
            disabled={
              !state.title || (!state.author && state.authorList.length === 0)
            }
            onClick={onCancel}
            content="Avbryt"
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditorDatamodal;
