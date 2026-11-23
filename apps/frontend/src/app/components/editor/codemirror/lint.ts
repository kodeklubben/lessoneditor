import { Diagnostic } from "@codemirror/lint";
import { EditorState } from "@codemirror/state";
import { syntaxTree, ensureSyntaxTree } from "@codemirror/language";
import { getVideoId } from "../../../utils/mdParser";
import { attributeClasses, sectionByClass, SECTIONS } from "./lessonSyntax";
import { IMAGE_ALT } from "./commands";

/*
 * Things in a lesson that the preview shows wrong or a pupil trips over: a code block that is never
 * closed (the rest of the lesson becomes code), a video link the preview cannot play, a section
 * class the lesson page does not know, and button placeholders that were never written over.
 */

const known = SECTIONS.map((section) => `.${section.cls}`).join(" ");

export function lessonDiagnostics(state: EditorState, placeholder: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const tree = ensureSyntaxTree(state, state.doc.length, 500) ?? syntaxTree(state);

  tree.iterate({
    enter: (node) => {
      if (node.name === "FencedCode") {
        const open = state.doc.lineAt(node.from);
        const last = node.node.lastChild;
        const closed =
          last?.name === "CodeMark" && state.doc.lineAt(last.from).number > open.number;
        if (!closed) {
          diagnostics.push({
            from: open.from,
            to: open.to,
            severity: "error",
            message:
              "Kodeblokken er ikke lukket, så resten av oppgaven blir kode. Avslutt den med ``` på en egen linje.",
            actions: [
              {
                name: "Lukk kodeblokken her",
                apply: (view, _from, _to) => {
                  const end = state.doc.lineAt(node.to).to;
                  view.dispatch({ changes: { from: end, insert: "\n```" } });
                },
              },
            ],
          });
        }
        return false;
      }
      if (/^ATXHeading\d$/.test(node.name)) {
        for (const attributes of node.node.getChildren("LessonAttributes")) {
          const unknown = attributeClasses(state.sliceDoc(attributes.from, attributes.to)).filter(
            (cls) => !sectionByClass(cls),
          );
          if (unknown.length) {
            diagnostics.push({
              from: attributes.from,
              to: attributes.to,
              severity: "info",
              message: `Oppgavesiden kjenner ikke seksjonen .${unknown.join(", .")}. Kjente seksjoner: ${known}`,
            });
          }
        }
      }
      if (node.name === "Image") {
        const text = state.sliceDoc(node.from, node.to);
        const alt = /^!\[([^\]]*)\]/.exec(text)?.[1] ?? "";
        if (alt.trim() === "" || alt === IMAGE_ALT) {
          diagnostics.push({
            from: node.from,
            to: node.to,
            severity: "info",
            message: "Bildet mangler en beskrivelse. Den leses opp for elever som ikke ser bildet.",
          });
        }
      }
      return true;
    },
  });

  for (let n = 1; n <= state.doc.lines; n++) {
    const line = state.doc.line(n);
    const video = /^:::\s*video\s*\[(.*)\]\s*$/.exec(line.text);
    if (video && !getVideoId(video[1].trim())) {
      diagnostics.push({
        from: line.from,
        to: line.to,
        severity: "warning",
        message: "Forhåndsvisningen kan bare vise videoer fra YouTube og Vimeo. Sjekk lenken.",
      });
    }
    let index = line.text.indexOf(placeholder);
    while (placeholder && index >= 0) {
      const from = line.from + index;
      const { main } = state.selection;
      // Not the placeholder a button just selected for the user to write over.
      const selected = main.from <= from + placeholder.length && main.to >= from;
      if (!selected)
        diagnostics.push({
          from: line.from + index,
          to: line.from + index + placeholder.length,
          severity: "info",
          message: `«${placeholder}» er ikke byttet ut med din egen tekst.`,
        });
      index = line.text.indexOf(placeholder, index + placeholder.length);
    }
  }
  return diagnostics.sort((a, b) => a.from - b.from);
}
