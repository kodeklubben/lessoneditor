import { Button, Header, Input } from "semantic-ui-react";
import { FC, SyntheticEvent } from "react";
import { useFileContext } from "../../../contexts/FileContext";

interface MultiInputProps {
  changeHandler: (event: SyntheticEvent, data: Record<string, string>) => void;
  name: string;
  title: string;
  inputArray: string[];
  inputValue: string;
  placeholder: string;
  required: string;
}

const MultiInput: FC<MultiInputProps> = ({
  changeHandler,
  name,
  title,
  inputArray = [],
  inputValue,
  placeholder,
  required,
}) => {
  let inputOrder = 1;
  const { setFileContextState } = useFileContext();

  let textInput: Input | null = null;

  const handleClick = (event: SyntheticEvent<HTMLButtonElement> | KeyboardEvent) => {
    if (inputValue && !inputArray.includes(inputValue)) {
      const i = name + "List";
      const temp = { [i]: [...inputArray, inputValue] };
      multiInputHandler(temp, name);
      inputOrder += 1;

      textInput ? textInput.focus() : "";
    }
  };

  const multiInputHandler = (
    object: { [s: string]: unknown } | ArrayLike<unknown>,
    name: string
  ) => {
    const key = Object.keys(object)[0];
    const value = Object.values(object)[0];
    if (setFileContextState) {
      setFileContextState((prevState) => ({
        ...prevState,
        headerData: { ...prevState.headerData, [key]: value, [name]: "" },
      }));
    }
  };

  const onBlur = (event: SyntheticEvent<HTMLButtonElement>) => {
    handleClick(event);
  };

  const inputClick = () => {
    textInput ? textInput.focus() : "";
  };

  const removeClickHandler = (name: string, value: string) => {
    const i = name + "List";
    const tempArray = inputArray;
    const index = inputArray.indexOf(value);
    tempArray.splice(index, 1);
    const temp = { [i]: tempArray };
    multiInputHandler(temp, name);

    inputOrder -= 1;
  };

  return (
    <>
      <Header as="h3">
        {title}
        <span className="labelTextSpan">{required}</span>
      </Header>
      <div className="inputField">
        <div
          style={{
            order: inputOrder,
            width: "100%",
          }}
        >
          <Input
            ref={(element) => (textInput = element)}
            autoComplete="off"
            type="text"
            name={name}
            placeholder={placeholder}
            value={inputValue}
            onClick={inputClick}
            onTouchStart={inputClick}
            onChange={changeHandler}
            onKeyUp={(e: KeyboardEvent) => (e.key === "Enter" ? handleClick(e) : "")}
            onBlur={(e: SyntheticEvent<HTMLButtonElement>) => onBlur(e)}
            fluid
          />
        </div>

        <Button.Group>
          {inputArray.map((element: string, index: number) => (
            <Button
              basic
              icon="x"
              floated="right"
              content={element}
              style={{ order: inputOrder - 1, height: "2.6em" }}
              id="removeNameButton"
              key={"button-" + index}
              onClick={() => removeClickHandler(name, element)}
            />
          ))}
        </Button.Group>
        <Button
          icon="plus"
          style={{
            order: inputOrder + 1,
            backgroundColor: "white",
          }}
          id="addNameButton"
          name={name}
          onClick={handleClick}
        />
      </div>
    </>
  );
};

export default MultiInput;
