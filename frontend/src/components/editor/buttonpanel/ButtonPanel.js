import "./buttonpanel.scss";
import React, { useContext } from "react";
import { Button, Icon, Popup } from "semantic-ui-react";
import Emphasis from "./Emphasis";
import UndoRedo from "./UndoRedo";
import Hyperlink from "./Hyperlink";
import Image from "./Image";
import Languages from "./Languages";
import Lists from "./Lists";
import Sections from "./Sections";
import CodeButton from "./CodeButton";
import MicrobitButtons from "./MicrobitButtons";
import SratchButtons from "./ScratchButtons";
import EditorDatapanel from "../datapanel/EditorDatapanel";
import saveMdText from "../../../api/save-md-text";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import { LessonContext } from "contexts/LessonContext";
import createNewHeader from "./utils/createNewHeader";

const ButtonPanel = ({
  editorRef,
  uploadImageRef,
  mdText,
  buttonValues,
  cursorPositionStart,
  cursorPositionEnd,
  undo,
  redo,
  undoCursorPosition,
  redoCursorPosition,
  pushUndoValue,
  pushRedoValue,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  setUndoCursorPosition,
  setRedoCursorPosition,
  setListButtonValues,
  openMetaData,
  setOpenMetaData,
  setShowSpinner,
  lessonTitle,
  courseTitle,
  course,
  userName,
}) => {
  const history = useHistory();
  const { lessonId, file } = useParams();
  const context = useContext(LessonContext);
  const { getHeaderData } = context;

  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

  const newHeader = (language) => {
    const res = getHeaderData();
    const header = createNewHeader(res, language);
    return header;
  };

  const onSubmit = () => {
    setShowSpinner(true);
    navigateToHome();
  };

  const navigateToHome = async () => {
    let target = "";
    const newHeaderText = newHeader(language);
    const newMdText =
      typeof newHeaderText !== "undefined"
        ? newHeaderText + "\n\n\n" + mdText
        : mdText;

    if (file.slice(0, 6) === "README") {
      target = ["/landingpage", lessonId, "teacherguides"].join("/");
    } else {
      target = ["/landingpage", lessonId, "lessontexts"].join("/");
    }

    await saveMdText(
      lessonId,
      file,
      newMdText,
      language === "nb" && file.slice(0, 6) !== "README" ? true : "" //render thumbnail switch
    );
    history.push({ pathname: target });
  };

  return (
    <div className="buttonpanel" style={{ paddingBottom: "0.25em" }}>
      <div style={{ display: "inline" }}>
        <div className="ui icon buttons">
          <Emphasis
            editorRef={editorRef}
            mdText={mdText}
            buttonValues={buttonValues}
            cursorPositionStart={cursorPositionStart}
            cursorPositionEnd={cursorPositionEnd}
            setMdText={setMdText}
            setCursorPosition={setCursorPosition}
            setCursor={setCursor}
            setButtonValues={setButtonValues}
          />
        </div>
        <span style={{ margin: "1.5em" }} />
        <div className="ui icon buttons">
          <UndoRedo
            editorRef={editorRef}
            mdText={mdText}
            undo={undo}
            redo={redo}
            cursorPositionStart={cursorPositionStart}
            undoCursorPosition={undoCursorPosition}
            redoCursorPosition={redoCursorPosition}
            pushUndoValue={pushUndoValue}
            pushRedoValue={pushRedoValue}
            setRedoCursorPosition={setRedoCursorPosition}
            setCursorPosition={setCursorPosition}
            setUndoCursorPosition={setUndoCursorPosition}
          />
        </div>
        <span style={{ margin: "1.5em" }} />
        <div className="ui icon buttons">
          <Hyperlink
            editorRef={editorRef}
            mdText={mdText}
            cursorPositionStart={cursorPositionStart}
            cursorPositionEnd={cursorPositionEnd}
            setMdText={setMdText}
            setCursorPosition={setCursorPosition}
            setCursor={setCursor}
          />
          <Image editorRef={editorRef} uploadImageRef={uploadImageRef} />
        </div>
        <span style={{ margin: "1.5em" }} />
        <div className="ui icon buttons">
          <Lists
            editorRef={editorRef}
            mdText={mdText}
            buttonValues={buttonValues}
            cursorPositionStart={cursorPositionStart}
            cursorPositionEnd={cursorPositionEnd}
            setMdText={setMdText}
            setCursorPosition={setCursorPosition}
            setCursor={setCursor}
            setListButtonValues={setListButtonValues}
            setButtonValues={setButtonValues}
          />
        </div>
        <div style={{ display: "flex", float: "right", height: "1em" }}>
          <Languages
            mdText={mdText}
            file={file}
            setShowSpinner={setShowSpinner}
            language={language ? language : ""}
          />
          <EditorDatapanel
            mdText={mdText}
            file={file}
            openMetaData={openMetaData}
            setOpenMetaData={setOpenMetaData}
            setShowSpinner={setShowSpinner}
            language={language ? language : ""}
            lessonTitle={lessonTitle}
            courseTitle={courseTitle}
            userName={userName}
          />
          <Popup
            content={"Til prosjektoversikt"}
            mouseEnterDelay={250}
            mouseLeaveDelay={250}
            trigger={
              <Button
                style={{
                  height: "2em",
                  marginRight: "-0.5em",
                  padding: "0 1em 0 1em",
                }}
                className={`ui ${
                  mdText && mdText.length < 1 ? `disabled` : ``
                } button`}
                id="next"
                disabled={mdText.length === 0}
                // className="CPButton"
                size="big"
                onClick={onSubmit}
              >
                <Icon color={"grey"} name={"arrow right"} />
              </Button>
            }
          />
        </div>
      </div>

      <br />
      <div>
        <Sections
          editorRef={editorRef}
          mdText={mdText}
          buttonValues={buttonValues}
          cursorPositionStart={cursorPositionStart}
          cursorPositionEnd={cursorPositionEnd}
          setMdText={setMdText}
          setCursorPosition={setCursorPosition}
          setCursor={setCursor}
          setButtonValues={setButtonValues}
        />
        <span style={{ marginLeft: "5em" }}>
          <CodeButton
            editorRef={editorRef}
            mdText={mdText}
            cursorPositionStart={cursorPositionStart}
            cursorPositionEnd={cursorPositionEnd}
            buttonValues={buttonValues}
            setMdText={setMdText}
            setCursorPosition={setCursorPosition}
            setCursor={setCursor}
            setButtonValues={setButtonValues}
            course={course}
            courseTitle={courseTitle}
          />
        </span>
      </div>
      <div>
        {course === "microbit" ? (
          <>
            <MicrobitButtons
              editorRef={editorRef}
              mdText={mdText}
              buttonValues={buttonValues}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
              setButtonValues={setButtonValues}
            />
          </>
        ) : (
          ""
        )}
        {course === "scratch" ? (
          <>
            <SratchButtons
              editorRef={editorRef}
              mdText={mdText}
              buttonValues={buttonValues}
              cursorPositionStart={cursorPositionStart}
              cursorPositionEnd={cursorPositionEnd}
              setMdText={setMdText}
              setCursorPosition={setCursorPosition}
              setCursor={setCursor}
              setButtonValues={setButtonValues}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ButtonPanel;
