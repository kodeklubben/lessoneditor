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
}

const blockColours = (
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

export const SCRATCH_COLOURS: BlockColour[] = blockColours(scratchbuttons);
export const MICROBIT_COLOURS: BlockColour[] = blockColours(microbitbuttons);
const ALL_COLOURS = [...SCRATCH_COLOURS, ...MICROBIT_COLOURS];

export const blockColourByClass = (cls: string) => ALL_COLOURS.find((colour) => colour.cls === cls);

export const coloursForCourse = (course?: string): BlockColour[] =>
  course === "scratch" ? SCRATCH_COLOURS : course === "microbit" ? MICROBIT_COLOURS : [];

/** The classes in an attribute list: {.activity .x} gives ["activity", "x"]. */
export const attributeClasses = (attributes: string) =>
  Array.from(attributes.matchAll(/\.([\w-]+)/g), (match) => match[1]);

/** The info string the code block button writes: ```blocks for Scratch, ```python for Python. */
export const codeBlockLanguage = (course?: string) =>
  course === "scratch" ? "blocks" : course || "";
