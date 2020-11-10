import "./editordatapanel.scss";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { Button, Icon, Popup } from "semantic-ui-react";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO.js";
import { COURSESLIST } from "components/editor/settingsFiles/COURSELIST";
import { LessonContext } from "contexts/LessonContext";
import { UserContext } from "contexts/UserContext";
import saveMdText from "../../../../api/save-md-text";
import createNewHeader from "../utils/createNewHeader";
const EditorDatapanel = ({
  mdText,
  file,
  openMetaData,
  setOpenMetaData,
  setShowSpinner,
  language,
}) => {
  const { lessonId } = useParams();
  const context = useContext(LessonContext);
  const userContext = useContext(UserContext);
  const { getHeaderData, setHeaderData } = context;

  const [state, setState] = useState({ title: "", authorList: [] });

  const getLanguageFromSlug = {
    nb: "Bokmål",
    nn: "Nynorsk",
    en: "Engelsk",
    is: "Islandsk",
  };

  const getCourseFromSlug = COURSESLIST.find(
    ({ slug }) => slug === context.data.course
  );

  useEffect(() => {
    setShowSpinner(true);
    getHeaderData().then((headerData) => {
      const setDataFromHeaderData = async () => {
        if (Object.keys(await headerData).length > 0) {
          setState(await headerData);
        } else if (await userContext.user.name) {
          setState((prevState) => ({
            ...prevState,
            authorList: [userContext.user.name],
            title: context.data.lesson
              ? context.data.lesson.replace(/-/g, " ")
              : "",
          }));
        } else {
          setState({ title: "", authorList: [] });
        }
      };
      setDataFromHeaderData();
      setShowSpinner(false);
    });
  }, [getHeaderData, setShowSpinner, context.data.lesson, userContext.user]);

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
    await saveMdText(lessonId, file, newMdText).then(window.location.reload());
  };

  const onCancel = () => {
    window.location.reload();
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
            className={`ui button`}
            id="next"
            size="big"
            onClick={() => setOpenMetaData(!openMetaData)}
          >
            <span>
              <Icon color={"grey"} name={"address card"} /> Oppgavedata
            </span>
          </Button>
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
                {`${context.data.lesson.replace(/-/g, " ")}`}
              </h2>
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: "auto",
                }}
              >{`Kurs: ${getCourseFromSlug?.courseTitle}`}</p>
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
