import {
  ChangeSpec,
  EditorSelection,
  EditorState,
  SelectionRange,
  StateCommand,
  TransactionSpec,
} from "@codemirror/state";
import { ensureSyntaxTree, syntaxTree } from "@codemirror/language";
import type { EditorView } from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";
import { attributeClasses, blockColourByClass, sectionByClass } from "./lessonSyntax";

/*
 * The toolbar's buttons as CodeMirror commands. Each one is a single transaction: it changes the
 * text, sets the selection and lands in CodeMirror's own undo history, and it works on every
 * selection at once. Where the markup is already there, the command finds it in the syntax tree
 * and takes it away again, so every button is a toggle.
 */

const tree = (state: EditorState) =>
  ensureSyntaxTree(state, state.doc.length, 200) ?? syntaxTree(state);

/** The innermost node named one of names that holds the whole range. */
export function enclosing(
  state: EditorState,
  range: SelectionRange,
  names: string[],
): SyntaxNode | null {
  const root = tree(state);
  for (const side of [-1, 1] as const) {
    for (
      let node: SyntaxNode | null = root.resolveInner(range.from, side);
      node;
      node = node.parent
    ) {
      if (names.includes(node.name) && node.from <= range.from && node.to >= range.to) return node;
    }
  }
  return null;
}

/** The text a block (section, code block, video) gets around it, so it stands on lines of its own. */
function blockPadding(state: EditorState, from: number, to: number) {
  const before = state.sliceDoc(Math.max(0, from - 2), from);
  const after = state.sliceDoc(to, to + 2);
  const lead = from === 0 || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const trail =
    to === state.doc.length
      ? "\n"
      : after.startsWith("\n\n")
        ? ""
        : after.startsWith("\n")
          ? "\n"
          : "\n\n";
  return { lead, trail };
}

/** Where a block goes: in place of an empty line, or after the line the cursor is on. */
function blockTarget(state: EditorState, range: SelectionRange) {
  if (!range.empty) {
    // Words taken out of the middle of a line leave no stray spaces at the cut.
    let { from, to } = range;
    while (from > 0 && /[ \t]/.test(state.sliceDoc(from - 1, from))) from--;
    while (to < state.doc.length && /[ \t]/.test(state.sliceDoc(to, to + 1))) to++;
    return { from, to };
  }
  const line = state.doc.lineAt(range.head);
  return line.text.trim() === ""
    ? { from: line.from, to: line.to }
    : { from: line.to, to: line.to };
}

const run =
  (build: (state: EditorState) => TransactionSpec | null): StateCommand =>
  ({ state, dispatch }) => {
    const spec = build(state);
    if (!spec) return false;
    dispatch(state.update(spec, { scrollIntoView: true, userEvent: "input.format" }));
    return true;
  };

// --- Bold, italic, strikethrough, inline code ---------------------------------------------------

export const INLINE = {
  bold: { node: "StrongEmphasis", mark: "**" },
  italic: { node: "Emphasis", mark: "*" },
  strikethrough: { node: "Strikethrough", mark: "~~" },
  inline: { node: "InlineCode", mark: "`" },
} as const;
export type InlineKind = keyof typeof INLINE;

export const toggleInline = (kind: InlineKind, placeholder: string): StateCommand =>
  run((state) =>
    state.changeByRange((range) => {
      const { node: name, mark } = INLINE[kind];
      const node = enclosing(state, range, [name]);
      if (node?.firstChild && node.lastChild && node.firstChild !== node.lastChild) {
        const changes = state.changes([
          { from: node.from, to: node.firstChild.to },
          { from: node.lastChild.from, to: node.to },
        ]);
        return { changes, range: range.map(changes) };
      }
      const text = state.sliceDoc(range.from, range.to);
      if (text.trim() === "") {
        return {
          changes: { from: range.from, to: range.to, insert: mark + placeholder + mark },
          range: EditorSelection.range(
            range.from + mark.length,
            range.from + mark.length + placeholder.length,
          ),
        };
      }
      // The markers go round the words, not round the spaces next to them: "** fet**" is no bold.
      const from = range.from + (text.length - text.trimStart().length);
      const to = range.to - (text.length - text.trimEnd().length);
      return {
        changes: [
          { from, insert: mark },
          { from: to, insert: mark },
        ],
        range: EditorSelection.range(from + mark.length, to + mark.length),
      };
    }),
  );

// --- Sections: # Steg 1 {.activity} ----------------------------------------------------------------

const HEADING = /^(#{1,6})[ \t]+(.*?)(?:[ \t]*\{([^{}]*)\})?[ \t]*$/;

/** The section classes on a heading line, or undefined when the line is no heading. */
export function headingSection(text: string) {
  const match = HEADING.exec(text);
  if (!match) return undefined;
  return attributeClasses(`{${match[3] ?? ""}}`).find((cls) => sectionByClass(cls));
}

export const toggleSection = (cls: string, level: number, placeholder: string): StateCommand =>
  run((state) =>
    state.changeByRange((range) => {
      const line = state.doc.lineAt(range.head);
      const heading = HEADING.exec(line.text);
      if (heading && range.from >= line.from && range.to <= line.to) {
        // A heading already: make it this section, or a plain heading if it is this section.
        const [, hashes, title, inner = ""] = heading;
        const has = attributeClasses(`{${inner}}`).includes(cls);
        let rest = inner.replace(/\.([\w-]+)/g, (token, name) =>
          sectionByClass(name) ? "" : token,
        );
        rest = rest.trim().replace(/\s+/g, " ");
        if (!has) rest = `.${cls} ${rest}`.trim();
        const newTitle = title || placeholder;
        const prefix = `${has ? hashes : "#".repeat(level)} `;
        const insert = prefix + newTitle + (rest ? ` {${rest}}` : "");
        const titleStart = line.from + prefix.length;
        return {
          changes: { from: line.from, to: line.to, insert },
          range: title
            ? EditorSelection.cursor(titleStart + newTitle.length)
            : EditorSelection.range(titleStart, titleStart + newTitle.length),
        };
      }
      const title = range.empty
        ? placeholder
        : state
            .sliceDoc(range.from, range.to)
            .trim()
            .replace(/\s*\n\s*/g, " ");
      const { from, to } = blockTarget(state, range);
      const { lead, trail } = blockPadding(state, from, to);
      const prefix = `${"#".repeat(level)} `;
      const titleStart = from + lead.length + prefix.length;
      return {
        changes: { from, to, insert: `${lead}${prefix}${title} {.${cls}}${trail}` },
        range: range.empty
          ? EditorSelection.range(titleStart, titleStart + title.length)
          : EditorSelection.cursor(titleStart + title.length),
      };
    }),
  );

// --- Lists ---------------------------------------------------------------------------------------

export type ListKind = "listUl" | "listOl" | "listCheck";
const LIST_PREFIX = /^([ \t]*)(?:([-*+])[ \t]+(\[[ xX]\][ \t]+)?|(\d+)[.)][ \t]+)/;

export function listKind(text: string): ListKind | undefined {
  const match = LIST_PREFIX.exec(text);
  if (!match) return undefined;
  return match[4] ? "listOl" : match[3] ? "listCheck" : "listUl";
}

const listPrefix = (kind: ListKind, n: number) =>
  kind === "listOl" ? `${n}. ` : kind === "listCheck" ? "- [ ] " : "- ";

export const toggleList = (kind: ListKind, placeholder: string): StateCommand =>
  run((state) =>
    state.changeByRange((range) => {
      const first = state.doc.lineAt(range.from);
      let last = state.doc.lineAt(range.to);
      if (!range.empty && range.to === last.from && last.number > first.number)
        last = state.doc.line(last.number - 1);
      const lines = [];
      for (let n = first.number; n <= last.number; n++) lines.push(state.doc.line(n));
      const filled = lines.filter((line) => line.text.trim() !== "");

      if (filled.length === 0) {
        const prefix = listPrefix(kind, 1);
        const start = first.from + prefix.length;
        return {
          changes: { from: first.from, to: first.to, insert: prefix + placeholder },
          range: EditorSelection.range(start, start + placeholder.length),
        };
      }
      // Every line already this list: take the list away. Otherwise make them all this list.
      const remove = filled.every((line) => listKind(line.text) === kind);
      const changes: ChangeSpec[] = filled.map((line, index) => {
        const match = LIST_PREFIX.exec(line.text);
        const indent = match ? match[1].length : /^[ \t]*/.exec(line.text)![0].length;
        return {
          from: line.from + indent,
          to: match ? line.from + match[0].length : line.from + indent,
          insert: remove ? "" : listPrefix(kind, index + 1),
        };
      });
      const set = state.changes(changes);
      return {
        changes: set,
        range: EditorSelection.range(set.mapPos(range.anchor, 1), set.mapPos(range.head, 1)),
      };
    }),
  );

// --- Code blocks ---------------------------------------------------------------------------------

/**
 * The language the text's code blocks already use most (```html in a Web lesson that also has a
 * little ```css), so the button follows the lesson, for every course in the catalogue.
 */
/**
 * Tab and Shift-Tab on list items. Markdown nests an item under the one above only when it starts
 * where that item's text starts: two spaces under «- », three under «1. ». Tab moves the lines to
 * that column of the item above; Shift-Tab moves them out to the item they hang under. Anything
 * that is not list items is left to CodeMirror's own indent.
 */
const indentWidth = (text: string) => /^[ \t]*/.exec(text)![0].replace(/\t/g, "    ").length;

function listItemsIndent(state: EditorState, outwards: boolean): number | undefined {
  const main = state.selection.main;
  const first = state.doc.lineAt(main.from);
  const last = state.doc.lineAt(main.to);
  for (let n = first.number; n <= last.number; n++) {
    if (!LIST_PREFIX.test(state.doc.line(n).text)) return undefined;
  }
  const own = indentWidth(first.text);
  if (outwards && own === 0) return undefined;
  for (let n = first.number - 1; n >= Math.max(1, first.number - 200); n--) {
    const text = state.doc.line(n).text;
    if (!text.trim()) continue;
    const match = LIST_PREFIX.exec(text);
    const indent = indentWidth(text);
    if (!match) {
      if (indent === 0) return undefined; // the list ended above
      continue; // a continued line inside an item
    }
    if (outwards) {
      if (indent < own) return indent;
    } else {
      if (indent === own) return match[0].replace(match[3] ?? "", "").replace(/\t/g, "    ").length;
      if (indent < own) return undefined; // already the first item under its parent
    }
  }
  return undefined;
}

const moveListItems =
  (outwards: boolean): StateCommand =>
  ({ state, dispatch }) => {
    if (state.selection.ranges.length > 1) return false;
    const target = listItemsIndent(state, outwards);
    if (target === undefined) return false;
    const main = state.selection.main;
    const first = state.doc.lineAt(main.from);
    const last = state.doc.lineAt(main.to);
    const delta = target - indentWidth(first.text);
    const changes: ChangeSpec[] = [];
    for (let n = first.number; n <= last.number; n++) {
      const line = state.doc.line(n);
      const current = /^[ \t]*/.exec(line.text)![0];
      const width = Math.max(0, indentWidth(line.text) + delta);
      changes.push({ from: line.from, to: line.from + current.length, insert: " ".repeat(width) });
    }
    dispatch(state.update({ changes, scrollIntoView: true, userEvent: "input.indent" }));
    return true;
  };

export const indentListItem = moveListItems(false);
export const outdentListItem = moveListItems(true);

export function documentCodeLanguage(state: EditorState): string | undefined {
  const counts = new Map<string, number>();
  for (const match of state.doc.toString().matchAll(/^[ \t]*```+[ \t]*([\w+#-]+)/gm))
    counts.set(match[1], (counts.get(match[1]) ?? 0) + 1);
  let best: string | undefined;
  for (const [language, count] of counts) if (!best || count > counts.get(best)!) best = language;
  return best;
}

/** language is the course's; the text's own language wins when it has code blocks already. */
export const toggleCodeBlock = (courseLanguage: string, placeholder: string): StateCommand =>
  run((state) => {
    const language = documentCodeLanguage(state) ?? courseLanguage;
    return state.changeByRange((range) => {
      const block = enclosing(state, range, ["FencedCode"]);
      if (block) {
        // Inside a code block: take the fences away and keep the code as text.
        const open = state.doc.lineAt(block.from);
        const close = state.doc.lineAt(block.to);
        const closed = block.lastChild?.name === "CodeMark" && close.number > open.number;
        const changes: ChangeSpec[] = [
          { from: open.from, to: Math.min(open.to + 1, state.doc.length) },
        ];
        if (closed) changes.push({ from: close.from - 1, to: close.to });
        const set = state.changes(changes);
        return { changes: set, range: range.map(set) };
      }
      const fence = "```" + language;
      const line = state.doc.lineAt(range.from);
      const partOfLine =
        !range.empty &&
        range.to <= line.to &&
        state.sliceDoc(range.from, range.to).trim() !== line.text.trim();
      if (partOfLine) {
        // Some words of a line: only they become the code block, on lines of their own.
        const code = state.sliceDoc(range.from, range.to).trim();
        const { from, to } = blockTarget(state, range);
        const { lead, trail } = blockPadding(state, from, to);
        const start = from + lead.length + fence.length + 1;
        return {
          changes: { from, to, insert: `${lead}${fence}\n${code}\n\`\`\`${trail}` },
          range: EditorSelection.range(start, start + code.length),
        };
      }
      if (!range.empty) {
        const first = state.doc.lineAt(range.from);
        let last = state.doc.lineAt(range.to);
        if (range.to === last.from && last.number > first.number)
          last = state.doc.line(last.number - 1);
        const code = state.sliceDoc(first.from, last.to);
        const { lead, trail } = blockPadding(state, first.from, last.to);
        const start = first.from + lead.length + fence.length + 1;
        return {
          changes: {
            from: first.from,
            to: last.to,
            insert: `${lead}${fence}\n${code}\n\`\`\`${trail}`,
          },
          range: EditorSelection.range(start, start + code.length),
        };
      }
      const { from, to } = blockTarget(state, range);
      const { lead, trail } = blockPadding(state, from, to);
      const start = from + lead.length + fence.length + 1;
      return {
        changes: { from, to, insert: `${lead}${fence}\n${placeholder}\n\`\`\`${trail}` },
        range: EditorSelection.range(start, start + placeholder.length),
      };
    });
  });

// --- Scratch and micro:bit block colours: `gå 10 steg`{.blockmotion} -------------------------------

/** The inline code a block colour belongs to, and its {.class} when it has one. */
export function blockCode(state: EditorState, range: SelectionRange) {
  let code = enclosing(state, range, ["InlineCode"]);
  if (!code) {
    const attributes = enclosing(state, range, ["LessonAttributes"]);
    const before = attributes?.prevSibling;
    if (before?.name === "InlineCode" && before.to === attributes!.from) code = before;
  }
  if (!code) return null;
  const next = code.nextSibling;
  const attributes = next?.name === "LessonAttributes" && next.from === code.to ? next : null;
  return { code, attributes };
}

export const toggleBlockColour = (cls: string, placeholder: string): StateCommand =>
  run((state) => {
    // A colour inside a code block would be a stray block in the preview.
    if (state.selection.ranges.some((range) => enclosing(state, range, ["FencedCode"])))
      return null;
    return state.changeByRange((range) => {
      const found = blockCode(state, range);
      if (found) {
        const { code, attributes } = found;
        const current = attributes
          ? attributeClasses(state.sliceDoc(attributes.from, attributes.to))
          : [];
        const changes = attributes
          ? {
              from: attributes.from,
              to: attributes.to,
              insert: current.includes(cls) ? "" : `{.${cls}}`,
            }
          : { from: code.to, insert: `{.${cls}}` };
        const set = state.changes(changes);
        return { changes: set, range: range.map(set) };
      }
      const text = state.sliceDoc(range.from, range.to).trim();
      if (!text) {
        const start = range.from + 1;
        return {
          changes: { from: range.from, to: range.to, insert: `\`${placeholder}\`{.${cls}}` },
          range: EditorSelection.range(start, start + placeholder.length),
        };
      }
      return {
        changes: { from: range.from, to: range.to, insert: `\`${text}\`{.${cls}}` },
        range: EditorSelection.range(range.from + 1, range.from + 1 + text.length),
      };
    });
  });

// --- Links, video and images (from the dialogs) ------------------------------------------------

export function insertLink(
  state: EditorState,
  url: string,
  newTab: boolean,
  fallbackText: string,
): TransactionSpec {
  return {
    ...state.changeByRange((range) => {
      const text = range.empty ? fallbackText : state.sliceDoc(range.from, range.to);
      const insert = `[${text}](${url})${newTab ? "{target=_blank}" : ""}`;
      return {
        changes: { from: range.from, to: range.to, insert },
        range: EditorSelection.range(range.from + 1, range.from + 1 + text.length),
      };
    }),
    scrollIntoView: true,
    userEvent: "input.format",
  };
}

export function insertVideo(state: EditorState, url: string): TransactionSpec {
  const { from, to } = blockTarget(state, EditorSelection.cursor(state.selection.main.head));
  const { lead, trail } = blockPadding(state, from, to);
  const insert = `${lead}:::video[${url}]\n:::${trail}`;
  return {
    changes: { from, to, insert },
    selection: EditorSelection.cursor(from + insert.length),
    scrollIntoView: true,
    userEvent: "input.format",
  };
}

export const IMAGE_ALT = "Bildebeskrivelse";

/** The image at the cursor, with its description selected to write over. */
export function insertImage(state: EditorState, filename: string): TransactionSpec {
  const { from, to } = state.selection.main;
  const insert = `![${IMAGE_ALT}](./${filename})`;
  return {
    changes: { from, to, insert },
    selection: EditorSelection.range(from + 2, from + 2 + IMAGE_ALT.length),
    scrollIntoView: true,
    userEvent: "input.paste",
  };
}

// --- What the toolbar shows as pressed ------------------------------------------------------------

export function activeButtons(state: EditorState): {
  active: Record<string, boolean>;
  inCodeBlock: boolean;
} {
  const range = state.selection.main;
  const active: Record<string, boolean> = {};
  for (const [kind, { node }] of Object.entries(INLINE)) {
    if (enclosing(state, range, [node])) active[kind] = true;
  }
  const inCodeBlock = !!enclosing(state, range, ["FencedCode"]);
  if (inCodeBlock) active.codeblock = true;
  const line = state.doc.lineAt(range.head);
  const list = listKind(line.text);
  if (list) active[list] = true;
  const section = headingSection(line.text);
  if (section) active[`sec_${section}`] = true;
  const block = blockCode(state, range);
  if (block?.attributes) {
    for (const cls of attributeClasses(
      state.sliceDoc(block.attributes.from, block.attributes.to),
    )) {
      const colour = blockColourByClass(cls);
      if (colour) active[colour.slug] = true;
    }
  }
  return { active, inCodeBlock };
}

/**
 * Enter after a heading's title, before its {.activity}: the classes stay on the heading and the
 * new line starts after them, as in the classic editor. Moves the cursor and lets Enter go on.
 */
export const skipAttributesOnEnter = (view: EditorView): boolean => {
  const { state } = view;
  const range = state.selection.main;
  if (!range.empty || state.selection.ranges.length > 1) return false;
  const line = state.doc.lineAt(range.head);
  const rest = line.text.slice(range.head - line.from);
  if (/^#{1,6}[ \t]/.test(line.text) && /^[ \t]*\{[^{}]*\}[ \t]*$/.test(rest))
    view.dispatch({ selection: { anchor: line.to } });
  return false;
};
