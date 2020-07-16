export const emphasis = (
  isOn,
  inputText,
  cursorPositionStart,
  cursorPositionEnd,
  output,
  cursorIntON,
  cursorIntOFF
) => {
  // cancel button value if pressed second time without textinput
  if (
    isOn &&
    inputText.slice(
      cursorPositionStart - cursorIntON,
      cursorPositionStart - cursorIntON + output.length
    ) === output
  ) {
    inputText =
      inputText.slice(0, cursorPositionStart - cursorIntON) +
      inputText.slice(cursorPositionStart - cursorIntON + output.length);
    cursorPositionEnd = cursorPositionStart -= cursorIntON;
    return { inputText, cursorPositionStart, cursorPositionEnd };
  }

  if (!isOn) {
    // if (cursorPositionStart !== cursorPositionEnd) {
    //   isButtonOn[bTitle] = false;
    //   setState(prevState => ({ ...prevState, buttonValues: isButtonOn }));
    //   let i = inputText.slice(cursorPositionStart, cursorPositionEnd);

    //   // if text is selected with " " it need to be removed before insert markdown syntax
    //   // and update cursorPosition at the same time
    //   while (
    //     i[0] === " " ||
    //     i[i.length - 1] === " " ||
    //     i[0] === "\n" ||
    //     i[i.length - 1] === "\n"
    //   ) {
    //     if (i[0] === " " || i[0] === "\n") {
    //       i = i.slice(1);
    //       cursorPositionStart += 1;
    //     }
    //     if (i[i.length - 1] === " " || i[i.length - 1] === "\n") {
    //       i = i.slice(0, i.length - 1);
    //       cursorPositionEnd -= 1;
    //     }
    //   }
    //   setCursorPosition(cursorPositionStart, cursorPositionEnd);
    //   setUndo();
    //   inputText =
    //     inputText.slice(0, cursorPositionStart) +
    //     output.slice(0, cursorIntON) +
    //     i +
    //     output.slice(cursorIntON) +
    //     inputText.slice(cursorPositionEnd);
    //   setMdText(inputText);
    //   setCursorPosition(
    //     cursorPositionStart + cursorIntON,
    //     cursorPositionEnd + cursorIntON
    //   );
    //   return;
    // }

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
    // if (cursorPositionStart !== cursorPositionEnd) {
    //   isButtonOn[bTitle] = true;
    //   setState(prevState => ({ ...prevState, buttonValues: isButtonOn }));
    //   inputText = undo[undo.length - 1];
    //   setMdText(inputText);
    //   setCursorPosition(
    //     cursorPositionStart - cursorIntON,
    //     cursorPositionEnd - cursorIntON
    //   );
    //   return;
    // }

    //   if (endOutput) {
    //     setUndo();
    //     inputText =
    //       inputText.slice(0, cursorPositionStart + cursorIntOFF) +
    //       endOutput +
    //       inputText.slice(cursorPositionStart + cursorIntOFF);
    //     setMdText(inputText);
    //     cursorPositionStart = cursorPositionEnd += cursorIntOFF;
    //     setCursorPosition(cursorPositionStart, cursorPositionEnd);
    //   }
    //   return;
    // } else {
    return {
      inputText,
      cursorPositionStart: cursorPositionStart + cursorIntOFF,
      cursorPositionEnd: cursorPositionEnd + cursorIntOFF,
    };
  }
};
