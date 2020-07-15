// detect new line and heading value
export const ifNewLine = (inputText, cursorPositionStart) => {
  return inputText[cursorPositionStart - 1] === "\n" ||
    inputText === "" ||
    cursorPositionStart === 0 ||
    inputText.slice(cursorPositionStart - 3, cursorPositionStart) === "## " ||
    inputText.slice(cursorPositionStart - 2, cursorPositionStart) === "# "
    ? true
    : false;
};
