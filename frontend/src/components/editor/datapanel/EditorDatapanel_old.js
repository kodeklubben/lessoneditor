import "./editordatapanel.scss";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Popup } from "semantic-ui-react";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO.js";
import { FileContext } from "contexts/FileContext";

const EditorDatapanel = ({ courseTitle, lessonTitle, setShowSpinner }) => {
  const history = useHistory();
  const { lessonId, file } = useParams();
  const { headerData, saveFileHeader, rawMdFileContent } =
    useContext(FileContext);
  const [openMetaData, setOpenMetaData] = useState(false);
  const [state, setState] = useState();

  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

  const getLanguageFromSlug = {
    nb: "Bokmål",
    nn: "Nynorsk",
    en: "Engelsk",
    is: "Islandsk",
  };

  //useeffect her for å forhindre infinite loop når metadata åpnes
  useEffect(() => {
    setOpenMetaData(rawMdFileContent.slice(0, 8) === "---\n---\n");
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
    setOpenMetaData(false);
    history.push("/");
    history.replace(["editor", lessonId, file].join("/"));
  };

  const onCancel = async () => {
    setState(headerData);
    setOpenMetaData(false);
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
            onClick={() => setOpenMetaData(true)}
          />
        }
      />

      {openMetaData ? (
        <div
          style={openMetaData ? { display: "flex" } : { display: "none" }}
          className="editorDatapanel_BG"
        >
          <div className="editorDatapanel_container">
            <i onClick={onCancel} className="big grey x icon editor" />
            <div style={{ marginBottom: "1em" }} className="field">
              <h2
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: "auto",
                }}
              >
                <span
                  style={{ color: "grey", marginRight: "1ch" }}
                >{`Prosjekttittel: `}</span>
                {lessonTitle}
              </h2>
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: "auto",
                }}
              >{`Kurs: ${courseTitle}`}</p>
              <br />
            </div>
            <div id="titleField" className="field">
              <label>
                <h3 className="formLabel">
                  {`${FORM_TEXT.TITLE.heading} på ${getLanguageFromSlug[language]}`}
                  <span style={{ color: "grey" }} className="requiredText">
                    (obligatorisk)
                  </span>
                </h3>
              </label>
              <input
                style={{ width: "50%" }}
                autoFocus
                autoComplete="off"
                type="text"
                name="title"
                placeholder={FORM_TEXT.TITLE.placeholder}
                value={state.title}
                onChange={changeHandler}
              />
              {!state.title ? (
                <p style={{ color: "red" }}>Må ha tittel</p>
              ) : (
                <p> </p>
              )}

              <div className="validateError">{state.err}</div>
            </div>
            <br />
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
            <br />
            <MultiInput
              changeHandler={changeHandler}
              inputArray={state.translatorList}
              inputValue={state.translator}
              multiInputHandler={multiInputHandler}
              name="translator"
              placeholder={FORM_TEXT.TRANSLATOR.placeholder}
              title={FORM_TEXT.TRANSLATOR.heading}
            />
            <Button
              disabled={
                !state.title || (!state.author && state.authorList.length === 0)
              }
              onClick={onSubmit}
              content="OK"
            />
            <Button onClick={onCancel} content="Avbryt" />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default EditorDatapanel;
