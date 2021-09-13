import { useHotkeys } from "react-hotkeys-hook";
import { onButtonClick } from "./utils/buttonMethods";
import { FC, ReactNode, RefObject } from "react";

interface ButtonControllerProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  mdText: string;
  buttonValues: Record<string, boolean>;
  cursorPositionStart: number;
  cursorPositionEnd: number;
  setMdText: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: (positionStart: number, positionEnd: number) => void;
  setCursor: (pos1: number, pos2: number) => void;
  setButtonValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  config: any;
  KEY: any;
  ButtonComponent: any;
  shortcut: any;
  bunnonTitle: any;
}

const ButtonController: FC<ButtonControllerProps> = ({
  editorRef,
  mdText,
  buttonValues,
  cursorPositionStart,
  cursorPositionEnd,
  setMdText,
  setCursorPosition,
  setCursor,
  setButtonValues,
  config,
  KEY,
  ButtonComponent,
  shortcut,
}) => {
  const shortcuts = Object.entries(config).map((item: any[]) => item[1].shortcut);

  const setChanges = (results: {
    mdText: string;
    cursorPositionStart: number;
    cursorPositionEnd: number;
  }) => {
    setCursor(results.cursorPositionStart, results.cursorPositionEnd);
    setCursorPosition(results.cursorPositionStart, results.cursorPositionEnd);
    setMdText(results.mdText);
  };

  const toggleButton = (value: string) => {
    setButtonValues((prevButtonValues: Record<string, boolean>) => ({
      ...prevButtonValues,
      [value]: !buttonValues[value],
    }));
  };

  const setButton = (isON: boolean, cursorIntON: number, cursorIntOFF: number, output: string) => {
    const results = onButtonClick(
      isON,
      cursorIntON,
      cursorIntOFF,
      output,
      mdText,
      cursorPositionStart,
      cursorPositionEnd
    );
    setChanges(results);
  };

  const set = Object.keys(config).reduce(
    (o: Record<string, () => void>, keys: string) =>
      Object.assign(o, {
        [keys]: () => {
          const buttonTitle = config[keys].buttonTitle;
          toggleButton(buttonTitle);
          setButton(
            buttonValues[buttonTitle],
            config[keys].cursorIntON,
            config[keys].cursorIntOFF,
            config[keys].output
          );
        },
      }),
    {}
  );

  useHotkeys(
    shortcut,
    (event, handler) => {
      event.preventDefault();
      const [key] = Object.keys(KEY).filter((item: string) => KEY[item] === handler.key);

      set[key]();

      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true },
    [toggleButton, setButton]
  );

  const handleButtonClick = (button: string) => {
    editorRef.current ? editorRef.current.focus() : "";
    set[button]();
  };

  return (
    <div>
      {Object.entries(config).map((element: any, index: number) => {
        return (
          <ButtonComponent
            key={"element" + index}
            buttonValues={buttonValues}
            title={element[1].title}
            onButtonClick={handleButtonClick}
            buttonTitle={element[1].buttonTitle}
            shortcutKey={element[1].shortcut}
            color={element[1].color}
            style={element[1].style}
            icon={element[1].icon}
            imageurl={element[1].imageurl}
            mdText={mdText}
            cursorPositionStart={cursorPositionStart}
            cursorPositionEnd={cursorPositionEnd}
          />
        );
      })}
    </div>
  );
};

export default ButtonController;
