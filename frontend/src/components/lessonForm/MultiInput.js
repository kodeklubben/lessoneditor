import React from "react";

const MultiInput = props => {
    let inputOrder = 1;
    let removeNameButtonOrder = 0;
    let textInput = null;

    const handleClick = event => {
        if (props.inputValue && !props.inputArray.includes(props.inputValue)) {
            let i = event.target.name + "List";
            let temp = { [i]: [...props.inputArray, props.inputValue] };
            props.multiInputHandler(temp, event.target.name);
            inputOrder += 1;
            removeNameButtonOrder += 1;

            textInput.focus();
        }
    };

    const onBlur = e => {
        handleClick(e);
    };

    const inputClick = () => {
        textInput.focus();
    };

    const removeClickHandler = (name, value) => {
        let i = name + "List";
        let tempArray = props.inputArray;
        let index = props.inputArray.indexOf(value);
        tempArray.splice(index, 1);
        let temp = { [i]: tempArray };
        props.multiInputHandler(temp, name);

        inputOrder -= 1;
        removeNameButtonOrder -= 1;
    };

    return (
        <div id="multiInputContainer" className="row">
            <h3 className="formLabel">
                {props.title}
                <span className="requiredText"> {props.required}</span>
            </h3>
            <div className="inputField">
                <div
                    style={{
                        order: inputOrder,
                        width: "100%"
                    }}
                >
                    {props.autofocus ? (
                        <input
                            autoFocus
                            ref={element => (textInput = element)}
                            id="formInput"
                            autoComplete="off"
                            type="text"
                            name={props.name}
                            placeholder={props.placeholder}
                            value={props.inputValue}
                            onClick={inputClick}
                            onTouchStart={inputClick}
                            onChange={props.changeHandler}
                            onKeyUp={e =>
                                e.key === "Enter" ? handleClick(e) : ""
                            }
                            onBlur={e => onBlur(e)}
                        />
                    ) : (
                        <input
                            ref={element => (textInput = element)}
                            id="formInput"
                            autoComplete="off"
                            type="text"
                            name={props.name}
                            placeholder={props.placeholder}
                            value={props.inputValue}
                            onClick={inputClick}
                            onTouchStart={inputClick}
                            onChange={props.changeHandler}
                            onKeyUp={e =>
                                e.key === "Enter" ? handleClick(e) : ""
                            }
                            onBlur={e => onBlur(e)}
                        />
                    )}
                </div>

                {props.inputArray.map(element => (
                    <button
                        className="ui right icon button"
                        style={{ order: inputOrder - 1 }}
                        id="removeNameButton"
                        type="button"
                        key={element}
                        onClick={() => removeClickHandler(props.name, element)}
                    >
                        <span>
                            {element} <i className="x icon"></i>
                        </span>
                    </button>
                ))}

                <button
                    style={{
                        order: inputOrder + 1,
                        backgroundColor: "white"
                    }}
                    icon
                    id="addNameButton"
                    className="ui icon button"
                    name={props.name}
                    type="button"
                    onClick={handleClick}
                >
                    <i id="addNameButtonChild" className="plus icon" />
                </button>
            </div>
            {props.validateMessage ? (
                <div className="validateError">{props.validateMessage}</div>
            ) : (
                ""
            )}
        </div>
    );
};

export default MultiInput;
