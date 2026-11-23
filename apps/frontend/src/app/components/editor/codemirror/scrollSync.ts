import { EditorView } from "@codemirror/view";

/** Where an element is inside a scrolling container, in the container's scroll coordinates. */
const offsetIn = (element: HTMLElement, container: HTMLElement) =>
  element.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;

/**
 * Scrolls the preview to the part of the lesson at the top of the editor (M5). The preview marks
 * paragraphs, headings and list items with the line they start on (id="line-12",
 * markdown-it-line-number); between two such lines the preview moves in proportion.
 */
export function syncPreview(view: EditorView, preview: HTMLElement) {
  const scroller = view.scrollDOM;
  if (scroller.scrollTop <= 0) {
    preview.scrollTop = 0;
    return;
  }
  if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
    preview.scrollTop = preview.scrollHeight;
    return;
  }
  const doc = view.state.doc;
  // The editor's top edge, in the editor's document coordinates.
  const at = scroller.getBoundingClientRect().top - view.documentTop;
  const line = doc.lineAt(view.lineBlockAtHeight(at).from).number;

  const anchors = Array.from(preview.querySelectorAll<HTMLElement>("[id^='line-']"))
    .map((element) => ({ line: Number(element.id.slice(5)), top: offsetIn(element, preview) }))
    .filter((anchor) => anchor.line >= 1 && anchor.line <= doc.lines)
    .sort((a, b) => a.line - b.line);

  const before = [...anchors].reverse().find((anchor) => anchor.line <= line) ?? {
    line: 1,
    top: 0,
  };
  const after = anchors.find((anchor) => anchor.line > line);
  const editorTop = (n: number) => view.lineBlockAt(doc.line(n).from).top;

  const from = editorTop(before.line);
  const to = after ? editorTop(after.line) : view.contentHeight;
  const previewTo = after ? after.top : preview.scrollHeight;
  const ratio = to > from ? Math.min(1, Math.max(0, (at - from) / (to - from))) : 0;
  preview.scrollTop = before.top + ratio * (previewTo - before.top);
}
