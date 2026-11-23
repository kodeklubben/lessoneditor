import { FC } from "react";
import { Button, Popup } from "semantic-ui-react";
import { shortcutLabel } from "../utils/buttonMethods";

interface RenderButtonsProps {
  isON: boolean;
  icon: string;
  title: string;
  handleButtonClick: (button: string) => void;
  buttonSlug: string;
  shortcutKey: string;
  style?: Record<string, string>;
  imageurl?: string;
  /** Only the CodeMirror editor greys out undo and redo when there is nothing to undo. */
  disabled?: boolean;
}

export const RenderButtons: FC<RenderButtonsProps> = ({
  isON,
  icon,
  title,
  handleButtonClick,
  buttonSlug,
  shortcutKey,
  style,
  imageurl,
  disabled,
}) => {
  const isTouchDevice = () => {
    return "ontouchstart" in document.documentElement;
  };
  return (
    <>
      <Popup
        // The text buttons insert a section («Lagre» is a section about saving the project, not
        // a save button). Their shortcuts stay ctrl on a Mac too: cmd+shift+c, a, i … belong to
        // the browser.
        content={`${icon ? "" : "Seksjon: "}${title} (${shortcutLabel(shortcutKey)})`}
        disabled={isTouchDevice()}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          icon ? (
            <Button
              style={
                isON
                  ? {
                      backgroundColor: "#bbb",
                    }
                  : {
                      backgroundColor: "rgba(0, 0, 0, 0)",
                    }
              }
              className="CPButton"
              size="huge"
              icon={icon}
              aria-label={title}
              disabled={disabled}
              onClick={() => handleButtonClick(buttonSlug)}
            />
          ) : (
            <Button
              style={isON ? { ...style, background: "#bbb" } : style}
              className="CPButton"
              size="tiny"
              onClick={() => handleButtonClick(buttonSlug)}
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
                    alt=""
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
