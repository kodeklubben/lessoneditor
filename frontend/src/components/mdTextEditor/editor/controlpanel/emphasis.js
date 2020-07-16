const emphasis = (
  isOn,
  inputText,
  cursorPositionStart,
  cursorPositionEnd,
  output,
  cursorIntON,
  cursorIntOFF,
  setChanges
) => {
  if (!isOn) {
    console.log("på");

    inputText =
      inputText.slice(0, cursorPositionStart) +
      output +
      inputText.slice(cursorPositionStart);

    return {
      inputText,
      cursorPositionStart: cursorPositionStart + cursorIntON,
      cursorPositionEnd: cursorPositionStart + cursorIntON,
    };
  } else if (isOn) {
    console.log("av");

    return {
      inputText,
      cursorPositionStart: cursorPositionStart + cursorIntOFF,
      cursorPositionEnd: cursorPositionEnd + cursorIntOFF,
    };
  } else {
    return;
  }
};

export { emphasis };
