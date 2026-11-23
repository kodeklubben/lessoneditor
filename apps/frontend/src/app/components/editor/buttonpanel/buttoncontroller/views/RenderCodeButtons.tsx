import { FC } from "react";
import { Button, Popup } from "semantic-ui-react";
import { shortcutLabel } from "../utils/buttonMethods";

interface RenderCodeButtonsProps {
  isON: boolean;
  title: string;
  handleButtonClick: (button: string) => void;
  buttonSlug: string;
  shortcutKey: string;
  style: Record<string, string>;
  courseTitle: string;
}

export const RenderCodeButtons: FC<RenderCodeButtonsProps> = ({
  title,
  shortcutKey,
  buttonSlug,
  isON,
  style,
  handleButtonClick,
  courseTitle,
}) => {
  const isTouchDevice = () => {
    return "ontouchstart" in document.documentElement;
  };
  return (
    <>
      <Popup
        content={title + " (" + shortcutLabel(shortcutKey) + ")"}
        disabled={isTouchDevice()}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          buttonSlug === "codeblock" ? (
            <Button
              style={isON ? { ...style, backgroundColor: "#bbb" } : style}
              className="CPButton"
              size="tiny"
              onClick={() => handleButtonClick(buttonSlug)}
              // The label shows the markdown; a screen reader should not read three backticks.
              aria-label={`Kodeblokk (${courseTitle})`}
            >
              <div style={{ position: "relative", top: "-5px" }} aria-hidden="true">
                {"```Kodeblokk"}
                <span style={{ color: "#008000" }}>{'("' + courseTitle + '")'}</span>
              </div>
            </Button>
          ) : (
            <Button
              style={isON ? { ...style, backgroundColor: "#bbb" } : style}
              className="CPButton"
              size="tiny"
              onClick={() => handleButtonClick(buttonSlug)}
              aria-label="Inline-kode"
            >
              <div style={{ position: "relative", top: "-5px" }} aria-hidden="true">
                {"`Inline-kode"}
              </div>
            </Button>
          )
        }
      />
    </>
  );
};
