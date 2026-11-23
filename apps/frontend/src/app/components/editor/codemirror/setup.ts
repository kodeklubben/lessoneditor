import { EditorState, Extension, Prec } from "@codemirror/state";
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  KeyBinding,
  lineNumbers,
  placeholder,
  rectangularSelection,
  ViewUpdate,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  HighlightStyle,
  indentOnInput,
  LanguageDescription,
  syntaxHighlighting,
} from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { highlightSelectionMatches, search, searchKeymap } from "@codemirror/search";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { linter, lintGutter, lintKeymap } from "@codemirror/lint";
import { tags as t } from "@lezer/highlight";
import {
  attributesTag,
  CODE_LANGUAGE_ALIASES,
  ALL_COLOUR_SHORTCUTS,
  blockColours,
  codeBlockLanguage,
  lessonAttributes,
  SECTIONS,
} from "./lessonSyntax";
import {
  InlineKind,
  ListKind,
  toggleBlockColour,
  toggleCodeBlock,
  toggleInline,
  toggleList,
  toggleSection,
  skipAttributesOnEnter,
} from "./commands";
import { lessonDecorations } from "./decorations";
import { lessonCompletions } from "./completions";
import { lessonDiagnostics } from "./lint";
import { phrases } from "./phrases";
import {
  codebuttons,
  emphasis,
  hyperlink,
  lists,
  media,
} from "../buttonpanel/buttoncontroller/settings/buttonConfig";

/**
 * Markdown as the lessons write it: GitHub's extensions, {.attributes}, and highlighted code in
 * ``` blocks. Each code language is downloaded the first time a lesson has it.
 */
export const lessonMarkdown = (codeLanguages: LanguageDescription[] = languages) =>
  markdown({
    base: markdownLanguage,
    codeLanguages: (info) =>
      LanguageDescription.matchLanguageName(
        codeLanguages,
        CODE_LANGUAGE_ALIASES[info.trim().toLowerCase()] ?? info,
        true,
      ),
    extensions: [lessonAttributes],
  });

/** The dialogs and the file picker live in React; the shortcuts reach them through this. */
export interface EditorActions {
  openLink: () => void;
  openVideo: () => void;
  openImage: () => void;
  uploadImages: (files: File[]) => void;
}

/** "ctrl+shift+a" from the button config as CodeMirror writes it: "Ctrl-Shift-a". */
export const codeMirrorKey = (shortcut: string) =>
  shortcut
    .split("+")
    .map((part) => ({ mod: "Mod", ctrl: "Ctrl", shift: "Shift", alt: "Alt" })[part] ?? part)
    .join("-");

/** The toolbar's buttons, as the shortcuts the button tooltips show. */
export function toolbarKeymap(
  course: string | undefined,
  text: string,
  actions: () => EditorActions,
): KeyBinding[] {
  const inline = (kind: InlineKind, shortcut: string) => ({
    key: codeMirrorKey(shortcut),
    run: toggleInline(kind, text),
  });
  const list = (kind: ListKind, shortcut: string) => ({
    key: codeMirrorKey(shortcut),
    run: toggleList(kind, text),
  });
  const action = (shortcut: string, run: () => void) => ({
    key: codeMirrorKey(shortcut),
    run: () => (run(), true),
  });
  const bindings: KeyBinding[] = [
    inline("bold", emphasis.bold.shortcut),
    inline("italic", emphasis.italic.shortcut),
    inline("strikethrough", emphasis.strikethrough.shortcut),
    inline("inline", codebuttons.inline.shortcut),
    {
      key: codeMirrorKey(codebuttons.codeblock.shortcut),
      run: toggleCodeBlock(codeBlockLanguage(course), text),
    },
    list("listUl", lists.listUl.shortcut),
    list("listOl", lists.listOl.shortcut),
    list("listCheck", lists.listCheck.shortcut),
    ...SECTIONS.map((section) => ({
      key: codeMirrorKey(section.shortcut),
      run: toggleSection(section.cls, section.level, text),
    })),
    // Which colour a key gives depends on the text's blocks (blockColours), so it is looked up
    // when the key is pressed.
    ...ALL_COLOUR_SHORTCUTS.map((shortcut) => ({
      key: codeMirrorKey(shortcut),
      run: (view: EditorView) => {
        const colour = blockColours(course, view.state.doc.toString()).find(
          (c) => c.shortcut === shortcut,
        );
        return colour ? toggleBlockColour(colour.cls, text)(view) : false;
      },
    })),
    action(hyperlink.hyperlink.shortcut, () => actions().openLink()),
    action(media.video.shortcut, () => actions().openVideo()),
    action(media.image.shortcut, () => actions().openImage()),
  ];
  // CodeMirror looks a key up as typed ("Ctrl-A" for ctrl+shift+a) before "Ctrl-Shift-a", and on a
  // Mac its default keymap has Ctrl-A (block comment). The buttons' shortcuts win both ways.
  return bindings.flatMap((binding) => {
    const shifted = /^(.*)Shift-([a-z])$/.exec(binding.key ?? "");
    return shifted
      ? [binding, { ...binding, key: shifted[1] + shifted[2].toUpperCase() }]
      : [binding];
  });
}

const monospace = "'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace";

/** The markdown keeps its look: headings big, bold bold, links blue, markers grey; code as on GitHub. */
const lessonHighlight = HighlightStyle.define([
  { tag: t.heading1, fontSize: "1.45em", fontWeight: "700" },
  { tag: t.heading2, fontSize: "1.25em", fontWeight: "700" },
  { tag: [t.heading3, t.heading4, t.heading5, t.heading6], fontSize: "1.1em", fontWeight: "700" },
  { tag: t.strong, fontWeight: "700" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "#1e70bf" },
  { tag: t.url, color: "#1e70bf", textDecoration: "underline" },
  { tag: t.quote, color: "#555", fontStyle: "italic" },
  { tag: [t.processingInstruction, t.contentSeparator], color: "#8a8f96" },
  { tag: t.monospace, fontFamily: monospace },
  { tag: attributesTag, fontFamily: monospace, fontSize: "0.85em" },
  // Code in ``` blocks.
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.moduleKeyword], color: "#a626a4" },
  { tag: [t.string, t.special(t.string), t.regexp], color: "#50a14f" },
  { tag: [t.number, t.bool, t.null, t.atom], color: "#986801" },
  { tag: [t.comment, t.lineComment, t.blockComment], color: "#8a8f96", fontStyle: "italic" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#4078f2" },
  { tag: [t.typeName, t.className, t.tagName], color: "#c18401" },
  { tag: [t.attributeName, t.propertyName], color: "#986801" },
  { tag: t.definition(t.variableName), color: "#e45649" },
]);

const theme = EditorView.theme({
  "&": { height: "100%", backgroundColor: "#fff", borderRadius: "5px", fontSize: "1rem" },
  "&.cm-focused": { outline: "2px solid #0fbe7b", outlineOffset: "0" },
  ".cm-scroller": { fontFamily: "inherit", lineHeight: "1.65" },
  ".cm-content": { padding: "1rem 0", caretColor: "#000" },
  ".cm-line": { padding: "0 1rem 0 0.75rem" },
  ".cm-gutters": {
    backgroundColor: "#fafafa",
    color: "#a0a4a8",
    borderRight: "1px solid #eee",
    borderRadius: "5px 0 0 5px",
  },
  ".cm-activeLine": { backgroundColor: "rgba(33, 133, 208, 0.05)" },
  ".cm-activeLineGutter": { backgroundColor: "rgba(33, 133, 208, 0.1)" },
  ".cm-selectionMatch": { backgroundColor: "rgba(255, 213, 0, 0.3)" },
  ".cm-panels": { fontFamily: "inherit" },
  ".cm-tooltip": { fontFamily: "inherit", borderRadius: "5px" },
  ".cm-tooltip-autocomplete ul li[aria-selected]": { backgroundColor: "#2185d0" },
  ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionDetail": { color: "#e6f0fa" },
  ".cm-completionDetail": { marginLeft: "0.75em", fontStyle: "normal", color: "#767676" },
  ".cm-placeholder": { color: "#9a9a9a" },
});

export interface SetupOptions {
  course?: string;
  /** «Tekst her» in the text's own language. */
  text: string;
  language?: string;
  actions: () => EditorActions;
  onUpdate: (update: ViewUpdate) => void;
}

export function lessonEditorExtensions({
  course,
  text,
  language,
  actions,
  onUpdate,
}: SetupOptions): Extension[] {
  return [
    lineNumbers(),
    highlightActiveLineGutter(),
    foldGutter({ openText: "▾", closedText: "▸" }),
    lintGutter(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion({ override: [lessonCompletions(course)], icons: false }),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    search({ top: true }),
    EditorView.lineWrapping,
    lessonMarkdown(),
    syntaxHighlighting(lessonHighlight),
    lessonDecorations,
    linter((view) => lessonDiagnostics(view.state, text), { delay: 600 }),
    Prec.high(keymap.of(toolbarKeymap(course, text, actions))),
    Prec.highest(keymap.of([{ key: "Enter", run: skipAttributesOnEnter }])),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
      indentWithTab,
    ]),
    EditorState.phrases.of(phrases),
    EditorView.contentAttributes.of({
      spellcheck: "true",
      autocorrect: "on",
      autocapitalize: "sentences",
      "aria-label": "Oppgavetekst i Markdown",
      ...(language
        ? {
            lang:
              language === "ua"
                ? "uk"
                : language === "nb" || language === "nn"
                  ? `${language}-NO`
                  : language,
          }
        : {}),
    }),
    placeholder("Skriv oppgaven her. Knappene over setter inn seksjoner, kode og bilder."),
    EditorView.domEventHandlers({
      paste: (event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (!files.length) return false;
        event.preventDefault();
        actions().uploadImages(files);
        return true;
      },
      drop: (event, view) => {
        const files = imageFiles(event.dataTransfer?.files);
        if (!files.length) return false;
        event.preventDefault();
        // The image goes where it was dropped: the cursor moves there now, the upload follows.
        const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
        if (pos !== null) view.dispatch({ selection: { anchor: pos } });
        actions().uploadImages(files);
        return true;
      },
    }),
    EditorView.updateListener.of(onUpdate),
    theme,
  ];
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif"];
const imageFiles = (files?: FileList | null) =>
  Array.from(files ?? []).filter((file) => IMAGE_TYPES.includes(file.type));
