import { MarkdownConfig } from "@lezer/markdown";
import { Tag } from "@lezer/highlight";
import { sections } from "../buttonpanel/buttoncontroller/settings/buttonConfig";
import {
  microbitbuttons,
  scratchbuttons,
} from "../buttonpanel/buttoncontroller/settings/microbitAndScratchButtonConfig";

/** markdown-it-attrs' {.activity}, {.blockmotion}, {target=_blank}: highlighted as their own thing. */
export const attributesTag = Tag.define();

const OPEN_BRACE = 123;
// The same forms markdown-it-attrs reads: {.class}, {#id}, {key=value}, {:key=value}.
const ATTRIBUTES = /^\{[ \t]*[.#:A-Za-z][^{}\n]*\}/;

/**
 * Teaches CodeMirror's markdown parser the lessons' attribute syntax, so headings, code and links
 * know their {.class} as a node ("LessonAttributes") instead of plain text.
 */
export const lessonAttributes: MarkdownConfig = {
  defineNodes: [{ name: "LessonAttributes", style: attributesTag }],
  parseInline: [
    {
      name: "LessonAttributes",
      parse(cx, next, pos) {
        if (next !== OPEN_BRACE) return -1;
        const match = ATTRIBUTES.exec(cx.slice(pos, cx.end));
        if (!match) return -1;
        return cx.addElement(cx.elt("LessonAttributes", pos, pos + match[0].length));
      },
      before: "Emphasis",
    },
  ],
};

export interface SectionInfo {
  /** The class in the markdown, «activity» in {.activity}. */
  cls: string;
  /** The button and its Norwegian name, «Steg». */
  slug: string;
  title: string;
  level: number;
  shortcut: string;
  style: Record<string, string>;
  imageurl: string | null;
}

/** The lesson sections, in the toolbar's order, read from the same config as the buttons. */
export const SECTIONS: SectionInfo[] = Object.values(sections).map((section) => ({
  cls: section.slug.replace(/^sec_/, ""),
  slug: section.slug,
  title: section.title,
  level: section.output.indexOf(" "),
  shortcut: section.shortcut,
  style: section.style,
  imageurl: section.imageurl,
}));

export const sectionByClass = (cls: string) => SECTIONS.find((section) => section.cls === cls);

export interface BlockColour {
  cls: string;
  slug: string;
  title: string;
  color: string;
  shortcut: string;
  /** A longer explanation than the button's title, for tooltips and suggestions. */
  hint?: string;
}

const coloursOf = (
  buttons: Record<
    string,
    { slug: string; output: string; title: string; color: string; shortcut: string }
  >,
) =>
  Object.values(buttons).map((button) => ({
    cls: /\{\.([\w-]+)\}/.exec(button.output)?.[1] ?? button.slug,
    slug: button.slug,
    title: button.title,
    color: button.color,
    shortcut: button.shortcut,
  }));

export const SCRATCH_COLOURS: BlockColour[] = coloursOf(scratchbuttons);
export const MICROBIT_COLOURS: BlockColour[] = coloursOf(microbitbuttons);
/**
 * `si [Hei!]`{.b}: a Scratch block in a sentence whose colour scratchblocks works out from the
 * block itself (399 times in kodeklubben/oppgaver). First in the Scratch row as «Kloss».
 */
export const SCRATCH_ANY_BLOCK: BlockColour = {
  cls: "b",
  slug: "b",
  title: "Kloss",
  hint: "Kloss med fargen til kategorien sin, som forhåndsvisningen finner selv",
  color: "#5f6b7a",
  shortcut: "ctrl+shift+b",
};
const ALL_COLOURS = [...SCRATCH_COLOURS, ...MICROBIT_COLOURS, SCRATCH_ANY_BLOCK];

export const blockColourByClass = (cls: string) => ALL_COLOURS.find((colour) => colour.cls === cls);

const SCRATCH_ROW = [SCRATCH_ANY_BLOCK, ...SCRATCH_COLOURS];
export const ALL_COLOUR_SHORTCUTS = [
  ...new Set([...SCRATCH_ROW, ...MICROBIT_COLOURS].map((c) => c.shortcut)),
];

/**
 * The block colour buttons a text gets: Scratch's for the scratch course, micro:bit's for
 * microbit. The course list comes from kodeklubben/oppgaver and can change, so a text that already
 * has Scratch or micro:bit blocks gets their buttons whatever its course is called.
 */
export function blockColours(course: string | undefined, text: string): BlockColour[] {
  if (course === "scratch") return SCRATCH_ROW;
  if (course === "microbit") return MICROBIT_COLOURS;
  if (/`\{\.microbit[a-z]+\}/.test(text)) return MICROBIT_COLOURS;
  if (/`\{\.(block[a-z]+|b)\}/.test(text)) return SCRATCH_ROW;
  return [];
}

/** The classes in an attribute list: {.activity .x} gives ["activity", "x"]. */
export const attributeClasses = (attributes: string) =>
  Array.from(attributes.matchAll(/\.([\w-]+)/g), (match) => match[1]);

/** The language each course writes its code blocks in, as the lessons in kodeklubben/oppgaver do. */
const COURSE_LANGUAGES: Record<string, string> = {
  scratch: "blocks",
  microbit: "microbit",
  python: "python",
  processing: "processing",
  web: "html",
  elm: "elm",
  computercraft: "lua",
  arduino: "cpp",
  command_line: "sh",
};

/** The info string the code block button writes: ```blocks for Scratch, ```python for Python. */
export const codeBlockLanguage = (course?: string) => (course && COURSE_LANGUAGES[course]) || "";

/**
 * Code languages the lessons name that CodeMirror knows under another name: MakeCode for the
 * micro:bit is JavaScript, Processing is Java. ```blocks (Scratch) has no highlighting.
 */
export const CODE_LANGUAGE_ALIASES: Record<string, string> = {
  microbit: "javascript",
  processing: "java",
  js: "javascript",
};
