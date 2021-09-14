import { FC, RefObject, Dispatch, SetStateAction } from "react";
import { Button, Popup } from "semantic-ui-react";
import { useHotkeys } from "react-hotkeys-hook";
import { onButtonClick } from "./utils/buttonMethods";

interface ButtonComponentProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  isON: boolean;
  title: string;
  buttonTitle: string;
  shortcutKey: string;
  style: Record<string, string>;
  imageurl: string;
  icon: string;
  setButtonValues: Dispatch<SetStateAction<Record<string, boolean>>>;
  setCursor: (pos1: number, pos2: number) => void;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setMdText: Dispatch<SetStateAction<string>>;
  cursorIntON: number;
  cursorIntOFF: number;
  output: string;
  mdText: string;
  cursorPositionStart: number;
  cursorPositionEnd: number;
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
  setCursor,
  setCursorPosition,
  setMdText,
  cursorIntON,
  cursorIntOFF,
  output,
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
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

  const setButton = (isON: boolean, cursorIntON: number, cursorIntOFF: number, output: string) => {
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

  const set = {
    defaultAction: () => {
      toggleButton(buttonTitle);
      setButton(isON, cursorIntON, cursorIntOFF, output);
    },
  };

  useHotkeys(
    shortcutKey,
    (event) => {
      event.preventDefault();
      set["defaultAction"]();
      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [toggleButton, setButton]
  );

  const handleButtonClick = (button: string) => {
    if (editorRef) {
      editorRef.current ? editorRef.current.focus() : "";
    }
    set["defaultAction"]();
  };

  return RenderButton(
    title,
    shortcutKey,
    icon,
    isON,
    handleButtonClick,
    buttonTitle,
    imageurl,
    style
  );
};

interface MicroScratchButtonComponentProps {
  isON: boolean;
  title: string;
  handleClick: (x: string) => void;
  buttonTitle: string;
  shortcutKey: string;
  color: string;
}

export const MicroScratchButtonComponent: FC<MicroScratchButtonComponentProps> = ({
  isON,
  title,
  handleClick,
  buttonTitle,
  shortcutKey,
  color,
}) => {
  const responsiveCP = () => {
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
              onClick={() => handleClick(buttonTitle)}
            >
              {title}
            </Button>
          }
        />
      </>
    );
  };

  return responsiveCP();
};

interface CodeButtonComponentProps {
  isON: boolean;
  title: string;
  handleClick: (x: string) => void;
  buttonTitle: string;
  shortcutKey: string;
  courseTitle: string;
  style: Record<string, string>;
}

export const CodeButtonComponent: FC<CodeButtonComponentProps> = ({
  isON,
  title,
  handleClick,
  buttonTitle,
  shortcutKey,
  courseTitle,
  style,
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
              onClick={() => handleClick(buttonTitle)}
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
              onClick={() => handleClick(buttonTitle)}
            >
              <div style={{ position: "relative", top: "-5px" }}>{"`Inline-kode"}</div>
            </Button>
          )
        }
      />
    </>
  );
};

interface TestButtonComponentProps {
  isON: boolean;
  icon: string;
  title: string;
  onButtonClick: (button: string) => void;
  buttonTitle: string;
  shortcutKey: string;
  style: Record<string, string>;
  imageurl: string;
}

export const TestButtonComponent: FC<TestButtonComponentProps> = ({
  isON,
  icon,
  title,
  onButtonClick,
  buttonTitle,
  shortcutKey,
  style,
  imageurl,
}) => {
  return RenderButton(title, shortcutKey, icon, isON, onButtonClick, buttonTitle, imageurl, style);
};

const RenderButton = (
  title: string,
  shortcutKey: string,
  icon: string,
  isON: boolean,
  onButtonClick: (buttonTitle: string) => void,
  buttonTitle: string,
  imageurl: string,
  style: Record<string, string>
) => {
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
              onClick={() => onButtonClick(buttonTitle)}
            />
          ) : (
            <Button
              style={isON ? { ...style, background: "#bbb" } : style}
              className="CPButton"
              size="tiny"
              onClick={() => onButtonClick(buttonTitle)}
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
