import "./editordatapane.scss";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO.js";
import { LessonContext } from "contexts/LessonContext";
import saveMdText from "../../../../api/save-md-text";
import createNewHeader from "../utils/createNewHeader";
import { useHistory } from "react-router-dom";
const EditorDatapanel = ({ mdText, file, open, setOpen, editorRef }) => {
  const { lessonId } = useParams();
  const context = useContext(LessonContext);
  const { headerData, setHeaderData } = context;
  const [state, setState] = useState({});

  const history = useHistory();

  useEffect(() => {
    const setDataFromHeaderData = async () => {
      if (Object.keys(headerData).length > 0) {
        setState(await headerData);
      } else {
        setState({ title: "", authorList: [] });
      }
    };
    setDataFromHeaderData();
  }, [headerData, setState]);

  const changeHandler = (event) => {
    const nam = event.target.name;
    const val = event.target.value;
    setState((prevState) => ({ ...prevState, [nam]: val }));
    if (state.author) {
      setState((prevState) => ({ ...prevState, err: "" }));
    }
    if (state.title) {
      setState((prevState) => ({ ...prevState, err: "" }));
    }
  };

  const multiInputHandler = (object, field) => {
    const key = Object.keys(object)[0];
    const value = Object.values(object)[0];
    setState((prevState) => ({ ...prevState, [key]: value }));
    setState((prevState) => ({ ...prevState, [field]: "" }));
  };

  const onSubmit = async () => {
    setHeaderData(state);
    const newHeader = createNewHeader(state);
    const newMdText =
      newHeader !== undefined ? newHeader + "\n\n\n" + mdText : mdText;
    await saveMdText(lessonId, file, newMdText);
    setOpen(false);
    editorRef.current.focus();
  };

  const onCancel = async () => {
    if (!state.title) {
      const target = ["/landingpage", lessonId].join("/");
      history.push(target);
    }
    setState(await headerData);
    const newHeader = createNewHeader(state);
    let newMdText =
      newHeader !== undefined ? newHeader + "\n\n\n" + mdText : mdText;
    await saveMdText(lessonId, file, newMdText);
    setOpen(false);
  };

  return (
    <>
      <button className="ui button" onClick={() => setOpen(!open)}>
        <i style={{ cursor: "pointer" }} className="grey cog icon"></i>
      </button>

      {open ? (
        <div
          style={open ? { display: "flex" } : { display: "none" }}
          className="editorDatapanel_BG"
        >
          <div className="editorDatapanel_container">
            <i onClick={onCancel} className="big grey x icon editor" />
            <div id="titleField" className="field">
              <label>
                <h3 className="formLabel">
                  {FORM_TEXT.TITLE.heading}
                  <span className="requiredText"> (obligatorisk)</span>
                </h3>
              </label>
              <input
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
            <MultiInput
              changeHandler={changeHandler}
              multiInputHandler={multiInputHandler}
              name="author"
              title={FORM_TEXT.AUTHOR.heading}
              inputArray={state.authorList}
              inputValue={state.author}
              validateMessage={state.err}
              required="(obligatorisk)"
              placeholder={FORM_TEXT.AUTHOR.placeholder}
            />
            {state.authorList.length === 0 && !state.author ? (
              <p style={{ color: "red" }}>Må ha forfatter</p>
            ) : (
              <p></p>
            )}
            <MultiInput
              changeHandler={changeHandler}
              multiInputHandler={multiInputHandler}
              name="translator"
              title={FORM_TEXT.TRANSLATOR.heading}
              inputArray={state.translatorList}
              inputValue={state.translator}
              placeholder={FORM_TEXT.TRANSLATOR.placeholder}
            />
            <button
              className="ui button"
              disabled={
                !state.title || (!state.author && state.authorList.length === 0)
              }
              onClick={onSubmit}
            >
              OK
            </button>
            <button className="ui button" onClick={onCancel}>
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default EditorDatapanel;
