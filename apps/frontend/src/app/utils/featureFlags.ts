const EDITOR_KEY = "lessoneditor.editor";

/**
 * The CodeMirror editor is behind a flag while it is tried out. ?editor=codemirror turns it on in
 * this browser (it is remembered), ?editor=classic turns it off again. Nothing changes for anyone
 * who has not asked for it.
 */
export function codeMirrorEditorEnabled(search: string = window.location.search): boolean {
  const asked = new URLSearchParams(search).get("editor");
  try {
    if (asked === "codemirror") localStorage.setItem(EDITOR_KEY, "codemirror");
    if (asked === "classic") localStorage.removeItem(EDITOR_KEY);
    return localStorage.getItem(EDITOR_KEY) === "codemirror";
  } catch {
    return asked === "codemirror";
  }
}

export function setCodeMirrorEditor(enabled: boolean) {
  try {
    if (enabled) localStorage.setItem(EDITOR_KEY, "codemirror");
    else localStorage.removeItem(EDITOR_KEY);
  } catch {
    // Without storage the flag lasts only as long as ?editor=codemirror is in the address.
  }
}
