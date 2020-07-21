import { BUTTON_TITLE, SECTION_TEXT } from "./languages/editor_NO";

// !!!!
// if new buttons are added remember to update buttons-state in editor.js

const temp = "```";

// SHORTCUTKEY options: "ctrl", "shift", "alt", "option", "command"
const SHORTCUTKEY = "ctrl";
const SHORTCUTKEY2 = "shift";
const plus = "+";

const chars = {
  a: "a",
  b: "b",
  c: "c",
  d: "d",
  e: "e",
  f: "f",
  g: "g",
  h: "h",
  i: "i",
  j: "j",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  o: "o",
  p: "p",
  q: "q",
  r: "r",
  s: "s",
  t: "t",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "y",
  z: "z",
};

// SHORTCUTKEYS config
const KEY_COMBINATIONS = {
  bold: [SHORTCUTKEY, plus, chars.b],
  italic: [SHORTCUTKEY, plus, chars.i],
  heading: [SHORTCUTKEY, plus, chars.h],
  strikethrough: [SHORTCUTKEY, plus, chars.s],
  undo: [SHORTCUTKEY, plus, chars.z],
  redo: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.z],
  new: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.n],
  load: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.l],
  save: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.s],
  image: [SHORTCUTKEY, plus, chars.p],
  listul: [SHORTCUTKEY, plus, chars.u],
  listol: [SHORTCUTKEY, plus, chars.o],
  listcheck: [SHORTCUTKEY, plus, chars.c],
  activity: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.a],
  intro: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.i],
  check: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.c],
  tip: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.o],
  protip: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.p],
  challenge: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.g],
  flag: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.f],
  try: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.t],
  inline: [SHORTCUTKEY, plus, chars.e],
  codeblock: [SHORTCUTKEY, plus, chars.k],
  preview: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.y],
};

const emphasis = [
  {
    buttonTitle: "bold",
    icon: "bold",
    output: "****",
    title: BUTTON_TITLE.bold,
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.bold.join(""),
  },
  {
    buttonTitle: "italic",
    icon: "italic",
    output: "**",
    title: BUTTON_TITLE.italic,
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.italic.join(""),
  },
  {
    buttonTitle: "heading",
    icon: "heading",
    output: "## ",
    title: BUTTON_TITLE.heading,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.heading.join(""),
  },
  {
    buttonTitle: "strikethrough",
    icon: "strikethrough",
    output: "~~~~",
    title: BUTTON_TITLE.strikethrough,
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.strikethrough.join(""),
  },
];

const undoRedo = [
  {
    buttonTitle: "undo",
    icon: "undo",
    output: "",
    title: BUTTON_TITLE.undo,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.undo.join(""),
  },
  {
    buttonTitle: "redo",
    icon: "redo",
    output: "",
    title: BUTTON_TITLE.redo,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.redo.join(""),
  },
];

const saveLoadNew = [
  {
    buttonTitle: "new",
    icon: "file",
    output: "",
    title: BUTTON_TITLE.new,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.new.join(""),
  },
  {
    buttonTitle: "load",
    icon: "upload",
    output: "",
    title: BUTTON_TITLE.load,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.load.join(""),
  },
  {
    buttonTitle: "save",
    icon: "save",
    output: "",
    title: BUTTON_TITLE.save,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.save.join(""),
  },
];

const image = [
  {
    buttonTitle: "image",
    icon: "file image",
    output: "",
    title: BUTTON_TITLE.image,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.image.join(""),
  },
];

const preview = [
  {
    buttonTitle: "preview",
    icon: "eye",
    output: "",
    title: BUTTON_TITLE.preview,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.preview.join(""),
  },
];

const lists = [
  {
    buttonTitle: "listUl",
    icon: "list ul",
    output: "- ",
    title: BUTTON_TITLE.listUl,
    cursorIntON: 2,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.listul.join(""),
  },
  {
    buttonTitle: "listOl",
    icon: "list ol",
    output: "1. ",
    title: BUTTON_TITLE.listOl,
    cursorIntON: 3,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.listol.join(""),
  },
  {
    buttonTitle: "listCheck",
    icon: "tasks",
    output: "- [\u0020] ",
    title: BUTTON_TITLE.listCheck,
    cursorIntON: 6,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.listcheck.join(""),
  },
];

// !! buttonTitle - first chars must be "sec_" when in sections,
// if new buttons are added remember to update buttons-state in editor.js

const sections = [
  {
    buttonTitle: "sec_activity",
    icon: "",
    output: "# " + SECTION_TEXT + " {.activity}\n",
    title: BUTTON_TITLE.activity,
    cursorIntON: 0,
    cursorIntOFF: 13,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.activity.join(""),
  },
  {
    buttonTitle: "sec_intro",
    icon: "",
    output: "# " + SECTION_TEXT + " {.intro}\n",
    title: BUTTON_TITLE.intro,
    cursorIntON: 0,
    cursorIntOFF: 10,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.intro.join(""),
  },
  {
    buttonTitle: "sec_check",
    icon: "",
    output: "## " + SECTION_TEXT + " {.check}\n",
    title: BUTTON_TITLE.check,
    cursorIntON: 0,
    cursorIntOFF: 10,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.check.join(""),
  },
  {
    buttonTitle: "sec_tip",
    icon: "",
    output: "## {.tip}\n" + SECTION_TEXT,
    title: BUTTON_TITLE.tip,
    cursorIntON: 10,
    cursorIntOFF: 19,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.tip.join(""),
  },
  {
    buttonTitle: "sec_protip",
    icon: "",
    output: "## " + SECTION_TEXT + " {.protip}\n",
    title: BUTTON_TITLE.protip,
    cursorIntON: 0,
    cursorIntOFF: 11,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.protip.join(""),
  },
  {
    buttonTitle: "sec_challenge",
    icon: "",
    output: "## " + SECTION_TEXT + " {.challenge}\n",
    title: BUTTON_TITLE.challenge,
    cursorIntON: 0,
    cursorIntOFF: 14,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.challenge.join(""),
  },
  {
    buttonTitle: "sec_flag",
    icon: "",
    output: "## " + SECTION_TEXT + " {.flag}\n",
    title: BUTTON_TITLE.flag,
    cursorIntON: 0,
    cursorIntOFF: 9,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.flag.join(""),
  },
  {
    buttonTitle: "sec_try",
    icon: "",
    output: "# " + SECTION_TEXT + " {.try}\n",
    title: BUTTON_TITLE.try,
    cursorIntON: 0,
    cursorIntOFF: 8,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.try.join(""),
  },
];

const code = [
  {
    buttonTitle: "inline",
    icon: "terminal",
    output: "``",
    title: BUTTON_TITLE.inline,
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.inline.join(""),
  },
  {
    buttonTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: BUTTON_TITLE.codeblock,
    cursorIntON: 4,
    cursorIntOFF: 5,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.codeblock.join(""),
  },
];

export {
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  lists,
  preview,
  sections,
  code,
  KEY_COMBINATIONS,
  SHORTCUTKEY,
  SHORTCUTKEY2,
};
