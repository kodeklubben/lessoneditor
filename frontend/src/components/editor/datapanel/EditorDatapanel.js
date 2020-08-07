import "./editordatapane.css";
import React, { useState } from "react";
import MultiInput from "./MultiInput";

import { LANGUAGES, FORM_TEXT } from "./settings/landingpage_NO.js";

const EditorDatapanel = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    title: "",
    err: "",
    author: "",
    authorList: [],
    authorErr: "",
    translator: "",
    translatorList: [],
    language: Object.keys(LANGUAGES[0]),
    level: 1,
    license: "CC BY-SA 4.0",
    tags: { topic: [], subject: [], grade: [] },
    redirect: null,
    pageNumber: 1,
  });

  const changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    setState((prevState) => ({ ...prevState, [nam]: val }));
    if (state.author) setState((prevState) => ({ ...prevState, err: "" }));
    if (state.title) setState((prevState) => ({ ...prevState, err: "" }));
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
          className="editorDatapanelBG"
        >
          <div style={{ padding: "5em" }} className="editorDatapanel">
            <i
              onClick={() => setOpen(!open)}
              id="test"
              className="big grey x icon"
            />
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
            <div className="field">
              <label>
                <h3 className="formLabel">{FORM_TEXT.LANGUAGE.heading}</h3>
                <select
                  name="language"
                  onChange={changeHandler}
                  className="ui dropdown"
                >
                  {LANGUAGES.map((element) => (
                    <option
                      key={Object.keys(element)}
                      value={Object.keys(element)}
                    >
                      {Object.values(element)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
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

              <div className="validateError">{state.err}</div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default EditorDatapanel;
