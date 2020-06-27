import React, { useState, useEffect, useRef } from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

const Buttons = (props) => {
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
    return smallScreen ? (
      <>
        <Popup
          content={props.title}
          inverted
          basic
          size="tiny"
          style={{}}
          open={isOpen}
          onOpen={handleOpen}
          onClose={handleClose}
          trigger={
            props.icon ? (
              <Button
                id="custom"
                size="big"
                className="CPButton"
                onTouchStart={handleButtonPress}
                onTouchEnd={handleClose}
                onClick={() =>
                  props.onButtonClick(
                    props.bTitle,
                    props.output,
                    props.cursorIntON,
                    props.cursorIntOFF,
                    props.endOutput
                  )
                }
              >
                <Icon name={props.icon} />
              </Button>
            ) : (
              <Button
                id="custom"
                size="big"
                className="CPButton"
                onTouchStart={handleButtonPress}
                onTouchEnd={handleClose}
                onClick={() =>
                  props.onButtonClick(
                    props.bTitle,
                    props.output,
                    props.cursorIntON,
                    props.cursorIntOFF,
                    props.endOutput
                  )
                }
              >
                {props.title}
              </Button>
            )
          }
        />
      </>
    ) : (
      <>
        <Popup
          content={props.title + " (" + props.shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          inverted
          trigger={
            props.icon ? (
              <Button
                id="custom"
                size="big"
                className="CPButton"
                onTouchStart={handleButtonPress}
                onClick={() =>
                  props.onButtonClick(
                    props.bTitle,
                    props.output,
                    props.cursorIntON,
                    props.cursorIntOFF,
                    props.endOutput
                  )
                }
              >
                <Icon name={props.icon} />
              </Button>
            ) : (
              <Button
                id="custom"
                size="big"
                className="CPButton"
                onClick={() =>
                  props.onButtonClick(
                    props.bTitle,
                    props.output,
                    props.cursorIntON,
                    props.cursorIntOFF,
                    props.endOutput
                  )
                }
              >
                {props.title}
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
