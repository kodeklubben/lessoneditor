import React from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

const Buttons = ({
  buttonValues,
  icon,
  title,
  onButtonClick,
  buttonTitle,
  output,
  cursorIntON,
  cursorIntOFF,
  endOutput,
  shortcutKey,
  style,
  imageurl,
}) => {
  const responsiveCP = () => {
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
                  buttonValues[buttonTitle]
                    ? {
                        borderRadius: "10px",
                        backgroundColor: "#aaa",
                      }
                    : {
                        borderRadius: "10px",
                        backgroundColor: "rgba(0, 0, 0, 0)",
                      }
                }
                className="CPButton"
                size="big"
                onClick={() =>
                  onButtonClick(
                    buttonTitle,
                    output,
                    cursorIntON,
                    cursorIntOFF,
                    endOutput
                  )
                }
              >
                <Icon name={icon} />
              </Button>
            ) : (
              <Button
                style={style}
                className="CPButton"
                size="tiny"
                onClick={() =>
                  onButtonClick(
                    buttonTitle,
                    output,
                    cursorIntON,
                    cursorIntOFF,
                    endOutput
                  )
                }
              >
                {imageurl ? (
                  <span>
                    <img
                      style={{
                        height: "1.5em",
                        margin: "-4px",
                      }}
                      src={imageurl}
                      alt="test"
                    />
                    <div
                      style={{
                        margin: "0.5em",
                        display: "inline",
                      }}
                    >
                      {title}
                    </div>
                  </span>
                ) : (
                  <div>{title}</div>
                )}
              </Button>
            )
          }
        />
      </>
    );
  };

  return responsiveCP();
};

export default Buttons;
