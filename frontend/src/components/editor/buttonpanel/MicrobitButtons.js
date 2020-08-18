import React from "react";
import ButtonComponent from "./MicroScratchButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import {
  buttonAction as codeAction,
  cancelButton,
} from "./utils/buttonMethods";

import {
  KEY_COMBINATIONS_MICROBIT as KEY,
  microbitbuttons as config,
} from "../settingsFiles/microbitAndScratchButtonConfig";

let results;
let cancelResults;
let buttonTitle;

const MicrobitButtons = ({
  editorRef,
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
}) => {
  const setChanges = (mdText, cursorPositionStart, cursorPositionEnd) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setButton = (value) => {
    setButtonValues((prevButtonValues) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value],
    }));
  };

  const setCode = (butonTitle, cursorIntON, cursorIntOFF, output) => {
    cancelResults = cancelButton(
      buttonValues[buttonTitle],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      output
    );
    if (cancelResults.cancel) {
      setChanges(
        cancelResults.mdText,
        cancelResults.cursorPositionStart,
        cancelResults.cursorPositionEnd
      );
      return;
    }
    results = codeAction(
      buttonValues[buttonTitle],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );

    setChanges(
      results.mdText,
      results.cursorPositionStart,
      results.cursorPositionEnd
    );
  };

  const set = {
    basic: () => {
      buttonTitle = config.basic.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.basic.cursorIntON,
        config.basic.cursorIntOFF,
        config.basic.output
      );
    },
    input: () => {
      buttonTitle = config.input.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.input.cursorIntON,
        config.input.cursorIntOFF,
        config.input.output
      );
    },
    music: () => {
      buttonTitle = config.music.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.music.cursorIntON,
        config.music.cursorIntOFF,
        config.music.output
      );
    },
    led: () => {
      buttonTitle = config.led.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.led.cursorIntON,
        config.led.cursorIntOFF,
        config.led.output
      );
    },
    radio: () => {
      buttonTitle = config.radio.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.radio.cursorIntON,
        config.radio.cursorIntOFF,
        config.radio.output
      );
    },
    loops: () => {
      buttonTitle = config.loops.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.loops.cursorIntON,
        config.loops.cursorIntOFF,
        config.loops.output
      );
    },
    logic: () => {
      buttonTitle = config.logic.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.logic.cursorIntON,
        config.logic.cursorIntOFF,
        config.logic.output
      );
    },
    variables: () => {
      buttonTitle = config.variables.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.variables.cursorIntON,
        config.variables.cursorIntOFF,
        config.variables.output
      );
    },
    math: () => {
      buttonTitle = config.math.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.math.cursorIntON,
        config.math.cursorIntOFF,
        config.math.output
      );
    },
    functions: () => {
      buttonTitle = config.functions.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.functions.cursorIntON,
        config.functions.cursorIntOFF,
        config.functions.output
      );
    },
    arrays: () => {
      buttonTitle = config.arrays.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.arrays.cursorIntON,
        config.arrays.cursorIntOFF,
        config.arrays.output
      );
    },
    text: () => {
      buttonTitle = config.text.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.text.cursorIntON,
        config.text.cursorIntOFF,
        config.text.output
      );
    },
    game: () => {
      buttonTitle = config.game.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.game.cursorIntON,
        config.game.cursorIntOFF,
        config.game.output
      );
    },
    images: () => {
      buttonTitle = config.images.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.images.cursorIntON,
        config.images.cursorIntOFF,
        config.images.output
      );
    },
    pins: () => {
      buttonTitle = config.pins.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.pins.cursorIntON,
        config.pins.cursorIntOFF,
        config.pins.output
      );
    },
    serial: () => {
      buttonTitle = config.serial.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.serial.cursorIntON,
        config.serial.cursorIntOFF,
        config.serial.output
      );
    },
    control: () => {
      buttonTitle = config.control.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.control.cursorIntON,
        config.control.cursorIntOFF,
        config.control.output
      );
    },
  };

  useHotkeys(
    `${KEY.basic}, ${KEY.input}, ${KEY.music}, ${KEY.led}, ` +
      `${KEY.radio}, ${KEY.loops}, ${KEY.logic}, ${KEY.variables}, ` +
      `${KEY.math}, ${KEY.functions}, ${KEY.arrays}, ${KEY.text}, ` +
      `${KEY.game}, ${KEY.images}, ${KEY.pins}, ${KEY.serial}, ${KEY.control}`,
    (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case KEY.basic:
          set.basic();
          break;
        case KEY.input:
          set.input();
          break;
        case KEY.music:
          set.music();
          break;
        case KEY.led:
          set.led();
          break;
        case KEY.radio:
          set.radio();
          break;
        case KEY.loops:
          set.loops();
          break;
        case KEY.logic:
          set.logic();
          break;
        case KEY.variables:
          set.variables();
          break;
        case KEY.math:
          set.math();
          break;
        case KEY.functions:
          set.functions();
          break;
        case KEY.arrays:
          set.arrays();
          break;
        case KEY.text:
          set.text();
          break;
        case KEY.game:
          set.game();
          break;
        case KEY.images:
          set.images();
          break;
        case KEY.pins:
          set.pins();
          break;
        case KEY.serial:
          set.serial();
          break;
        case KEY.control:
          set.control();
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: "TEXTAREA", keydown: true },
    [setButton, setCode]
  );

  const handleButtonClick = (button) => {
    editorRef.current.focus();
    setButtonValues((prevState) => ({
      ...prevState,
      [button]: !button[button],
    }));
    switch (button) {
      case config.basic.buttonTitle:
        set.basic();
        break;
      case config.input.buttonTitle:
        set.input();
        break;
      case config.music.buttonTitle:
        set.music();
        break;
      case config.led.buttonTitle:
        set.led();
        break;
      case config.radio.buttonTitle:
        set.radio();
        break;
      case config.loops.buttonTitle:
        set.loops();
        break;
      case config.logic.buttonTitle:
        set.logic();
        break;
      case config.variables.buttonTitle:
        set.variables();
        break;
      case config.math.buttonTitle:
        set.math();
        break;
      case config.functions.buttonTitle:
        set.functions();
        break;
      case config.arrays.buttonTitle:
        set.arrays();
        break;
      case config.text.buttonTitle:
        set.text();
        break;
      case config.game.buttonTitle:
        set.game();
        break;
      case config.images.buttonTitle:
        set.images();
        break;
      case config.pins.buttonTitle:
        set.pins();
        break;
      case config.serial.buttonTitle:
        set.serial();
        break;
      case config.control.buttonTitle:
        set.control();
        break;
      default:
        break;
    }
  };
  return (
    <>
      {Object.entries(config).map((element, index) => (
        <ButtonComponent
          id="test"
          buttonValues={buttonValues}
          key={"element" + index}
          buttonTitle={element[1].buttonTitle}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          shortcutKey={element[1].shortcut}
          color={element[1].color}
        />
      ))}
    </>
  );
};

export default MicrobitButtons;
