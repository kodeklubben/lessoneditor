import { Range } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { attributeClasses, blockColourByClass, sectionByClass, SectionInfo } from "./lessonSyntax";

/*
 * Shows the lessons' own markup the way the lesson page shows it, while the text stays plain
 * markdown: a section heading gets its section's colours (Steg green, Utfordring blue …), the lines
 * of the section a stripe in that colour, Scratch and micro:bit blocks their block colour, and code
 * blocks a grey background. Only decorations: nothing here changes the text.
 */

class IconWidget extends WidgetType {
  constructor(readonly src: string) {
    super();
  }
  eq(other: IconWidget) {
    return other.src === this.src;
  }
  toDOM() {
    const img = document.createElement("img");
    img.src = this.src;
    img.alt = "";
    img.className = "cm-lesson-section-icon";
    return img;
  }
}

const headingLevel = (name: string) => {
  const match = /^ATXHeading(\d)$/.exec(name);
  return match ? Number(match[1]) : 0;
};

const sectionLine = (section: SectionInfo) =>
  Decoration.line({
    class: `cm-lesson-section cm-lesson-section-${section.cls}`,
    attributes: { "data-section": section.title },
  });
const sectionBody = (section: SectionInfo) =>
  Decoration.line({ class: `cm-lesson-section-body cm-lesson-section-body-${section.cls}` });
const sectionBadge = (section: SectionInfo) =>
  Decoration.mark({
    class: "cm-lesson-section-badge",
    attributes: { title: `Seksjon: ${section.title}` },
  });

const codeLine = Decoration.line({ class: "cm-lesson-codeblock" });
const codeFirst = Decoration.line({ class: "cm-lesson-codeblock cm-lesson-codeblock-first" });
const codeLast = Decoration.line({ class: "cm-lesson-codeblock cm-lesson-codeblock-last" });
const inlineCode = Decoration.mark({ class: "cm-lesson-inline-code" });
const attributesMark = Decoration.mark({ class: "cm-lesson-attributes" });
const containerLine = Decoration.line({ class: "cm-lesson-container" });

function build(view: EditorView): DecorationSet {
  const { state } = view;
  const decorations: Range<Decoration>[] = [];
  const doc = state.doc;
  // Open sections, innermost last; a heading closes those on its own level and below.
  const open: { section: SectionInfo; level: number; from: number }[] = [];
  const painted = new Set<number>();
  const closeSections = (level: number, until: number) => {
    while (open.length && open[open.length - 1].level >= level) {
      const { section, from } = open.pop()!;
      const start = doc.lineAt(from).number + 1;
      const end = doc.lineAt(Math.max(from, until - 1)).number;
      for (let n = start; n <= end; n++) {
        // Only the innermost section paints a line; it closes first.
        if (painted.has(n)) continue;
        painted.add(n);
        decorations.push(sectionBody(section).range(doc.line(n).from));
      }
    }
  };

  syntaxTree(state).iterate({
    enter: (node) => {
      const level = headingLevel(node.name);
      if (level) {
        closeSections(level, node.from);
        const attributes = node.node.getChildren("LessonAttributes").pop();
        const cls = attributes
          ? attributeClasses(state.sliceDoc(attributes.from, attributes.to)).find((c) =>
              sectionByClass(c),
            )
          : undefined;
        const section = cls ? sectionByClass(cls) : undefined;
        if (section && attributes) {
          decorations.push(sectionLine(section).range(doc.lineAt(node.from).from));
          if (section.imageurl)
            decorations.push(
              Decoration.widget({ widget: new IconWidget(section.imageurl), side: -1 }).range(
                node.from,
              ),
            );
          decorations.push(sectionBadge(section).range(attributes.from, attributes.to));
          open.push({ section, level, from: node.from });
        }
        return true;
      }
      switch (node.name) {
        case "FencedCode": {
          const first = doc.lineAt(node.from).number;
          const last = doc.lineAt(node.to).number;
          for (let n = first; n <= last; n++) {
            const deco = n === first ? codeFirst : n === last ? codeLast : codeLine;
            decorations.push(deco.range(doc.line(n).from));
          }
          return false;
        }
        case "InlineCode": {
          const next = node.node.nextSibling;
          const attributes =
            next?.name === "LessonAttributes" && next.from === node.to ? next : null;
          const colour = attributes
            ? attributeClasses(state.sliceDoc(attributes.from, attributes.to))
                .map((c) => blockColourByClass(c))
                .find(Boolean)
            : undefined;
          decorations.push(
            colour
              ? Decoration.mark({
                  class: "cm-lesson-block",
                  attributes: {
                    style: `--block-colour: ${colour.color}`,
                    title: colour.hint ?? colour.title,
                  },
                }).range(node.from, node.to)
              : inlineCode.range(node.from, node.to),
          );
          return false;
        }
        case "LessonAttributes": {
          const parent = node.node.parent?.name ?? "";
          if (!headingLevel(parent)) decorations.push(attributesMark.range(node.from, node.to));
          return false;
        }
        case "Paragraph": {
          // markdown-it-container's :::video[…] … ::: lines.
          const firstLine = doc.lineAt(node.from).number;
          const lastLine = doc.lineAt(node.to).number;
          for (let n = firstLine; n <= lastLine; n++) {
            const line = doc.line(n);
            if (/^:::/.test(line.text)) decorations.push(containerLine.range(line.from));
          }
          return true;
        }
      }
      return true;
    },
  });
  closeSections(1, doc.length + 1);
  return Decoration.set(decorations, true);
}

export const lessonDecorations = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = build(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || syntaxTree(update.startState) !== syntaxTree(update.state))
        this.decorations = build(update.view);
    }
  },
  { decorations: (plugin) => plugin.decorations },
);
