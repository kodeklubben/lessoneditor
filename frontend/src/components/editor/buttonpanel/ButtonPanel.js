import React, { useState } from "react";
import "./buttonpanel.scss";
import { Button, Popup } from "semantic-ui-react";
import ShowSpinner from "../../ShowSpinner";
import Autosave from "../Autosave";
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
import EditorDatamodal from "../datapanel/EditorDatamodal";
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
  setRedoCursorPosition,
  setUndoCursorPosition,
  setRenderContent,
  undo,
  undoCursorPosition,
  uploadImageRef,
}) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const history = useHistory();
  const { lessonId, file } = useParams();

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
    <>
      {showSpinner ? <ShowSpinner /> : ""}
      <div className="buttonpanel" style={{ paddingBottom: "0.25em" }}>
        <div style={{ display: "inline" }}>
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

          <span style={{ margin: "1.5em" }} />

          <UndoRedo
            editorRef={editorRef}
            mdText={mdText}
            undo={undo}
            redo={redo}
            cursorPositionStart={cursorPositionStart}
            undoCursorPosition={undoCursorPosition}
            redoCursorPosition={redoCursorPosition}
            setUndoCursorPosition={setUndoCursorPosition}
            setRedoCursorPosition={setRedoCursorPosition}
            pushUndoValue={pushUndoValue}
            pushRedoValue={pushRedoValue}
            setCursorPosition={setCursorPosition}
          />

          <span style={{ margin: "1.5em" }} />

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

          <span style={{ margin: "1.5em" }} />

          <Lists
            editorRef={editorRef}
            cursorPositionStart={cursorPositionStart}
            cursorPositionEnd={cursorPositionEnd}
            mdText={mdText}
            buttonValues={buttonValues}
            setMdText={setMdText}
            setCursorPosition={setCursorPosition}
            setCursor={setCursor}
            setListButtonValues={setListButtonValues}
            setButtonValues={setButtonValues}
          />

          <div style={{ display: "flex", float: "right", height: "1em" }}>
            <Languages
              saveEditorText={saveEditorText}
              lessonId={lessonId}
              file={file}
              setShowSpinner={setShowSpinner}
            />
            <EditorDatamodal
              courseTitle={courseTitle}
              lessonTitle={lessonTitle}
              setShowSpinner={setShowSpinner}
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
                  basic
                  id="next"
                  disabled={!mdText || mdText.length === 0}
                  size="big"
                  onClick={onSubmit}
                  icon="arrow right"
                />
              }
            />
          </div>
        </div>

        <br />
        <div>
          <Sections
            editorRef={editorRef}
            cursorPositionStart={cursorPositionStart}
            cursorPositionEnd={cursorPositionEnd}
            mdText={mdText}
            buttonValues={buttonValues}
            setMdText={setMdText}
            setCursorPosition={setCursorPosition}
            setCursor={setCursor}
            setButtonValues={setButtonValues}
          />
          <div style={{ display: "inline", marginLeft: "5em" }}>
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
            <Autosave
              mdText={mdText}
              saveEditorText={saveEditorText}
              setRenderContent={setRenderContent}
            />
          </div>
        </div>
        <div>
          {course === "microbit" ? (
            <>
              <MicrobitButtons
                editorRef={editorRef}
                cursorPositionStart={cursorPositionStart}
                cursorPositionEnd={cursorPositionEnd}
                mdText={mdText}
                buttonValues={buttonValues}
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
                cursorPositionStart={cursorPositionStart}
                cursorPositionEnd={cursorPositionEnd}
                mdText={mdText}
                buttonValues={buttonValues}
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
    </>
  );
};

export default ButtonPanel;
