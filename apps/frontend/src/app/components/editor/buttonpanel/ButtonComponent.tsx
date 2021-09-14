import { FC, RefObject, Dispatch, SetStateAction } from "react";
import { Button, Popup } from "semantic-ui-react";
import { useHotkeys } from "react-hotkeys-hook";
import { onButtonClick, heading as h } from "./utils/buttonMethods";
import { codebuttons } from "./settings/buttonConfig";
import { microbitbuttons, scratchbuttons } from "./settings/microbitAndScratchButtonConfig";

interface ButtonComponentProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  isON: boolean;
  title: string;
  buttonTitle: string;
  shortcutKey: string;
  style?: Record<string, string>;
  imageurl?: string;
  icon?: string;
  setButtonValues: Dispatch<SetStateAction<Record<string, boolean>>>;
  setListButtonValues?: React.Dispatch<
    React.SetStateAction<{ bTitle: string; output: string; cursorInt: number }>
  >;
  setCursor: (pos1: number, pos2: number) => void;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setMdText: Dispatch<SetStateAction<string>>;
  cursorIntON: number;
  cursorIntOFF: number;
  output: string;
  mdText: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  course?: string;
  courseTitle?: string;
  outputOnEnter?: string;
  color?: string;
}

export const ButtonComponent: FC<ButtonComponentProps> = ({
  editorRef,
  isON,
  title,
  buttonTitle,
  shortcutKey,
  style,
  imageurl,
  icon,
  setButtonValues,
  setListButtonValues,
  setCursor,
  setCursorPosition,
  setMdText,
  cursorIntON,
  cursorIntOFF,
  output,
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
  course,
  courseTitle,
  outputOnEnter,
  color,
}) => {
  const setChanges = (mdText: string, cursorPositionStart: number, cursorPositionEnd: number) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const toggleButton = (value: string) => {
    if (setButtonValues) {
      setButtonValues((prevButtonValues: Record<string, boolean>) => ({
        ...prevButtonValues,
        [value]: !isON,
      }));
    }
  };

  const setButton = (
    isON: boolean,
    cursorIntON: number,
    cursorIntOFF: number,
    output: string,
    mdText: string,
    cursorPositionStart: number,
    cursorPositionEnd: number
  ) => {
    const results = onButtonClick(
      isON,
      cursorIntON,
      cursorIntOFF,
      output,
      mdText,
      cursorPositionStart,
      cursorPositionEnd
    );

    setChanges(
      results.data.mdText,
      results.data.cursorPositionStart,
      results.data.cursorPositionEnd
    );
  };

  const set = (button: string) => {
    if (button === "codeblock") {
      toggleButton(button);
      setButton(
        isON,
        cursorIntON + (course === "scratch" ? 6 : course?.length || 0),
        cursorIntOFF,
        output.slice(0, 3) + (course === "scratch" ? "blocks" : course) + output.slice(3),
        mdText,
        cursorPositionStart,
        cursorPositionEnd
      );
    } else if (button === "heading") {
      const results: { isON: boolean; mdText: string; cursorPositionStart: number } = h(
        isON,
        mdText,
        cursorPositionStart,
        output
      );

      setButtonValues((prevButtonValues) => ({
        ...prevButtonValues,
        [buttonTitle]: results?.isON,
      }));
      setChanges(results?.mdText, results?.cursorPositionStart, results?.cursorPositionStart);
    } else if (button === "listUl" || button === "listOl" || button === "listCheck") {
      toggleButton(buttonTitle);
      if (setListButtonValues) {
        alert("buttonList");
        setListButtonValues({
          bTitle: buttonTitle,
          output: outputOnEnter || "",
          cursorInt: cursorIntON,
        });
      }
      setButton(
        isON,
        cursorIntON,
        cursorIntOFF,
        output,
        mdText,
        cursorPositionStart,
        cursorPositionEnd
      );
    } else {
      toggleButton(buttonTitle);
      setButton(
        isON,
        cursorIntON,
        cursorIntOFF,
        output,
        mdText,
        cursorPositionStart,
        cursorPositionEnd
      );
    }
  };

  useHotkeys(
    shortcutKey,
    (event) => {
      event.preventDefault();
      set(buttonTitle);
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [toggleButton, setButton]
  );

  const handleButtonClick = (button: string) => {
    if (editorRef) {
      editorRef.current ? editorRef.current.focus() : "";
    }
    set(button);
  };

  const returnType = (buttonTitle: string) => {
    if (Object.keys(codebuttons).filter((item) => item === buttonTitle).length > 0) {
      return (
        <RenderCodeButton
          isON={isON}
          title={title}
          handleButtonClick={handleButtonClick}
          buttonTitle={buttonTitle}
          shortcutKey={shortcutKey}
          style={style || {}}
          courseTitle={courseTitle || ""}
        />
      );
    } else if (
      Object.keys(scratchbuttons).filter((item) => item === buttonTitle).length > 0 ||
      Object.keys(microbitbuttons).filter((item) => item === buttonTitle).length > 0
    ) {
      return (
        <RenderMicroScratchButtons
          isON={isON}
          title={title}
          handleButtonClick={handleButtonClick}
          buttonTitle={buttonTitle}
          shortcutKey={shortcutKey}
          color={color || ""}
        />
      );
    } else {
      return (
        <RenderButton
          isON={isON}
          icon={icon || ""}
          title={title}
          handleButtonClick={handleButtonClick}
          buttonTitle={buttonTitle}
          shortcutKey={shortcutKey}
          style={style || {}}
          imageurl={imageurl || ""}
        />
      );
    }
  };

  return returnType(buttonTitle);
};

interface RenderMicroScratchButtonsProps {
  isON: boolean;
  title: string;
  handleButtonClick: (button: string) => void;
  buttonTitle: string;
  shortcutKey: string;
  color: string;
}

export const RenderMicroScratchButtons: FC<RenderMicroScratchButtonsProps> = ({
  isON,
  title,
  handleButtonClick,
  buttonTitle,
  shortcutKey,
  color,
}) => {
  return (
    <>
      <Popup
        content={title + " (" + shortcutKey + ")"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            style={isON ? { backgroundColor: "#AAA" } : { backgroundColor: color }}
            className="MBButton"
            size="tiny"
            onClick={() => handleButtonClick(buttonTitle)}
          >
            {title}
          </Button>
        }
      />
    </>
  );
};

interface RenderCodeButtonProps {
  isON: boolean;
  title: string;
  handleButtonClick: (button: string) => void;
  buttonTitle: string;
  shortcutKey: string;
  style: Record<string, string>;
  courseTitle: string;
}

export const RenderCodeButton: FC<RenderCodeButtonProps> = ({
  title,
  shortcutKey,
  buttonTitle,
  isON,
  style,
  handleButtonClick,
  courseTitle,
}) => {
  return (
    <>
      <Popup
        content={title + " (" + shortcutKey + ")"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          buttonTitle === "codeblock" ? (
            <Button
              style={isON ? { ...style, backgroundColor: "#bbb" } : style}
              className="CPButton"
              size="tiny"
              onClick={() => handleButtonClick(buttonTitle)}
            >
              <div style={{ position: "relative", top: "-5px" }}>
                {"```Kodeblokk"}
                <span style={{ color: "#008000" }}>{'("' + courseTitle + '")'}</span>
              </div>
            </Button>
          ) : (
            <Button
              style={isON ? { ...style, backgroundColor: "#bbb" } : style}
              className="CPButton"
              size="tiny"
              onClick={() => handleButtonClick(buttonTitle)}
            >
              <div style={{ position: "relative", top: "-5px" }}>{"`Inline-kode"}</div>
            </Button>
          )
        }
      />
    </>
  );
};

interface RenderButtonProps {
  isON: boolean;
  icon: string;
  title: string;
  handleButtonClick: (button: string) => void;
  buttonTitle: string;
  shortcutKey: string;
  style?: Record<string, string>;
  imageurl?: string;
}

export const RenderButton: FC<RenderButtonProps> = ({
  isON,
  icon,
  title,
  handleButtonClick,
  buttonTitle,
  shortcutKey,
  style,
  imageurl,
}) => {
  return (
    <>
      <Popup
        content={title + " (" + shortcutKey + ")"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          icon ? (
            <Button
              style={
                isON
                  ? {
                      marginTop: "0.3em",
                      paddingTop: "0.25em",
                      paddingBottom: "0.25em",
                      borderRadius: "10px",
                      backgroundColor: "#bbb",
                    }
                  : {
                      marginTop: "0.3em",
                      paddingTop: "0.25em",
                      paddingBottom: "0.75em",
                      borderRadius: "10px",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                    }
              }
              className="CPButton"
              size="huge"
              icon={icon}
              onClick={() => handleButtonClick(buttonTitle)}
            />
          ) : (
            <Button
              style={isON ? { ...style, background: "#bbb" } : style}
              className="CPButton"
              size="tiny"
              onClick={() => handleButtonClick(buttonTitle)}
            >
              {imageurl ? (
                <span>
                  <img
                    style={{
                      position: "relative",
                      top: "-3px",
                      height: "1.5em",
                      margin: "-4px",
                    }}
                    src={imageurl}
                    alt="test"
                  />
                  <div
                    style={{
                      position: "relative",
                      top: "-5px",
                      margin: "0.5em",
                      display: "inline",
                    }}
                  >
                    {title}
                  </div>
                </span>
              ) : (
                <div style={{ position: "relative", top: "-5px" }}>{title}</div>
              )}
            </Button>
          )
        }
      />
    </>
  );
};
