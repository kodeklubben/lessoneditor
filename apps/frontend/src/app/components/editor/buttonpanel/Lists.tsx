import ButtonComponent from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import { buttonAction as listsAction, cancelButton } from "./utils/buttonMethods";

import { KEY_COMBINATIONS as KEY, lists as config } from "./settings/buttonConfig";
import { FC, RefObject } from "react";

interface ListsProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  mdText: string;
  buttonValues: Record<string, boolean>;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setListButtonValues: React.Dispatch<
    React.SetStateAction<{ bTitle: string; output: string; cursorInt: number }>
  >;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const Lists: FC<ListsProps> = ({
  editorRef,
  cursorPositionStart,
  cursorPositionEnd,
  mdText,
  buttonValues,
  setMdText,
  setCursorPosition,
  setCursor,
  setListButtonValues,
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

  const setList = (button: string, cursorIntON: number, cursorIntOFF: number, output: string) => {
    const cancelResults = cancelButton(
      buttonValues[button],
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

    const results = listsAction(
      buttonValues[button],
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );

    setChanges(results?.mdText, results?.cursorPositionStart, results?.cursorPositionEnd);
  };

  const set = {
    listUl: () => {
      const buttonTitle = config.listUl.buttonTitle;
      setButton(buttonTitle);
      setListButtonValues({
        bTitle: buttonTitle,
        output: config.listUl.outputOnEnter,
        cursorInt: config.listUl.cursorIntON,
      });
      setList(
        buttonTitle,
        config.listUl.cursorIntON,
        config.listUl.cursorIntOFF,
        config.listUl.output
      );
    },
    listOl: () => {
      const buttonTitle = config.listOl.buttonTitle;
      setButton(buttonTitle);
      setListButtonValues({
        bTitle: buttonTitle,
        output: config.listOl.outputOnEnter,
        cursorInt: config.listOl.cursorIntON,
      });
      setList(
        buttonTitle,
        config.listOl.cursorIntON,
        config.listOl.cursorIntOFF,
        config.listOl.output
      );
    },
    listCheck: () => {
      const buttonTitle = config.listCheck.buttonTitle;
      setButton(buttonTitle);
      setListButtonValues({
        bTitle: buttonTitle,
        output: config.listCheck.outputOnEnter,
        cursorInt: config.listCheck.cursorIntON,
      });
      setList(
        buttonTitle,
        config.listCheck.cursorIntON,
        config.listCheck.cursorIntOFF,
        config.listCheck.output
      );
    },
  };

  useHotkeys(
    `${KEY.listul}, ${KEY.listol}, ${KEY.listcheck}`,
    (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case KEY.listul:
          set.listUl();
          break;
        case KEY.listol:
          set.listOl();
          break;
        case KEY.listcheck:
          set.listCheck();
          break;
        default:
          break;
      }
      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [setButton, setListButtonValues, setList]
  );

  const handleButtonClick = (button: string | number) => {
    editorRef.current ? editorRef.current.focus() : "";
    setButtonValues((prevState) => ({
      ...prevState,
      [button]: !buttonValues[button],
    }));
    switch (button) {
      case config.listUl.buttonTitle:
        set.listUl();
        break;
      case config.listOl.buttonTitle:
        set.listOl();
        break;
      case config.listCheck.buttonTitle:
        set.listCheck();
        break;
      default:
        break;
    }
  };
  return (
    <div>
      {Object.entries(config).map((element, index) => (
        <ButtonComponent
          key={"element" + index}
          buttonValues={buttonValues}
          icon={element[1].icon}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
          style={{}}
          imageurl=""
        />
      ))}
    </div>
  );
};

export default Lists;
