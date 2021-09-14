import { FC } from "react";
import { Button, Popup } from "semantic-ui-react";

interface RenderCodeButtonsProps {
  isON: boolean;
  title: string;
  handleButtonClick: (button: string) => void;
  buttonTitle: string;
  shortcutKey: string;
  style: Record<string, string>;
  courseTitle: string;
}

export const RenderCodeButtons: FC<RenderCodeButtonsProps> = ({
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
