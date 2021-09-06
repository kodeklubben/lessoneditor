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
  const { setHeaderData } = useFileContext();

  let textInput: Input | null = null;

  const handleClick = (event: any) => {
    if (inputValue && !inputArray.includes(inputValue)) {
      let i = event.target.name + "List";
      let temp = { [i]: [...inputArray, inputValue] };
      multiInputHandler(temp, event.target.name);
      inputOrder += 1;

      // @ts-ignore
      textInput.focus();
    }
  };

  const multiInputHandler = (object: { [s: string]: unknown } | ArrayLike<unknown>, name: any) => {
    const key = Object.keys(object)[0];
    const value = Object.values(object)[0];
    if (setHeaderData) {
      setHeaderData((prevState) => ({ ...prevState, [key]: value }));
      setHeaderData((prevState) => ({ ...prevState, [name]: "" }));
    }
  };

  const onBlur = (event: any) => {
    handleClick(event);
  };

  const inputClick = () => {
    // @ts-ignore
    textInput.focus();
  };

  const removeClickHandler = (name: string, value: any) => {
    let i = name + "List";
    let tempArray = inputArray;
    let index = inputArray.indexOf(value);
    tempArray.splice(index, 1);
    let temp = { [i]: tempArray };
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
            onKeyUp={(e: any) => (e.key === "Enter" ? handleClick(e) : "")}
            onBlur={(e: any) => onBlur(e)}
            fluid
          />
        </div>

        <Button.Group>
          {inputArray.map((element: {} | null | undefined, index: number) => (
            <Button
              basic
              icon="x"
              floated="right"
              content={element}
              style={{ order: inputOrder - 1 }}
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
