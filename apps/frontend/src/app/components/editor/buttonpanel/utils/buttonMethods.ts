import { lists } from "../settings/buttonConfig";
import { SECTION_TEXT } from "../../settingsFiles/languages/editor_NO";

const ifNewLine = (mdText: string, cursorPositionStart: number) => {
  return (
    mdText[cursorPositionStart - 1] === "\n" ||
    mdText === "" ||
    cursorPositionStart === 0 ||
    mdText.slice(cursorPositionStart - 3, cursorPositionStart) === "## " ||
    mdText.slice(cursorPositionStart - 2, cursorPositionStart) === "# " ||
    mdText.slice(cursorPositionStart - 2, cursorPositionStart) === "- " ||
    mdText.slice(cursorPositionStart - 3, cursorPositionStart) === "1. " ||
    mdText.slice(cursorPositionStart - 6, cursorPositionStart) === `- [ ] `
  );
};

export const buttonAction = (
  isOn: boolean,
  mdText: string,
  cursorPositionStart: number,
  cursorPositionEnd: number,
  cursorIntON: number,
  cursorIntOFF: number,
  output: string
) => {
  if (
    (output === lists.listUl.output ||
      output === lists.listOl.output ||
      output === lists.listCheck.output) &&
    !ifNewLine(mdText, cursorPositionStart)
  ) {
    mdText = mdText.slice(0, cursorPositionStart) + "\n\n" + mdText.slice(cursorPositionStart);
    cursorPositionStart += 1;
    cursorPositionEnd += 1;

    buttonAction(
      isOn,
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      output
    );
  }
  if (cursorPositionStart !== cursorPositionEnd) {
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

export const cancelButton = (
  isOn: boolean,
  mdText: string,
  cursorPositionStart: number,
  cursorPositionEnd: number,
  cursorIntON: number,
  output: string
) => {
  const getPureMDFromOutput = output.replace(SECTION_TEXT, "");
  const isListInMD = mdText
    .slice(cursorPositionStart - cursorIntON, cursorPositionEnd)
    .includes(getPureMDFromOutput);

  const words = mdText.slice(cursorPositionStart, cursorPositionEnd);
  console.log(words);
  if (isOn) {
    mdText =
      mdText.slice(0, cursorPositionStart - cursorIntON) +
      words +
      mdText.slice(cursorPositionEnd + (isListInMD ? 0 : cursorIntON));
    cursorPositionStart -= cursorIntON;
    words === "" ? (cursorPositionEnd = cursorPositionStart) : (cursorPositionEnd -= cursorIntON);

    return {
      cancel: true,
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
    };
  } else {
    return {
      cancel: false,
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
    };
  }
};

export const heading = (
  isOn: boolean,
  mdText: string,
  cursorPositionStart: number,
  output: string
) => {
  if (!ifNewLine(mdText, cursorPositionStart)) {
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

export const insertSection = (
  isOn: boolean,
  button: string,
  mdText: string,
  output: string,
  cursorPositionStart: number,
  cursorPositionEnd: number,
  cursorIntON: number,
  cursorIntOFF: number,
  sectionText: string
) => {
  if (!ifNewLine(mdText, cursorPositionStart) && !isOn) {
    mdText = mdText.slice(0, cursorPositionStart) + "\n" + mdText.slice(cursorPositionStart);
    cursorPositionStart += 1;
    cursorPositionEnd += 1;
    insertSection(
      isOn,
      button,
      mdText,
      output,
      cursorPositionStart,
      cursorPositionEnd,
      cursorIntON,
      cursorIntOFF,
      sectionText
    );
  }
  if (!isOn) {
    if (cursorPositionStart !== cursorPositionEnd) {
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
    }
    mdText = mdText.slice(0, cursorPositionStart) + output + mdText.slice(cursorPositionStart);
    if (output.slice(0, 2) === "##" && button !== "sec_tip") {
      cursorPositionStart += 3;
      cursorPositionEnd += sectionText.length + 3;
    } else if (button === "sec_tip") {
      cursorPositionStart += cursorIntON;
      cursorPositionEnd += cursorIntOFF + sectionText.length;
    } else {
      cursorPositionStart += 2;
      cursorPositionEnd += sectionText.length + 2;
    }
    return { mdText, cursorPositionStart, cursorPositionEnd };
  } else if (isOn) {
    if (cursorPositionStart !== cursorPositionEnd) {
      mdText =
        mdText.slice(0, cursorPositionStart - cursorIntON) +
        mdText.slice(cursorPositionStart, cursorPositionEnd) +
        mdText.slice(cursorPositionEnd + cursorIntOFF);

      cursorPositionStart -= cursorIntON;
      cursorPositionEnd -= cursorIntON;

      return { mdText, cursorPositionStart, cursorPositionEnd };
    }
    cursorPositionStart += cursorIntOFF;
    cursorPositionEnd += cursorIntOFF;

    return { mdText, cursorPositionStart, cursorPositionEnd };
  }

  return { mdText, cursorPositionStart, cursorPositionEnd };
};
