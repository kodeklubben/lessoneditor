import ButtonComponent from "./MicroScratchButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import { buttonAction as codeAction, cancelButton } from "./utils/buttonMethods";

import {
  KEY_COMBINATIONS_SCRATCH as KEY,
  scratchbuttons as config
} from "../settingsFiles/microbitAndScratchButtonConfig";
import { FC } from "react";

let results;
let cancelResults;
let buttonTitle: string;

const ScratchButtons: FC<any> = ({
                                   editorRef,
                                   cursorPositionStart,
                                   cursorPositionEnd,
                                   mdText,
                                   buttonValues,
                                   setMdText,
                                   setCursorPosition,
                                   setCursor,
                                   setButtonValues
                                 }) => {
  const setChanges = (
    mdText: any,
    cursorPositionStart: any,
    cursorPositionEnd: any
  ) => {
    setCursor(cursorPositionStart, cursorPositionEnd);
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    setMdText(mdText);
  };

  const setButton = (value: string) => {
    setButtonValues((prevButtonValues: any) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value]
    }));
  };

  const setCode = (
    butonTitle: any,
    cursorIntON: any,
    cursorIntOFF: any,
    output: any
  ) => {
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
      results?.mdText,
      results?.cursorPositionStart,
      results?.cursorPositionEnd
    );
  };

  const set = {
    motion: () => {
      buttonTitle = config.motion.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.motion.cursorIntON,
        config.motion.cursorIntOFF,
        config.motion.output
      );
    },
    looks: () => {
      buttonTitle = config.looks.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.looks.cursorIntON,
        config.looks.cursorIntOFF,
        config.looks.output
      );
    },
    sound: () => {
      buttonTitle = config.sound.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.sound.cursorIntON,
        config.sound.cursorIntOFF,
        config.sound.output
      );
    },
    pen: () => {
      buttonTitle = config.pen.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.pen.cursorIntON,
        config.pen.cursorIntOFF,
        config.pen.output
      );
    },
    data: () => {
      buttonTitle = config.data.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.data.cursorIntON,
        config.data.cursorIntOFF,
        config.data.output
      );
    },
    events: () => {
      buttonTitle = config.events.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.events.cursorIntON,
        config.events.cursorIntOFF,
        config.events.output
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
    sensing: () => {
      buttonTitle = config.sensing.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.sensing.cursorIntON,
        config.sensing.cursorIntOFF,
        config.sensing.output
      );
    },
    operators: () => {
      buttonTitle = config.operators.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.operators.cursorIntON,
        config.operators.cursorIntOFF,
        config.operators.output
      );
    },
    moreblocks: () => {
      buttonTitle = config.moreblocks.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.moreblocks.cursorIntON,
        config.moreblocks.cursorIntOFF,
        config.moreblocks.output
      );
    }
  };

  useHotkeys(
    `${KEY.motion}, ${KEY.looks}, ${KEY.sound}, ${KEY.pen}, ` +
    `${KEY.data}, ${KEY.events}, ${KEY.control}, ${KEY.sensing}, ` +
    `${KEY.operators}, ${KEY.moreblocks}`,
    (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case KEY.motion:
          set.motion();
          break;
        case KEY.looks:
          set.looks();
          break;
        case KEY.sound:
          set.sound();
          break;
        case KEY.pen:
          set.pen();
          break;
        case KEY.data:
          set.data();
          break;
        case KEY.events:
          set.events();
          break;
        case KEY.control:
          set.control();
          break;
        case KEY.sensing:
          set.sensing();
          break;
        case KEY.operators:
          set.operators();
          break;
        case KEY.moreblocks:
          set.moreblocks();
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [setButton, setCode]
  );

  const handleButtonClick = (button: string | number) => {
    editorRef.current.focus();

    setButtonValues((prevState: any) => ({
      ...prevState,
      // @ts-ignore
      [button]: !button[button]
    }));
    switch (button) {
      case config.motion.buttonTitle:
        set.motion();
        break;
      case config.looks.buttonTitle:
        set.looks();
        break;
      case config.sound.buttonTitle:
        set.sound();
        break;
      case config.pen.buttonTitle:
        set.pen();
        break;
      case config.data.buttonTitle:
        set.data();
        break;
      case config.events.buttonTitle:
        set.events();
        break;
      case config.control.buttonTitle:
        set.control();
        break;
      case config.sensing.buttonTitle:
        set.sensing();
        break;
      case config.operators.buttonTitle:
        set.operators();
        break;
      case config.moreblocks.buttonTitle:
        set.moreblocks();
        break;
      default:
        break;
    }
  };
  return (
    <>
      {Object.entries(config).map((element, index) => (
        <ButtonComponent
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

export default ScratchButtons;
