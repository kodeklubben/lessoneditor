import { codeMirrorEditorEnabled, DEFAULT_EDITOR } from "./featureFlags";

describe("which editor a browser gets", () => {
  beforeEach(() => localStorage.clear());

  it("is CodeMirror by default", () => {
    expect(DEFAULT_EDITOR).toBe("codemirror");
    expect(codeMirrorEditorEnabled("")).toBe(true);
  });

  it("opens the soft-deleted classic editor with ?editor=classic, and remembers it", () => {
    expect(codeMirrorEditorEnabled("?editor=classic")).toBe(false);
    expect(codeMirrorEditorEnabled("")).toBe(false);
    expect(codeMirrorEditorEnabled("?editor=codemirror")).toBe(true);
    expect(codeMirrorEditorEnabled("")).toBe(true);
    expect(localStorage.getItem("lessoneditor.editor")).toBeNull();
  });

  it("ignores unknown values", () => {
    expect(codeMirrorEditorEnabled("?editor=vim")).toBe(true);
  });
});
