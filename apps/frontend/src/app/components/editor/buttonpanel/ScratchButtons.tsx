import { MicroScratchButtonComponent } from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import { onButtonClick } from "./utils/buttonMethods";

import {
  KEY_COMBINATIONS_SCRATCH as KEY,
  scratchbuttons as config,
} from "../settingsFiles/microbitAndScratchButtonConfig";
import { FC, RefObject } from "react";

interface ScratchButtonsProps {
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

const ScratchButtons: FC<ScratchButtonsProps> = ({
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
    const results = onButtonClick(
      buttonValues[buttonTitle],
      cursorIntON,
      cursorIntOFF,
      output,
      mdText,
      cursorPositionStart,
      cursorPositionEnd
    );

    setChanges(
      results.data.mdText,
      results.data.cursorPositionStart,
      results.data.cursorPositionEnd
    );
  };

  const set = {
    motion: () => {
      const buttonTitle = config.motion.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.motion.cursorIntON,
        config.motion.cursorIntOFF,
        config.motion.output
      );
    },
    looks: () => {
      const buttonTitle = config.looks.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.looks.cursorIntON,
        config.looks.cursorIntOFF,
        config.looks.output
      );
    },
    sound: () => {
      const buttonTitle = config.sound.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.sound.cursorIntON,
        config.sound.cursorIntOFF,
        config.sound.output
      );
    },
    pen: () => {
      const buttonTitle = config.pen.buttonTitle;
      setButton(buttonTitle);
      setCode(buttonTitle, config.pen.cursorIntON, config.pen.cursorIntOFF, config.pen.output);
    },
    data: () => {
      const buttonTitle = config.data.buttonTitle;
      setButton(buttonTitle);
      setCode(buttonTitle, config.data.cursorIntON, config.data.cursorIntOFF, config.data.output);
    },
    events: () => {
      const buttonTitle = config.events.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.events.cursorIntON,
        config.events.cursorIntOFF,
        config.events.output
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
    sensing: () => {
      const buttonTitle = config.sensing.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.sensing.cursorIntON,
        config.sensing.cursorIntOFF,
        config.sensing.output
      );
    },
    operators: () => {
      const buttonTitle = config.operators.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.operators.cursorIntON,
        config.operators.cursorIntOFF,
        config.operators.output
      );
    },
    moreblocks: () => {
      const buttonTitle = config.moreblocks.buttonTitle;
      setButton(buttonTitle);
      setCode(
        buttonTitle,
        config.moreblocks.cursorIntON,
        config.moreblocks.cursorIntOFF,
        config.moreblocks.output
      );
    },
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
    editorRef.current ? editorRef.current.focus() : "";

    setButtonValues((prevState) => ({
      ...prevState,

      [button]: !prevState[button],
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
        <MicroScratchButtonComponent
          key={"element" + index}
          isON={buttonValues[element[1].buttonTitle]}
          title={element[1].title}
          handleClick={handleButtonClick}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
          color={element[1].color}
        />
      ))}
    </>
  );
};

export default ScratchButtons;
