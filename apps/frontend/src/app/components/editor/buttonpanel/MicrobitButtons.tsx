import MicroScratchButtonComponent from "./MicroScratchButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import { buttonAction as codeAction, cancelButton } from "./utils/buttonMethods";

import {
  KEY_COMBINATIONS_MICROBIT as KEY,
  microbitbuttons as config,
} from "../settingsFiles/microbitAndScratchButtonConfig";
import { FC, RefObject } from "react";

interface MicrobitButtonsProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  mdText: string;
  buttonValues: Record<string, boolean>;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const MicrobitButtons: FC<MicrobitButtonsProps> = ({
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
  const setChanges = (mdText: string, cursorPositionStart: number, cursorPositionEnd: number) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setButton = (value: string) => {
    setButtonValues((prevButtonValues) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value],
    }));
  };

  const setCode = (
    buttonTitle: string,
    cursorIntON: number,
    cursorIntOFF: number,
    output: string
  ) => {
    const cancelResults = cancelButton(
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
    const results = codeAction(
      buttonValues[buttonTitle],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );

    setChanges(results.mdText, results.cursorPositionStart, results.cursorPositionEnd);
  };

  const set = {
    basic: () => {
      const buttonTitle = config.basic.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.basic.cursorIntON,
        config.basic.cursorIntOFF,
        config.basic.output
      );
    },
    input: () => {
      const buttonTitle = config.input.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.input.cursorIntON,
        config.input.cursorIntOFF,
        config.input.output
      );
    },
    music: () => {
      const buttonTitle = config.music.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.music.cursorIntON,
        config.music.cursorIntOFF,
        config.music.output
      );
    },
    led: () => {
      const buttonTitle = config.led.buttonTitle;
      setButton(buttonTitle);
      setCode(buttonTitle, config.led.cursorIntON, config.led.cursorIntOFF, config.led.output);
    },
    radio: () => {
      const buttonTitle = config.radio.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.radio.cursorIntON,
        config.radio.cursorIntOFF,
        config.radio.output
      );
    },
    loops: () => {
      const buttonTitle = config.loops.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.loops.cursorIntON,
        config.loops.cursorIntOFF,
        config.loops.output
      );
    },
    logic: () => {
      const buttonTitle = config.logic.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.logic.cursorIntON,
        config.logic.cursorIntOFF,
        config.logic.output
      );
    },
    variables: () => {
      const buttonTitle = config.variables.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.variables.cursorIntON,
        config.variables.cursorIntOFF,
        config.variables.output
      );
    },
    math: () => {
      const buttonTitle = config.math.buttonTitle;
      setButton(buttonTitle);
      setCode(buttonTitle, config.math.cursorIntON, config.math.cursorIntOFF, config.math.output);
    },
    functions: () => {
      const buttonTitle = config.functions.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.functions.cursorIntON,
        config.functions.cursorIntOFF,
        config.functions.output
      );
    },
    arrays: () => {
      const buttonTitle = config.arrays.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.arrays.cursorIntON,
        config.arrays.cursorIntOFF,
        config.arrays.output
      );
    },
    text: () => {
      const buttonTitle = config.text.buttonTitle;
      setButton(buttonTitle);
      setCode(buttonTitle, config.text.cursorIntON, config.text.cursorIntOFF, config.text.output);
    },
    game: () => {
      const buttonTitle = config.game.buttonTitle;
      setButton(buttonTitle);
      setCode(buttonTitle, config.game.cursorIntON, config.game.cursorIntOFF, config.game.output);
    },
    images: () => {
      const buttonTitle = config.images.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.images.cursorIntON,
        config.images.cursorIntOFF,
        config.images.output
      );
    },
    pins: () => {
      const buttonTitle = config.pins.buttonTitle;
      setButton(buttonTitle);
      setCode(buttonTitle, config.pins.cursorIntON, config.pins.cursorIntOFF, config.pins.output);
    },
    serial: () => {
      const buttonTitle = config.serial.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.serial.cursorIntON,
        config.serial.cursorIntOFF,
        config.serial.output
      );
    },
    control: () => {
      const buttonTitle = config.control.buttonTitle;
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
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [setButton, setCode]
  );

  const handleButtonClick = (button: string) => {
    editorRef.current ? editorRef.current.focus() : "";

    setButtonValues((prevState) => ({
      ...prevState,
      [button]: !prevState[button],
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
        <MicroScratchButtonComponent
          key={"element" + index}
          buttonValues={buttonValues}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
          color={element[1].color}
        />
      ))}
    </>
  );
};

export default MicrobitButtons;
