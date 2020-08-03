import React, { useState, useEffect, useRef } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  let buttonPressTimer = "";
  let buttonPressTimer2 = "";
  let timeout = "";

  let smallScreen = useRef();

  useEffect(() => {
    if (window.innerWidth < 768) {
      smallScreen.current = true;
    } else if (window.innerWidth > 768) {
      smallScreen.current = false;
    }
  }, []);

  const handleButtonPress = () => {
    buttonPressTimer = setTimeout(() => setIsOpen(true), 500);
    buttonPressTimer2 = setTimeout(() => {
      handleOpen();
    }, 500);
  };

  const handleOpen = () => {
    timeout = setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const handleClose = () => {
    clearTimeout(buttonPressTimer);
    clearTimeout(buttonPressTimer2);
    clearTimeout(timeout);
  };

  const responsiveCP = () => {
    return smallScreen.current ? (
      <>
        <Popup
          content={title}
          inverted
          basic
          size="tiny"
          style={{}}
          open={isOpen}
          onOpen={handleOpen}
          onClose={handleClose}
          trigger={
            icon ? (
              <Button
                style={
                  buttonValues[buttonTitle]
                    ? { backgroundColor: "#a6c0a4" }
                    : { backgroundColor: "#b1daae" }
                }
                id="custom"
                size="big"
                className="CPButton"
                onTouchStart={handleButtonPress}
                onTouchEnd={handleClose}
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
                style={{ backgroundColor: "#b1daae" }}
                id="custom"
                size="big"
                className="CPButton"
                onTouchStart={handleButtonPress}
                onTouchEnd={handleClose}
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
                {title}
              </Button>
            )
          }
        />
      </>
    ) : (
      <>
        <Popup
          content={title + " (" + shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          inverted
          trigger={
            icon ? (
              <Button
                style={
                  buttonValues[buttonTitle]
                    ? {
                        borderRadius: "10px",
                        backgroundColor: "#a6c0a4",
                      }
                    : {
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                      }
                }
                id="custom"
                size="big"
                className="CPButton"
                onTouchStart={handleButtonPress}
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
                id="noIcon"
                className="CPButton"
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
                  <img
                    style={{
                      height: "20px",
                      display: "inline",
                      position: "relative",
                      top: "-0.3vh",
                    }}
                    src={imageurl}
                    alt="test"
                  />
                ) : (
                  ""
                )}
                {imageurl ? (
                  <span style={{ position: "relative", top: "-0.7vh" }}>
                    {title}
                  </span>
                ) : (
                  <span>{title}</span>
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
