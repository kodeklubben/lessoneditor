import { EditorSelection, EditorState, StateCommand } from "@codemirror/state";
import { history, undo } from "@codemirror/commands";
import { lessonMarkdown } from "./setup";
import {
  activeButtons,
  insertImage,
  insertLink,
  insertVideo,
  toggleBlockColour,
  toggleCodeBlock,
  toggleInline,
  toggleList,
  toggleSection,
  skipAttributesOnEnter,
  documentCodeLanguage,
} from "./commands";
import { lessonDiagnostics } from "./lint";
import { codeMirrorKey } from "./setup";
import { LanguageDescription } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import {
  blockColourByClass,
  blockColours,
  CODE_LANGUAGE_ALIASES,
  codeBlockLanguage,
} from "./lessonSyntax";

const TEXT = "Tekst her";

/** A state from a doc where | is the cursor and « » a selection. */
function stateOf(doc: string) {
  const anchor = doc.indexOf("«");
  let selection: EditorSelection;
  let text = doc;
  if (anchor >= 0) {
    text = doc.replace("«", "");
    const head = text.indexOf("»");
    text = text.replace("»", "");
    selection = EditorSelection.single(anchor, head);
  } else {
    const cursor = doc.indexOf("|");
    text = doc.replace("|", "");
    selection = EditorSelection.single(cursor < 0 ? text.length : cursor);
  }
  return EditorState.create({
    doc: text,
    selection, // No code languages: they are downloaded on demand, which jest cannot do.
    extensions: [lessonMarkdown([]), history()],
  });
}

function run(command: StateCommand, doc: string) {
  let state = stateOf(doc);
  const ok = command({ state, dispatch: (tr) => (state = tr.state) });
  return {
    ok,
    state,
    text: state.doc.toString(),
    selected: state.sliceDoc(state.selection.main.from, state.selection.main.to),
  };
}

describe("bold, italic, strikethrough and inline code", () => {
  it("inserts the placeholder, selected to write over", () => {
    const result = run(toggleInline("bold", TEXT), "Hei |");
    expect(result.text).toBe("Hei **Tekst her**");
    expect(result.selected).toBe(TEXT);
  });

  it("wraps the words of a selection, not the spaces next to them", () => {
    const result = run(toggleInline("italic", TEXT), "Hei« verden »!");
    expect(result.text).toBe("Hei *verden* !");
    expect(result.selected).toBe("verden");
  });

  it("takes the markers away when pressed inside them", () => {
    expect(run(toggleInline("bold", TEXT), "Hei **ver|den**").text).toBe("Hei verden");
    expect(run(toggleInline("strikethrough", TEXT), "~~bo|rt~~").text).toBe("bort");
    expect(run(toggleInline("inline", TEXT), "Skriv `pri|nt` her").text).toBe("Skriv print her");
  });

  it("undoes in one step", () => {
    const { state } = run(toggleInline("bold", TEXT), "Hei «du»");
    let after = state;
    undo({ state, dispatch: (tr) => (after = tr.state) });
    expect(after.doc.toString()).toBe("Hei du");
  });
});

describe("sections", () => {
  it("puts a new section on its own line after the line the cursor is on", () => {
    const result = run(toggleSection("activity", 1, TEXT), "Første avsnitt|\nNeste");
    expect(result.text).toBe("Første avsnitt\n\n# Tekst her {.activity}\n\nNeste");
    expect(result.selected).toBe(TEXT);
  });

  it("uses an empty line as it is", () => {
    expect(run(toggleSection("check", 2, TEXT), "Tekst\n\n|").text).toBe(
      "Tekst\n\n## Tekst her {.check}\n",
    );
  });

  it("makes a heading the section, and the same button again makes it a plain heading", () => {
    expect(run(toggleSection("activity", 1, TEXT), "# Lag en |figur").text).toBe(
      "# Lag en figur {.activity}",
    );
    expect(run(toggleSection("challenge", 2, TEXT), "# Steg 1 {.acti|vity}").text).toBe(
      "## Steg 1 {.challenge}",
    );
    expect(run(toggleSection("activity", 1, TEXT), "# Steg 1| {.activity}").text).toBe("# Steg 1");
  });

  it("takes selected words out of the middle of a line without stray spaces", () => {
    expect(run(toggleSection("tip", 2, TEXT), "Før «Lag figuren» etter").text).toBe(
      "Før\n\n## Lag figuren {.tip}\n\netter",
    );
  });

  it("makes the selected words the title", () => {
    expect(run(toggleSection("tip", 2, TEXT), "«Husk å lagre»").text).toBe(
      "## Husk å lagre {.tip}\n",
    );
  });
});

it("keeps a heading's {.activity} on the heading when Enter is pressed after the title", () => {
  let state = stateOf("# Steg 1| {.activity}\nTekst");
  const view = {
    get state() {
      return state;
    },
    dispatch: (spec: any) => (state = state.update(spec).state),
  };
  skipAttributesOnEnter(view as never);
  expect(state.selection.main.head).toBe("# Steg 1 {.activity}".length);
  state = stateOf("# Steg| 1 {.activity}");
  skipAttributesOnEnter(view as never);
  expect(state.selection.main.head).toBe("# Steg".length);
});

describe("lists", () => {
  it("makes the selected lines a list, numbered, and takes it away again", () => {
    expect(run(toggleList("listOl", TEXT), "«en\nto\ntre»").text).toBe("1. en\n2. to\n3. tre");
    expect(run(toggleList("listOl", TEXT), "«1. en\n2. to»").text).toBe("en\nto");
    expect(run(toggleList("listCheck", TEXT), "«- en\n- to»").text).toBe("- [ ] en\n- [ ] to");
  });

  it("starts a list on an empty line with the placeholder selected", () => {
    const result = run(toggleList("listUl", TEXT), "Tekst\n|");
    expect(result.text).toBe("Tekst\n- Tekst her");
    expect(result.selected).toBe(TEXT);
  });
});

describe("code blocks", () => {
  it("wraps the selected lines in a code block for the course's language", () => {
    expect(run(toggleCodeBlock("python", TEXT), "Kode:\n«print(1)\nprint(2)»").text).toBe(
      "Kode:\n\n```python\nprint(1)\nprint(2)\n```\n",
    );
  });

  it("makes only the selected words of a line a code block", () => {
    expect(run(toggleCodeBlock("python", TEXT), "Skriv «print(1)» her").text).toBe(
      "Skriv\n\n```python\nprint(1)\n```\n\nher",
    );
  });

  it("takes the fences away inside a code block", () => {
    expect(run(toggleCodeBlock("python", TEXT), "```python\npr|int(1)\n```\nTekst").text).toBe(
      "print(1)\nTekst",
    );
  });
});

describe("Scratch and micro:bit block colours", () => {
  it("colours the selection, changes and removes the colour", () => {
    expect(run(toggleBlockColour("blockmotion", TEXT), "«gå 10 steg»").text).toBe(
      "`gå 10 steg`{.blockmotion}",
    );
    expect(run(toggleBlockColour("blocklooks", TEXT), "`si| hei`{.blockmotion}").text).toBe(
      "`si hei`{.blocklooks}",
    );
    expect(run(toggleBlockColour("blockmotion", TEXT), "`gå|`{.blockmotion}").text).toBe("`gå`");
  });

  it("does nothing inside a code block", () => {
    expect(run(toggleBlockColour("blockmotion", TEXT), "```blocks\nflytt| (10) steg\n```").ok).toBe(
      false,
    );
  });
});

describe("dialogs", () => {
  it("links the selected words, with the link text selected", () => {
    const state = stateOf("Les «mer»");
    const next = state.update(
      insertLink(state, "https://kidsakoder.no", true, "lenkebeskrivelse"),
    ).state;
    expect(next.doc.toString()).toBe("Les [mer](https://kidsakoder.no){target=_blank}");
  });

  it("puts a video on its own lines", () => {
    const state = stateOf("Se her|");
    const next = state.update(insertVideo(state, "https://youtu.be/dQw4w9WgXcQ")).state;
    expect(next.doc.toString()).toBe("Se her\n\n:::video[https://youtu.be/dQw4w9WgXcQ]\n:::\n");
  });

  it("inserts an image with its description selected", () => {
    const state = stateOf("Bilde: |");
    const next = state.update(insertImage(state, "katt.png")).state;
    expect(next.doc.toString()).toBe("Bilde: ![Bildebeskrivelse](./katt.png)");
    expect(next.sliceDoc(next.selection.main.from, next.selection.main.to)).toBe(
      "Bildebeskrivelse",
    );
  });
});

describe("the pressed buttons", () => {
  it("follow the markup at the cursor", () => {
    expect(activeButtons(stateOf("**fe|t**")).active).toMatchObject({ bold: true });
    expect(activeButtons(stateOf("# Steg| 1 {.activity}")).active).toMatchObject({
      sec_activity: true,
    });
    expect(activeButtons(stateOf("- [ ] gjø|r")).active).toMatchObject({ listCheck: true });
    expect(activeButtons(stateOf("`gå|`{.blockmotion}")).active).toMatchObject({ motion: true });
    expect(activeButtons(stateOf("```python\nx|\n```")).inCodeBlock).toBe(true);
  });
});

describe("lint", () => {
  const messages = (doc: string) =>
    lessonDiagnostics(stateOf(doc + "|"), TEXT).map((d) => d.severity + ": " + d.message);

  it("warns about a code block that is never closed", () => {
    expect(messages("Tekst\n```python\nprint(1)\n\nMer tekst")[0]).toMatch(
      /^error: Kodeblokken er ikke lukket/,
    );
    expect(messages("```python\nprint(1)\n```")).toEqual([]);
  });

  it("knows the lesson page's sections", () => {
    expect(messages("# Steg 1 {.activity}")).toEqual([]);
    expect(messages("# Steg 1 {.aktivitet}")[0]).toMatch(/kjenner ikke seksjonen \.aktivitet/);
  });

  it("finds placeholders and video links the preview cannot play", () => {
    expect(messages("Tekst her og mer\n")).toEqual([
      "info: «Tekst her» er ikke byttet ut med din egen tekst.",
    ]);
    expect(messages(":::video[https://example.com/film]\n:::\n")[0]).toMatch(/^warning: /);
  });
});

it("writes the button config's shortcuts as CodeMirror keys", () => {
  expect(codeMirrorKey("mod+b")).toBe("Mod-b");
  expect(codeMirrorKey("ctrl+shift+a")).toBe("Ctrl-Shift-a");
});

describe("courses and their code", () => {
  it("writes each course's code blocks in the language its lessons use", () => {
    expect(codeBlockLanguage("scratch")).toBe("blocks");
    expect(codeBlockLanguage("web")).toBe("html");
    expect(codeBlockLanguage("computercraft")).toBe("lua");
    expect(codeBlockLanguage("arduino")).toBe("cpp");
    expect(codeBlockLanguage("legomindstorms")).toBe("");
  });

  it("highlights MakeCode as JavaScript and Processing as Java", () => {
    const find = (name: string) =>
      LanguageDescription.matchLanguageName(languages, CODE_LANGUAGE_ALIASES[name] ?? name, true)
        ?.name;
    expect(find("microbit")).toBe("JavaScript");
    expect(find("processing")).toBe("Java");
    expect(find("js")).toBe("JavaScript");
    expect(find("lua")).toBe("Lua");
    expect(find("elm")).toBe("Elm");
    expect(find("cpp")).toBe("C++");
    expect(find("csharp")).toBe("C#");
    expect(find("sh")).toBe("Shell");
    expect(find("blocks")).toBeUndefined();
  });

  it("knows `si [Hei!]`{.b} as a Scratch block", () => {
    expect(blockColourByClass("b")?.hint).toMatch(/forhåndsvisningen finner selv/);
  });
});

describe("when the course list changes", () => {
  it("writes code blocks in the language the text already uses", () => {
    const text = "```html\n<p>\n```\n\n```css\np {}\n```\n\n```html\n<b>\n```\n\n|";
    expect(documentCodeLanguage(stateOf(text))).toBe("html");
    expect(run(toggleCodeBlock("", TEXT), text).text).toContain("```html\nTekst her\n```");
    expect(run(toggleCodeBlock("python", TEXT), "Ingen kode ennå|").text).toContain("```python");
  });

  it("gives Scratch and micro:bit buttons to texts with their blocks, whatever the course is called", () => {
    expect(blockColours("scratch", "")[0].title).toBe("Kloss");
    expect(blockColours("scratch-3", "Trykk `gå`{.blockmotion}").map((c) => c.cls)).toContain(
      "blockmotion",
    );
    expect(blockColours("ny_microbit", "`vis`{.microbitbasic}").map((c) => c.cls)).toContain(
      "microbitbasic",
    );
    expect(blockColours("python", "print('hei')")).toEqual([]);
  });

  it("makes `…`{.b} blocks with the Kloss button", () => {
    expect(run(toggleBlockColour("b", TEXT), "Bruk «si hei»").text).toBe("Bruk `si hei`{.b}");
  });
});
