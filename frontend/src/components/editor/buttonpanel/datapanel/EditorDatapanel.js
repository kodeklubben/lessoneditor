import "./editordatapane.scss";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO.js";
import COURSELIST from "components/editor/settingsFiles/COURSELIST";
import { LessonContext } from "contexts/LessonContext";
import { UserContext } from "contexts/UserContext";
import saveMdText from "../../../../api/save-md-text";
import createNewHeader from "../utils/createNewHeader";
import { useHistory } from "react-router-dom";
const EditorDatapanel = ({
  mdText,
  initText,
  file,
  openMetaData,
  setOpenMetaData,
  editorRef,
}) => {
  const { lessonId } = useParams();
  const context = useContext(LessonContext);
  const userContext = useContext(UserContext);
  const { headerData, setHeaderData, language } = context;

  const [state, setState] = useState({ title: "", authorList: [] });

  const languageNotSlug = {
    nb: "Bokmål",
    nn: "Nynorsk",
    en: "Engelsk",
    is: "islandsk",
  };

  const courseNotSlug = COURSELIST.find(
    ({ slug }) => slug === context.data.course
  );

  const history = useHistory();

  useEffect(() => {
    console.log(userContext.user);
    const setDataFromHeaderData = async () => {
      if (Object.keys(headerData).length > 0) {
        setState(await headerData);
      } else {
        setState({ title: "", authorList: [] });
      }
    };
    setDataFromHeaderData();
    setState((prevState) => ({
      ...prevState,
      authorList: [userContext.user.name],
      title: context.data.lesson ? context.data.lesson.replace("_", " ") : "",
    }));
  }, [headerData, context.data.lesson, userContext.user]);

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

  const multiInputHandler = (object, name) => {
    const key = Object.keys(object)[0];
    const value = Object.values(object)[0];
    setState((prevState) => ({ ...prevState, [key]: value }));
    setState((prevState) => ({ ...prevState, [name]: "" }));
  };

  const onSubmit = async () => {
    setHeaderData(state);
    const newHeader = createNewHeader(state);
    const newMdText =
      newHeader !== undefined ? newHeader + "\n\n\n" + mdText : mdText;
    await saveMdText(lessonId, file, newMdText).then(setOpenMetaData(false));
    editorRef.current.focus();
  };

  const onCancel = async () => {
    let target = "";
    if (
      state.title === context.data.lesson.replace("_", " ") &&
      state.authorList[0] === userContext.user.name
    ) {
      setOpenMetaData(false);
      return;
    }
    if (state.title === "" && state.authorList.length === 0) {
      setOpenMetaData(false);
      return;
    }
    target = ["editor", lessonId, file].join("/");
    await saveMdText(lessonId, file, initText);
    history.push("/");
    history.replace(target);
    setOpenMetaData(false);
  };

  return (
    <>
      <button
        className="ui button"
        onClick={() => setOpenMetaData(!openMetaData)}
      >
        <span>
          <i
            style={{ cursor: "pointer" }}
            className="grey  address card icon"
          ></i>
          {"Oppgavedata: "}
        </span>
      </button>

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
                {`${context.data.lesson.replace("_", " ")}`}
              </h2>
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: "auto",
                }}
              >{`Kurs: ${courseNotSlug?.courseTitle}`}</p>
              <br />
            </div>
            <div id="titleField" className="field">
              <label>
                <h3 className="formLabel">
                  {`${FORM_TEXT.TITLE.heading} på ${languageNotSlug[language]}`}
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
            <br />
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
