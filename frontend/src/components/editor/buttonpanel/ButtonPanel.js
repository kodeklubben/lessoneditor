import React from "react";
import "./buttonpanel.scss";
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
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";

const ButtonPanel = ({
  buttonValues,
  course,
  courseTitle,
  cursorPositionEnd,
  cursorPositionStart,
  editorRef,
  lessonTitle,
  mdText,
  openMetaData,
  pushRedoValue,
  pushUndoValue,
  redo,
  redoCursorPosition,
  saveEditorText,
  setButtonValues,
  setCursor,
  setCursorPosition,
  setListButtonValues,
  setMdText,
  setOpenMetaData,
  setRedoCursorPosition,
  setShowSpinner,
  setUndoCursorPosition,
  undo,
  undoCursorPosition,
  uploadImageRef,
  userName,
}) => {
  const history = useHistory();
  const { lessonId, file } = useParams();
  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

  const onSubmit = async () => {
    setShowSpinner(true);
    await navigateToHome();
    setShowSpinner(false);
  };

  const navigateToHome = async () => {
    await saveEditorText();
    const slug =
      file.slice(0, 6) === "README" ? "teacherguides" : "lessontexts";
    const target = ["/landingpage", lessonId, slug].join("/");
    history.push({ pathname: target });
  };

  return (
    <div className="buttonpanel" style={{ paddingBottom: "0.25em" }}>
      <div style={{ display: "inline" }}>
        <div className="ui icon buttons">
          <Emphasis
            buttonValues={buttonValues}
            cursorPositionEnd={cursorPositionEnd}
            cursorPositionStart={cursorPositionStart}
            editorRef={editorRef}
            mdText={mdText}
            setButtonValues={setButtonValues}
            setCursor={setCursor}
            setCursorPosition={setCursorPosition}
            setMdText={setMdText}
          />
        </div>
        <span style={{ margin: "1.5em" }} />
        <div className="ui icon buttons">
          <UndoRedo
            cursorPositionStart={cursorPositionStart}
            editorRef={editorRef}
            mdText={mdText}
            pushRedoValue={pushRedoValue}
            pushUndoValue={pushUndoValue}
            redo={redo}
            redoCursorPosition={redoCursorPosition}
            setCursorPosition={setCursorPosition}
            setRedoCursorPosition={setRedoCursorPosition}
            setUndoCursorPosition={setUndoCursorPosition}
            undo={undo}
            undoCursorPosition={undoCursorPosition}
          />
        </div>
        <span style={{ margin: "1.5em" }} />
        <div className="ui icon buttons">
          <Hyperlink
            cursorPositionEnd={cursorPositionEnd}
            cursorPositionStart={cursorPositionStart}
            editorRef={editorRef}
            mdText={mdText}
            setCursor={setCursor}
            setCursorPosition={setCursorPosition}
            setMdText={setMdText}
          />
          <Image editorRef={editorRef} uploadImageRef={uploadImageRef} />
        </div>
        <span style={{ margin: "1.5em" }} />
        <div className="ui icon buttons">
          <Lists
            buttonValues={buttonValues}
            cursorPositionEnd={cursorPositionEnd}
            cursorPositionStart={cursorPositionStart}
            editorRef={editorRef}
            mdText={mdText}
            setButtonValues={setButtonValues}
            setCursor={setCursor}
            setCursorPosition={setCursorPosition}
            setListButtonValues={setListButtonValues}
            setMdText={setMdText}
          />
        </div>
        <div style={{ display: "flex", float: "right", height: "1em" }}>
          <Languages
            file={file}
            lessonId={lessonId}
            setShowSpinner={setShowSpinner}
            saveEditorText={saveEditorText}
            language={language ? language : ""}
          />
          <EditorDatapanel
            courseTitle={courseTitle}
            file={file}
            language={language ? language : ""}
            lessonTitle={lessonTitle}
            mdText={mdText}
            openMetaData={openMetaData}
            setOpenMetaData={setOpenMetaData}
            setShowSpinner={setShowSpinner}
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
                disabled={!mdText || mdText.length === 0}
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
