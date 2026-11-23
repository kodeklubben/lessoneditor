const EDITOR_KEY = "lessoneditor.editor";

type EditorKind = "codemirror" | "classic";

/**
 * The editor everyone gets. The CodeMirror editor replaced the classic textarea editor; the
 * classic one is soft-deleted: its code is all still here (pages/Editor.tsx, ClassicEditor, and
 * components/editor/buttonpanel), only hidden. To bring it back for everyone, set this to
 * "classic".
 */
export const DEFAULT_EDITOR: EditorKind = "codemirror";

/**
 * Whether this browser uses the CodeMirror editor. ?editor=classic opens the hidden classic editor
 * and remembers it in this browser; ?editor=codemirror goes back to the default.
 */
export function codeMirrorEditorEnabled(search: string = window.location.search): boolean {
  const asked = new URLSearchParams(search).get("editor");
  const valid = asked === "codemirror" || asked === "classic" ? asked : undefined;
  try {
    if (valid === DEFAULT_EDITOR) localStorage.removeItem(EDITOR_KEY);
    else if (valid) localStorage.setItem(EDITOR_KEY, valid);
    return (localStorage.getItem(EDITOR_KEY) ?? DEFAULT_EDITOR) === "codemirror";
  } catch {
    return (valid ?? DEFAULT_EDITOR) === "codemirror";
  }
}
