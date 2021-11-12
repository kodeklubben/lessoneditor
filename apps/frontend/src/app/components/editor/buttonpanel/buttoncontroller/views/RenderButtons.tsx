import { FC } from "react";
import { Button, Popup } from "semantic-ui-react";

interface RenderButtonsProps {
  isON: boolean;
  icon: string;
  title: string;
  handleButtonClick: (button: string) => void;
  buttonSlug: string;
  shortcutKey: string;
  style?: Record<string, string>;
  imageurl?: string;
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
