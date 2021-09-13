import { emphasis, lists, sections, SECTION_TEXT } from "../settings/buttonConfig";

const ifNewLine = (mdText: string, cursorPositionStart: number) => {
  return mdText[cursorPositionStart - 1] === "\n" || cursorPositionStart === 0;
};

const isEmphasis = (output: string) => {
  return (
    output === emphasis.bold.output ||
    output === emphasis.italic.output ||
    output === emphasis.strikethrough.output
  );
};

const isListOrSection = (output: string) => {
  return (
    output === lists.listCheck.output ||
    output === lists.listOl.output ||
    output === lists.listUl.output ||
    output == sections.activity.output ||
    output == sections.intro.output ||
    output == sections.check.output ||
    output == sections.challenge.output ||
    output == sections.protip.output ||
    output == sections.flag.output ||
    output == sections.try.output ||
    output == sections.save.output
  );
};

const trimTextAndUpdatePosition = (
  mdText: string,
  cursorPositionStart: number,
  cursorPositionEnd: number,
  output: string,
  cursorIntON: number
) => {
  let i = mdText.slice(cursorPositionStart, cursorPositionEnd);
  while (i[0] === " " || i[i.length - 1] === " " || i[0] === "\n" || i[i.length - 1] === "\n") {
    if (i[0] === " " || i[0] === "\n") {
      i = i.slice(1);
      cursorPositionStart += 1;
    }
    if (i[i.length - 1] === " " || i[i.length - 1] === "\n") {
      i = i.slice(0, i.length - 1);
      cursorPositionEnd -= 1;
    }
  }
  mdText =
    mdText.slice(0, cursorPositionStart) +
    output.slice(0, cursorIntON) +
    i +
    output.slice(cursorIntON + SECTION_TEXT.length) +
    mdText.slice(cursorPositionEnd);

  cursorPositionStart += cursorIntON;
  cursorPositionEnd = cursorPositionStart + i.length;

  return { mdText, cursorPositionStart, cursorPositionEnd };
};

export const buttonAction = (
  mdText: string,
  cursorPositionStart: number,
  cursorPositionEnd: number,
  cursorIntON: number,
  cursorIntOFF: number,
  output: string
) => {
  if (!ifNewLine(mdText, cursorPositionStart) && !isEmphasis(output)) {
    mdText = mdText.slice(0, cursorPositionStart) + "\n\n" + mdText.slice(cursorPositionStart);
    cursorPositionStart += 1;
    cursorPositionEnd += 1;

    buttonAction(mdText, cursorPositionStart, cursorPositionEnd, cursorIntON, cursorIntOFF, output);
  }
  if (cursorPositionStart !== cursorPositionEnd) {
    return trimTextAndUpdatePosition(
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      output,
      cursorIntON
    );
  }

  mdText = mdText.slice(0, cursorPositionStart) + output + mdText.slice(cursorPositionStart);

  cursorPositionStart += cursorIntON;
  cursorPositionEnd += cursorIntON + SECTION_TEXT.length;
  return {
    mdText,
    cursorPositionStart,
    cursorPositionEnd,
  };
};

export const onButtonClick = (
  isON: boolean,
  cursorIntON: number,
  cursorIntOFF: number,
  output: string,
  mdText: string,
  cursorPositionStart: number,
  cursorPositionEnd: number
) => {
  if (output === emphasis.heading.output) {
    const headingResults = heading(isON, mdText, cursorPositionStart, output);
    return { ...headingResults, cursorPositionEnd };
  }
  if (isON) {
    return cancelButton(mdText, cursorPositionStart, cursorPositionEnd, cursorIntON, output);
  } else {
    return buttonAction(
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );
  }
};

export const cancelButton = (
  mdText: string,
  cursorPositionStart: number,
  cursorPositionEnd: number,
  cursorIntON: number,
  output: string
) => {
  const selection = mdText.slice(cursorPositionStart, cursorPositionEnd);

  if (selection && selection !== SECTION_TEXT) {
    mdText =
      mdText.slice(0, cursorPositionStart - cursorIntON) +
      selection +
      mdText.slice(cursorPositionEnd + cursorIntON);
    cursorPositionStart -= cursorIntON;
    cursorPositionEnd -= cursorIntON;
  } else if (isListOrSection(output)) {
    mdText =
      mdText.slice(0, cursorPositionStart - (cursorIntON + 1)) +
      mdText.slice(cursorPositionStart - cursorIntON + (output.length + 1));
    cursorPositionStart -= cursorIntON + 1;
    cursorPositionEnd = cursorPositionStart;
  } else {
    mdText =
      mdText.slice(0, cursorPositionStart - cursorIntON) +
      mdText.slice(cursorPositionStart - cursorIntON + output.length);
    cursorPositionStart -= cursorIntON;
    cursorPositionEnd = cursorPositionStart;
  }

  return {
    mdText,
    cursorPositionStart,
    cursorPositionEnd,
  };
};

export const heading = (
  isOn: boolean,
  mdText: string,
  cursorPositionStart: number,
  output: string
) => {
  if (
    !ifNewLine(mdText, cursorPositionStart) &&
    !(
      mdText.slice(cursorPositionStart - 3, cursorPositionStart) === "## " ||
      mdText.slice(cursorPositionStart - 2, cursorPositionStart) === "# "
    )
  ) {
    mdText = mdText.slice(0, cursorPositionStart) + "\n\n" + mdText.slice(cursorPositionStart);
    cursorPositionStart += 1;
    heading(isOn, mdText, cursorPositionStart, output);
  }
  if (
    output === "## " &&
    mdText.slice(cursorPositionStart - 3, cursorPositionStart) === output &&
    isOn
  ) {
    mdText = mdText.slice(0, cursorPositionStart - 3) + "# " + mdText.slice(cursorPositionStart);
    cursorPositionStart -= 1;
    return { isOn, mdText, cursorPositionStart };
  } else if (output === "## " && !isOn) {
    isOn = !isOn;
    mdText = mdText.slice(0, cursorPositionStart) + output + mdText.slice(cursorPositionStart);
    cursorPositionStart += output.length;
    return { isOn, mdText, cursorPositionStart };
  } else if (output === "## " && isOn) {
    if (mdText.slice(cursorPositionStart - 2, cursorPositionStart) === "# ") {
      mdText = mdText.slice(0, cursorPositionStart - 2) + mdText.slice(cursorPositionStart);
      cursorPositionStart -= 2;
      isOn = !isOn;
      return { isOn, mdText, cursorPositionStart };
    } else {
      isOn = !isOn;
      return { isOn, mdText, cursorPositionStart };
    }
  } else {
    return { isOn, mdText, cursorPositionStart };
  }
};
