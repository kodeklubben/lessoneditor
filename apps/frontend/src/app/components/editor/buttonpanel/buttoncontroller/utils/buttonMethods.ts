import { emphasis, codebuttons, DEFAULT_TEXT } from "../settings/buttonConfig";
import { microbitbuttons, scratchbuttons } from "../settings/microbitAndScratchButtonConfig";

type Result = { mdText: string; cursorPositionStart: number; cursorPositionEnd: number };

const ifNewLine = (mdText: string, cursorPositionStart: number) => {
  return mdText[cursorPositionStart - 1] === "\n" || cursorPositionStart === 0;
};

/** Inline buttons (bold, code, block colours …) go in the line, the rest on a line of their own. */
const doNotNeedNewLine = (output: string, placeholder: string) => {
  // The outputs are written with «Tekst her»; compare them as the text's language has them.
  const same = (candidate: string) => candidate.replaceAll(DEFAULT_TEXT, placeholder) === output;
  return (
    Object.values(emphasis).some((item) => same(item.output)) ||
    Object.values(microbitbuttons).some((item) => same(item.output)) ||
    Object.values(scratchbuttons).some((item) => same(item.output)) ||
    same(codebuttons.inline.output)
  );
};

/** True when position is inside a fenced code block (``` … ```). */
export const isInsideCodeBlock = (mdText: string, position: number) => {
  const fences = mdText.slice(0, position).match(/^```/gm);
  return (fences?.length ?? 0) % 2 === 1;
};

/** The shortcut as the user presses it: "mod" is Cmd on a Mac and Ctrl elsewhere. */
export const shortcutLabel = (shortcut: string) => {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return shortcut.replace(/\bmod\b/g, isMac ? "cmd" : "ctrl");
};

const trimTextAndUpdatePosition = (
  mdText: string,
  cursorPositionStart: number,
  cursorPositionEnd: number,
  output: string,
  cursorIntON: number,
  placeholder: string,
): Result => {
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
    output.slice(cursorIntON + placeholder.length) +
    mdText.slice(cursorPositionEnd);

  cursorPositionStart += cursorIntON;
  cursorPositionEnd = cursorPositionStart + i.length;

  return { mdText, cursorPositionStart, cursorPositionEnd };
};

/**
 * Removes inline markers (**, *, ~~, `) around the selection when they are already there, so a
 * second click on the same button undoes the first instead of adding a second pair.
 */
const unwrapInline = (
  mdText: string,
  start: number,
  end: number,
  output: string,
  cursorIntON: number,
  placeholder: string,
): Result | undefined => {
  const before = output.slice(0, cursorIntON);
  const after = output.slice(cursorIntON + placeholder.length);
  if (!before || !after) return undefined;
  // "*" next to "**" is part of the bold marker, not italic: count the whole run of that
  // character. A run of three is bold and italic, from which either can be removed.
  const marker = before[0];
  const single = [...before].every((c) => c === marker);
  let run = 0;
  while (single && mdText[start - 1 - run] === marker) run++;
  const ownRun = !single || run === before.length || (run === 3 && before.length < 3);
  if (
    ownRun &&
    mdText.slice(start - before.length, start) === before &&
    mdText.slice(end, end + after.length) === after
  ) {
    return {
      mdText:
        mdText.slice(0, start - before.length) +
        mdText.slice(start, end) +
        mdText.slice(end + after.length),
      cursorPositionStart: start - before.length,
      cursorPositionEnd: end - before.length,
    };
  }
  const selected = mdText.slice(start, end);
  if (
    selected.length >= before.length + after.length &&
    selected.startsWith(before) &&
    selected.endsWith(after)
  ) {
    const inner = selected.slice(before.length, selected.length - after.length);
    return {
      mdText: mdText.slice(0, start) + inner + mdText.slice(end),
      cursorPositionStart: start,
      cursorPositionEnd: start + inner.length,
    };
  }
  return undefined;
};

export const buttonAction = (
  mdText: string,
  cursorPositionStart: number,
  cursorPositionEnd: number,
  cursorIntON: number,
  _cursorIntOFF: number,
  output: string,
  /** The placeholder in `output`, in the text's language (9d). */
  placeholder: string = DEFAULT_TEXT,
): Result => {
  const inline = doNotNeedNewLine(output, placeholder);

  if (inline && cursorPositionStart !== cursorPositionEnd) {
    const unwrapped = unwrapInline(
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      output,
      cursorIntON,
      placeholder,
    );
    if (unwrapped) return unwrapped;
  }

  // A section, list or code block while the placeholder of the previous one is still selected:
  // start a new line after it instead of wrapping the placeholder, so the blocks come in the
  // order they were clicked.
  if (!inline && mdText.slice(cursorPositionStart, cursorPositionEnd) === placeholder) {
    let after = cursorPositionEnd;
    if (isInsideCodeBlock(mdText, after)) {
      // After the closing fence, not inside the code block.
      const close = mdText.indexOf("\n```", after);
      if (close !== -1) after = close + 4;
    }
    let lineEnd = mdText.indexOf("\n", after);
    if (lineEnd === -1) lineEnd = mdText.length;
    mdText = mdText.slice(0, lineEnd) + "\n" + mdText.slice(lineEnd);
    cursorPositionStart = cursorPositionEnd = lineEnd + 1;
  }

  if (!ifNewLine(mdText, cursorPositionStart) && !inline) {
    mdText = mdText.slice(0, cursorPositionStart) + "\n\n" + mdText.slice(cursorPositionStart);
    if (cursorPositionStart === cursorPositionEnd) {
      // The new block goes on its own line, between the two line breaks.
      cursorPositionStart += 1;
      cursorPositionEnd += 1;
    } else {
      // The selection moved by both line breaks.
      cursorPositionStart += 2;
      cursorPositionEnd += 2;
    }
  }
  if (cursorPositionStart !== cursorPositionEnd) {
    return trimTextAndUpdatePosition(
      mdText,
      cursorPositionStart,
      cursorPositionEnd,
      output,
      cursorIntON,
      placeholder,
    );
  }

  mdText = mdText.slice(0, cursorPositionStart) + output + mdText.slice(cursorPositionStart);

  cursorPositionStart += cursorIntON;
  cursorPositionEnd += cursorIntON + placeholder.length;
  return {
    mdText,
    cursorPositionStart,
    cursorPositionEnd,
  };
};
