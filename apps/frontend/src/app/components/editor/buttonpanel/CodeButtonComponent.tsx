import { Button, Popup } from "semantic-ui-react";
import { FC } from "react";

interface CodeButtonComponentProps {
  buttonValues: Record<string, boolean>;
  title: string;
  onButtonClick: (button: string) => void;
  buttonTitle: string;
  shortcutKey: string;
  style: Record<string, string>;
  courseTitle: string;
}

const CodeButtonComponent: FC<CodeButtonComponentProps> = ({
  buttonValues,
  title,
  onButtonClick,
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
              style={buttonValues[buttonTitle] ? { ...style, backgroundColor: "#bbb" } : style}
              className="CPButton"
              size="tiny"
              onClick={() => onButtonClick(buttonTitle)}
            >
              <div style={{ position: "relative", top: "-5px" }}>
                {"```Kodeblokk"}
                <span style={{ color: "#008000" }}>{'("' + courseTitle + '")'}</span>
              </div>
            </Button>
          ) : (
            <Button
              style={buttonValues[buttonTitle] ? { ...style, backgroundColor: "#bbb" } : style}
              className="CPButton"
              size="tiny"
              onClick={() => onButtonClick(buttonTitle)}
            >
              <div style={{ position: "relative", top: "-5px" }}>{"`Inline-kode"}</div>
            </Button>
          )
        }
      />
    </>
  );
};

export default CodeButtonComponent;
