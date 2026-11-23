import { buttonAction, isInsideCodeBlock, shortcutLabel } from "./buttonMethods";
import { codebuttons, emphasis, sections } from "../settings/buttonConfig";

type Button = { output: string; cursorIntON: number; cursorIntOFF: number };
type State = { mdText: string; cursorPositionStart: number; cursorPositionEnd: number };

const click = (state: State, button: Button) =>
  buttonAction(
    state.mdText,
    state.cursorPositionStart,
    state.cursorPositionEnd,
    button.cursorIntON,
    button.cursorIntOFF,
    button.output,
  );

const at = (mdText: string, start: number, end = start): State => ({
  mdText,
  cursorPositionStart: start,
  cursorPositionEnd: end,
});

const selected = (state: State) =>
  state.mdText.slice(state.cursorPositionStart, state.cursorPositionEnd);

describe("buttonAction", () => {
  it("inserts a section with its placeholder selected", () => {
    const result = click(at("", 0), sections.intro);
    expect(result.mdText).toBe("# Tekst her {.intro}\n");
    expect(selected(result)).toBe("Tekst her");
  });

  it("puts sections clicked one after another on their own lines, in order (V1)", () => {
    let state = click(at("", 0), sections.intro);
    state = click(state, sections.activity);
    state = click(state, sections.check);
    expect(state.mdText).toBe(
      "# Tekst her {.intro}\n# Tekst her {.activity}\n## Tekst her {.check}\n\n\n",
    );
    expect(selected(state)).toBe("Tekst her");
    expect(state.cursorPositionStart).toBe(state.mdText.indexOf("## ") + 3);
  });

  it("wraps a whole selected word in the middle of a line, not one letter short (V1)", () => {
    const text = "Dette er tittel her";
    const start = text.indexOf("tittel");
    const result = click(at(text, start, start + "tittel".length), sections.check);
    expect(result.mdText).toBe("Dette er \n\n## tittel {.check}\n her");
    expect(selected(result)).toBe("tittel");
  });

  it("puts a section after a code block whose placeholder is selected", () => {
    const codeblock = { ...codebuttons.codeblock };
    let state = click(at("", 0), codeblock);
    expect(selected(state)).toBe("Tekst her");
    state = click(state, sections.activity);
    expect(state.mdText).toBe("```\nTekst her\n```\n# Tekst her {.activity}\n");
  });

  it("removes bold when Bold is clicked again on the same text (M7)", () => {
    let state = click(at("", 0), emphasis.bold);
    expect(state.mdText).toBe("**Tekst her**");
    state = click(state, emphasis.bold);
    expect(state.mdText).toBe("Tekst her");
    expect(selected(state)).toBe("Tekst her");
  });

  it("removes bold when the selection includes the markers", () => {
    const result = click(at("a **ord** b", 2, 9), emphasis.bold);
    expect(result.mdText).toBe("a ord b");
    expect(selected(result)).toBe("ord");
  });

  it("can make bold text italic as well", () => {
    let state = click(at("", 0), emphasis.bold);
    state = click(state, emphasis.italic);
    expect(state.mdText).toBe("***Tekst her***");
  });
});

describe("isInsideCodeBlock", () => {
  const text = "tekst\n```microbit\nbasic.showNumber(1)\n```\netter";
  it("is true between the fences and false outside", () => {
    expect(isInsideCodeBlock(text, text.indexOf("basic"))).toBe(true);
    expect(isInsideCodeBlock(text, 2)).toBe(false);
    expect(isInsideCodeBlock(text, text.indexOf("etter"))).toBe(false);
  });
});

describe("shortcutLabel", () => {
  it("shows mod as ctrl outside a Mac", () => {
    expect(shortcutLabel("mod+z")).toMatch(/^(ctrl|cmd)\+z$/);
    expect(shortcutLabel("ctrl+shift+a")).toBe("ctrl+shift+a");
  });
});

describe("buttonAction with bold and italic together", () => {
  it("removes only italic from bold and italic text", () => {
    const result = click(at("***ord***", 3, 6), emphasis.italic);
    expect(result.mdText).toBe("**ord**");
  });
  it("removes only bold from bold and italic text", () => {
    const result = click(at("***ord***", 3, 6), emphasis.bold);
    expect(result.mdText).toBe("*ord*");
  });
});

describe("the placeholder in the text's language (9d)", () => {
  const english = (state: State, button: Button) =>
    buttonAction(
      state.mdText,
      state.cursorPositionStart,
      state.cursorPositionEnd,
      button.cursorIntON,
      button.cursorIntOFF,
      button.output.replaceAll("Tekst her", "Text here"),
      "Text here",
    );

  it("does in English exactly what it does in Norwegian, with «Text here» selected", () => {
    let en = english(at("", 0), sections.intro);
    let nb = click(at("", 0), sections.intro);
    expect(en.mdText).toBe("# Text here {.intro}\n");
    expect(selected(en)).toBe("Text here");
    en = english(en, sections.activity);
    nb = click(nb, sections.activity);
    expect(en.mdText).toBe(nb.mdText.replaceAll("Tekst her", "Text here"));
    expect(selected(en)).toBe("Text here");
  });

  it("wraps a selection and unwraps it again with a different placeholder length", () => {
    const bold = english(at("hello world", 6, 11), emphasis.bold);
    expect(bold.mdText).toBe("hello **world**");
    expect(selected(bold)).toBe("world");
    const plain = english(bold, emphasis.bold);
    expect(plain.mdText).toBe("hello world");
  });
});
