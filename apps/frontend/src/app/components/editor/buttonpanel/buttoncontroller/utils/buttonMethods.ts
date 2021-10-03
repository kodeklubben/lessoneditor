import { emphasis, codebuttons, DEFAULT_TEXT } from "../settings/buttonConfig";
import { microbitbuttons, scratchbuttons } from "../settings/microbitAndScratchButtonConfig";

const ifNewLine = (mdText: string, cursorPositionStart: number) => {
  return mdText[cursorPositionStart - 1] === "\n" || cursorPositionStart === 0;
};

const doNotNeedNewLine = (output: string) => {
  return (
    Object.entries(emphasis).findIndex((item) => item[1].output === output) > -1 ||
    Object.entries(microbitbuttons).findIndex((item) => item[1].output === output) > -1 ||
    Object.entries(scratchbuttons).findIndex((item) => item[1].output === output) > -1 ||
    output === codebuttons.inline.output
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
    output.slice(cursorIntON + DEFAULT_TEXT.length) +
    mdText.slice(cursorPositionEnd);

  cursorPositionStart += cursorIntON;
  cursorPositionEnd = cursorPositionStart + i.length;

  return { mdText, cursorPositionStart, cursorPositionEnd };
};

export const buttonAction: (
  mdText: string,
  cursorPositionStart: number,
  cursorPositionEnd: number,
  cursorIntON: number,
  cursorIntOFF: number,
  output: string
) => { mdText: string; cursorPositionStart: number; cursorPositionEnd: number } = (
  mdText,
  cursorPositionStart,
  cursorPositionEnd,
  cursorIntON,
  cursorIntOFF,
  output
) => {
  if (!ifNewLine(mdText, cursorPositionStart) && !doNotNeedNewLine(output)) {
    mdText = mdText.slice(0, cursorPositionStart) + "\n\n" + mdText.slice(cursorPositionStart);
    cursorPositionStart += 1;
    cursorPositionEnd += 1;

    return buttonAction(
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );
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
  cursorPositionEnd += cursorIntON + DEFAULT_TEXT.length;
  return {
    mdText,
    cursorPositionStart,
    cursorPositionEnd,
  };
};

export const heading = (
  isON: boolean,
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
    heading(isON, mdText, cursorPositionStart, output);
  }

  if (isON) {
    if (mdText.slice(cursorPositionStart - 3, cursorPositionStart) === output) {
      mdText = mdText.slice(0, cursorPositionStart - 3) + "# " + mdText.slice(cursorPositionStart);
      cursorPositionStart -= 1;
      return { isON, mdText, cursorPositionStart };
    } else if (mdText.slice(cursorPositionStart - 2, cursorPositionStart) === "# ") {
      mdText = mdText.slice(0, cursorPositionStart - 2) + mdText.slice(cursorPositionStart);
      cursorPositionStart -= 2;
      isON = !isON;
      return { isON, mdText, cursorPositionStart };
    } else {
      isON = !isON;
      return { isON, mdText, cursorPositionStart };
    }
  } else {
    isON = !isON;
    mdText = mdText.slice(0, cursorPositionStart) + output + mdText.slice(cursorPositionStart);
    cursorPositionStart += output.length;
    return { isON, mdText, cursorPositionStart };
  }
};
