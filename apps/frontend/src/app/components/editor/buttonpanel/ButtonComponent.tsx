import React, { FC } from "react";
import { Button, Popup } from "semantic-ui-react";

const ButtonComponent: FC<any> = ({
                                    buttonValues,
                                    icon,
                                    title,
                                    onButtonClick,
                                    buttonTitle,
                                    shortcutKey,
                                    style,
                                    imageurl
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
                      marginTop: "0.3em",
                      paddingTop: "0.25em",
                      paddingBottom: "0.25em",
                      borderRadius: "10px",
                      backgroundColor: "#bbb"
                    }
                    : {
                      marginTop: "0.3em",
                      paddingTop: "0.25em",
                      paddingBottom: "0.75em",
                      borderRadius: "10px",
                      backgroundColor: "rgba(0, 0, 0, 0)"
                    }
                }
                className="CPButton"
                size="huge"
                icon={icon}
                onClick={() => onButtonClick(buttonTitle)}
              />
            ) : (
              <Button
                style={
                  buttonValues[buttonTitle]
                    ? { ...style, background: "#bbb" }
                    : style
                }
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
                        margin: "-4px"
                      }}
                      src={imageurl}
                      alt="test"
                    />
                    <div
                      style={{
                        position: "relative",
                        top: "-5px",
                        margin: "0.5em",
                        display: "inline"
                      }}
                    >
                      {title}
                    </div>
                  </span>
                ) : (
                  <div style={{ position: "relative", top: "-5px" }}>
                    {title}
                  </div>
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

export default ButtonComponent;
