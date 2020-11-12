import React from "react";

const MultiInput = ({
  changeHandler,
  multiInputHandler,
  name,
  title,
  inputArray = [],
  inputValue,
  placeholder,
  required,
  validateMessage,
}) => {
  let inputOrder = 1;

  let textInput = null;

  const handleClick = (event) => {
    if (inputValue && !inputArray.includes(inputValue)) {
      let i = event.target.name + "List";
      let temp = { [i]: [...inputArray, inputValue] };
      multiInputHandler(temp, event.target.name);
      inputOrder += 1;

      textInput.focus();
    }
  };

  const onBlur = (event) => {
    handleClick(event);
  };

  const inputClick = () => {
    textInput.focus();
  };

  const removeClickHandler = (name, value) => {
    let i = name + "List";
    let tempArray = inputArray;
    let index = inputArray.indexOf(value);
    tempArray.splice(index, 1);
    let temp = { [i]: tempArray };
    multiInputHandler(temp, name);

    inputOrder -= 1;
  };

  return (
    <div id="multiInputContainer" className="row">
      <h3 className="formLabel">
        {title}
        <span style={{ color: "grey" }} className="requiredText">
          {required}
        </span>
      </h3>
      <div className="inputField">
        <div
          style={{
            order: inputOrder,
            width: "100%",
          }}
        >
          <input
            ref={(element) => (textInput = element)}
            autoComplete="off"
            type="text"
            name={name}
            placeholder={placeholder}
            value={inputValue}
            onClick={inputClick}
            onTouchStart={inputClick}
            onChange={changeHandler}
            onKeyUp={(e) => (e.key === "Enter" ? handleClick(e) : "")}
            onBlur={(e) => onBlur(e)}
          />
        </div>

        {inputArray.map((element) => (
          <button
            className="ui right icon button"
            style={{ order: inputOrder - 1 }}
            id="removeNameButton"
            type="button"
            key={element}
            onClick={() => removeClickHandler(name, element)}
          >
            <span>
              {element} <i className="x icon"></i>
            </span>
          </button>
        ))}

        <button
          style={{
            order: inputOrder + 1,
            backgroundColor: "white",
          }}
          id="addNameButton"
          className="ui icon button"
          name={name}
          type="button"
          onClick={handleClick}
        >
          <i id="addNameButtonChild" className="plus icon" />
        </button>
      </div>
      {validateMessage ? (
        <div className="validateError">{validateMessage}</div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MultiInput;
