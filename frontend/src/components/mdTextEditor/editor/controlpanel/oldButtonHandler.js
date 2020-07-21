// Button press config method. Keyboard shortcuts also use method.
const handleButtonClick = (
  bTitle,
  output,
  cursorIntON,
  cursorIntOFF,
  endOutput
) => {
  // move focus to textarea after button click
  editorRef.current.focus();
  setCursorPosition(cursorPositionStart, cursorPositionStart);

  // remove all text in textarea and undo/redo variable
  if (bTitle === "new") {
    inputText = "";
    undo = [""];
    redo = [];
    setMdText(inputText);
    cursorPositionStart = cursorPositionEnd = 0;
    return;
  }

  // Load, save, undo, redo methods
  if (bTitle === "load") {
    inputText = storedTextValue;
    undo = [inputText];
    redo = [inputText];
    setMdText(inputText);
    setCursorPosition(inputText.length, inputText.length);
    return;
  }

  if (bTitle === "save") {
    storedTextValue = inputText;
    return;
  }

  if (bTitle === "undo") {
    let pos1 = undoCursorPosition.pop();
    let pos2 = pos1;
    if (undo.length <= 0) {
      return;
    }

    redo.push(inputText);
    redoCursorPosition.push(cursorPositionStart);

    inputText = undo.pop();
    setMdText(inputText);
    setCursorPosition(pos1, pos2);
    return;
  }

  if (bTitle === "redo") {
    let pos1 = redoCursorPosition.pop();
    let pos2 = pos1;
    if (redo.length <= 0) {
      return;
    }
    setUndo();
    inputText = redo.pop();
    setMdText(inputText);
    setCursorPosition(pos1, pos2);
    return;
  }

  // cancel button value if pressed second time without textinput
  if (
    !isButtonOn[bTitle] &&
    inputText.slice(
      cursorPositionStart - cursorIntON,
      cursorPositionStart - cursorIntON + output.length
    ) === output
  ) {
    isButtonOn[bTitle] = true;
    setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
    setUndo();
    inputText =
      inputText.slice(0, cursorPositionStart - cursorIntON) +
      inputText.slice(cursorPositionStart - cursorIntON + output.length);
    setMdText(inputText);
    cursorPositionEnd = cursorPositionStart -= cursorIntON;
    setCursorPosition(cursorPositionStart, cursorPositionStart);
    return;
  }

  // make new line if some buttons ares pressed, and it is not allready new line
  if (
    bTitle.slice(0, 4) === "list" ||
    (bTitle.slice(0, 4) === "sec_" && isButtonOn[bTitle]) ||
    (bTitle === "codeblock" && isButtonOn["codeblock"]) ||
    (bTitle === "heading" && isButtonOn["heading"])
  ) {
    if (!ifNewLine()) {
      inputText =
        inputText.slice(0, cursorPositionStart) +
        "\n\n" +
        inputText.slice(cursorPositionStart);
      setMdText(inputText);
      cursorPositionStart += 2;
      cursorPositionEnd += 2;
      handleButtonClick(bTitle, output, cursorIntON, cursorIntOFF, endOutput);
      return;
    }
    // save list values to listButtonValues
    // to make list work with "enter-key" in onTextareaKeyDown --> "enter"
    if (bTitle.slice(0, 4) === "list") {
      listButtonValues = {
        bTitle: bTitle,
        output: output,
        cursorInt: cursorIntON,
      };
    }
  }

  // image button setting
  if (bTitle === "image") {
    uploadImageRef.current.click();
    return;
  }

  // Give heading button multiple values
  if (ifNewLine()) {
    if (
      output === "## " &&
      inputText.slice(cursorPositionStart - 3, cursorPositionStart) ===
        output &&
      isButtonOn[bTitle]
    ) {
      isButtonOn[bTitle] = false;
      setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
      setUndo();
      inputText =
        inputText.slice(0, cursorPositionStart - 3) +
        "# " +
        inputText.slice(cursorPositionStart);
      setMdText(inputText);
      cursorPositionStart -= 1;
      setCursorPosition(cursorPositionStart, cursorPositionStart);
      return;
    } else if (output === "## " && isButtonOn[bTitle]) {
      setUndo();
      inputText =
        inputText.slice(0, cursorPositionStart) +
        output +
        inputText.slice(cursorPositionStart);

      setMdText(inputText);
      cursorPositionStart += output.length;
      setCursorPosition(cursorPositionStart, cursorPositionStart);
      return;
    } else if (output === "## " && !isButtonOn[bTitle]) {
      if (
        inputText.slice(cursorPositionStart - 2, cursorPositionStart) === "# "
      ) {
        setUndo();
        inputText =
          inputText.slice(0, cursorPositionStart - 2) +
          inputText.slice(cursorPositionStart);
        setMdText(inputText);
        cursorPositionStart -= 2;
        setCursorPosition(cursorPositionStart, cursorPositionStart);
        isButtonOn[bTitle] = true;
        setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
        return;
      } else {
        isButtonOn[bTitle] = true;
        setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
        return;
      }
    }
  }

  // insert section text
  if (bTitle.slice(0, 4) === "sec_" && isButtonOn[bTitle]) {
    isButtonOn[bTitle] = false;
    setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
    setUndo();
    inputText =
      inputText.slice(0, cursorPositionStart) +
      output +
      inputText.slice(cursorPositionStart);
    setMdText(inputText);
    if (output.slice(0, 2) === "##" && bTitle !== "sec_tip") {
      cursorPositionStart += 3;
      cursorPositionEnd += SECTION_TEXT.length + 3;
    }
    // else if (
    //   bTitle === "sec_tip" ||
    //   bTitle === "sec_protip" ||
    //   bTitle === "sec_challenge"
    // ) {
    //   cursorPositionStart += cursorIntOFF;
    //   cursorPositionEnd += cursorIntOFF;
    // }
    else if (bTitle === "sec_tip") {
      cursorPositionStart += cursorIntON;
      cursorPositionEnd += cursorIntOFF;
    } else {
      cursorPositionStart += 2;
      cursorPositionEnd += SECTION_TEXT.length + 2;
    }
    setCursorPosition(cursorPositionStart, cursorPositionEnd);
    return;
  }

  //  Button config to insert markdown syntax on button press
  // Config values can be find in :
  // ./settingsFile/buttonConfig.js
  if (isButtonOn[bTitle]) {
    if (cursorPositionStart !== cursorPositionEnd) {
      isButtonOn[bTitle] = false;
      setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
      let i = inputText.slice(cursorPositionStart, cursorPositionEnd);

      // if text is selected with " " it need to be removed before insert markdown syntax
      // and update cursorPosition at the same time
      while (
        i[0] === " " ||
        i[i.length - 1] === " " ||
        i[0] === "\n" ||
        i[i.length - 1] === "\n"
      ) {
        if (i[0] === " " || i[0] === "\n") {
          i = i.slice(1);
          cursorPositionStart += 1;
        }
        if (i[i.length - 1] === " " || i[i.length - 1] === "\n") {
          i = i.slice(0, i.length - 1);
          cursorPositionEnd -= 1;
        }
      }
      setCursorPosition(cursorPositionStart, cursorPositionEnd);
      setUndo();
      inputText =
        inputText.slice(0, cursorPositionStart) +
        output.slice(0, cursorIntON) +
        i +
        output.slice(cursorIntON) +
        inputText.slice(cursorPositionEnd);
      setMdText(inputText);
      setCursorPosition(
        cursorPositionStart + cursorIntON,
        cursorPositionEnd + cursorIntON
      );
      return;
    }
    isButtonOn[bTitle] = false;
    setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));

    inputText =
      inputText.slice(0, cursorPositionStart) +
      output +
      inputText.slice(cursorPositionStart);
    setMdText(inputText);
    setUndo();
    setCursorPosition(
      cursorPositionStart + cursorIntON,
      cursorPositionStart + cursorIntON
    );
    return;
  } else if (!isButtonOn[bTitle]) {
    if (cursorPositionStart !== cursorPositionEnd) {
      isButtonOn[bTitle] = true;
      setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
      inputText = undo[undo.length - 1];
      setMdText(inputText);
      setCursorPosition(
        cursorPositionStart - cursorIntON,
        cursorPositionEnd - cursorIntON
      );
      return;
    }
    isButtonOn[bTitle] = true;
    setState((prevState) => ({ ...prevState, buttonValues: isButtonOn }));
    setCursorPosition(
      cursorPositionStart + cursorIntOFF,
      cursorPositionEnd + cursorIntOFF
    );
    if (endOutput) {
      setUndo();
      inputText =
        inputText.slice(0, cursorPositionStart + cursorIntOFF) +
        endOutput +
        inputText.slice(cursorPositionStart + cursorIntOFF);
      setMdText(inputText);
      cursorPositionStart = cursorPositionEnd += cursorIntOFF;
      setCursorPosition(cursorPositionStart, cursorPositionEnd);
    }
    return;
  } else {
    return;
  }
};
