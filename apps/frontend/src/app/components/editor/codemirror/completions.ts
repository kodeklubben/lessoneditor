import {
  Completion,
  CompletionContext,
  CompletionResult,
  snippetCompletion,
} from "@codemirror/autocomplete";
import { blockColours, codeBlockLanguage, SECTIONS } from "./lessonSyntax";

/*
 * Suggestions while typing the lessons' own markup: the section after {. on a heading, the block
 * colour after `kode`{. in Scratch and micro:bit, the language after ``` and the video container
 * after :::. The labels are the markdown; the Norwegian name stands next to it.
 */

// The languages the lessons in kodeklubben/oppgaver use, with the names they use.
const LANGUAGES: [string, string][] = [
  ["blocks", "Scratch-klosser"],
  ["microbit", "MakeCode-klosser"],
  ["python", "Python"],
  ["processing", "Processing"],
  ["html", "HTML"],
  ["css", "CSS"],
  ["js", "JavaScript"],
  ["elm", "Elm"],
  ["lua", "Lua (ComputerCraft)"],
  ["cpp", "C++ (Arduino)"],
  ["csharp", "C#"],
  ["sh", "Terminal"],
  ["text", "Ren tekst"],
];

export function lessonCompletions(course?: string) {
  const ownLanguage = codeBlockLanguage(course);

  return (context: CompletionContext): CompletionResult | null => {
    const line = context.state.doc.lineAt(context.pos);
    const before = line.text.slice(0, context.pos - line.from);

    const attribute = /\{\.([\w-]*)$/.exec(before);
    if (attribute) {
      const from = context.pos - attribute[1].length;
      // closeBrackets often wrote the } already.
      const closes = context.state.sliceDoc(context.pos, context.pos + 1) === "}";
      const end = closes ? "" : "}";
      const afterCode = before.slice(0, attribute.index).endsWith("`");
      const colours = blockColours(course, context.state.doc.toString());
      const options: Completion[] = afterCode
        ? colours.map((colour) => ({
            label: colour.cls,
            detail: colour.hint ?? colour.title,
            type: "constant",
            apply: colour.cls + end,
          }))
        : SECTIONS.map((section, index) => ({
            label: section.cls,
            detail: section.title,
            type: "class",
            boost: -index,
            apply: section.cls + end,
          }));
      return options.length ? { from, options, validFor: /^[\w-]*$/ } : null;
    }

    const fence = /^```([\w-]*)$/.exec(before);
    if (fence) {
      const options = LANGUAGES.map(([label, detail]) => ({
        label,
        detail,
        type: "keyword",
        boost: label === ownLanguage ? 10 : 0,
      }));
      return { from: context.pos - fence[1].length, options, validFor: /^[\w-]*$/ };
    }

    const container = /^:::([\w]*)$/.exec(before);
    if (container) {
      return {
        from: line.from,
        options: [
          snippetCompletion(":::video[${https://www.youtube.com/watch?v=}]\n:::", {
            label: ":::video",
            detail: "Video fra YouTube eller Vimeo",
            type: "keyword",
          }),
        ],
      };
    }
    return null;
  };
}
