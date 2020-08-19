import "./editordatapane.scss";
import React, { useState } from "react";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO.js";

const EditorDatapanel = ({ title, setTitle }) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    err: "",
    author: "",
    authorList: [],
    authorErr: "",
    translator: "",
    translatorList: [],
  });

  const changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    if (nam === "title") {
      setTitle(val);
    } else {
      setState((prevState) => ({ ...prevState, [nam]: val }));
      if (state.author) setState((prevState) => ({ ...prevState, err: "" }));
      if (title) setState((prevState) => ({ ...prevState, err: "" }));
    }
  };

  const multiInputHandler = (object, field) => {
    let key = Object.keys(object)[0];
    let value = Object.values(object)[0];
    setState((prevState) => ({ ...prevState, [key]: value }));
    setState((prevState) => ({ ...prevState, [field]: "" }));
  };

  return (
    <>
      <button
        style={{ marginLeft: "auto", float: "right" }}
        className="ui button"
        onClick={() => setOpen(!open)}
      >
        <i style={{ cursor: "pointer" }} className="grey cog icon"></i>
      </button>

      {open ? (
        <div
          style={open ? { display: "flex" } : { display: "none" }}
          className="editorDatapanel_BG"
        >
          <div style={{ padding: "5em" }} className="editorDatapanel_container">
            <i
              onClick={() => setOpen(!open)}
              className="big grey x icon editor"
            />
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
                value={title}
                onChange={changeHandler}
              />

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
              autofocus="autofocus"
              required="(obligatorisk)"
              placeholder={FORM_TEXT.AUTHOR.placeholder}
            />
            <MultiInput
              changeHandler={changeHandler}
              multiInputHandler={multiInputHandler}
              name="translator"
              title={FORM_TEXT.TRANSLATOR.heading}
              inputArray={state.translatorList}
              inputValue={state.translator}
              placeholder={FORM_TEXT.TRANSLATOR.placeholder}
            />
            <button className="ui button">OK</button>
            <button className="ui button" onClick={() => setOpen(!open)}>
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
