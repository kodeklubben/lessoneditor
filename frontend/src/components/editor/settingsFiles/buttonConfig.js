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
  bold: [SHORTCUTKEY, plus, chars.b].join(""),
  italic: [SHORTCUTKEY, plus, chars.i].join(""),
  heading: [SHORTCUTKEY, plus, chars.h].join(""),
  strikethrough: [SHORTCUTKEY, plus, chars.s].join(""),
  undo: [SHORTCUTKEY, plus, chars.z].join(""),
  redo: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.z].join(""),
  image: [SHORTCUTKEY, plus, chars.p].join(""),
  listul: [SHORTCUTKEY, plus, chars.u].join(""),
  listol: [SHORTCUTKEY, plus, chars.o].join(""),
  listcheck: [SHORTCUTKEY, plus, chars.c].join(""),
  activity: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.a].join(""),
  intro: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.i].join(""),
  check: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.c].join(""),
  tip: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.o].join(""),
  protip: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.p].join(""),
  challenge: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.g].join(""),
  flag: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.f].join(""),
  try: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.t].join(""),
  inline: [SHORTCUTKEY, plus, chars.e].join(""),
  codeblock: [SHORTCUTKEY, plus, chars.k].join(""),
  preview: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.y].join(""),
};

const emphasis = {
  bold: {
    buttonTitle: "bold",
    icon: "bold",
    output: "____",
    title: BUTTON_TITLE.bold,
    cursorIntON: 2,
    cursorIntOFF: 2,
    shortcut: KEY_COMBINATIONS.bold,
  },
  italic: {
    buttonTitle: "italic",
    icon: "italic",
    output: "__",
    title: BUTTON_TITLE.italic,
    cursorIntON: 1,
    cursorIntOFF: 1,
    shortcut: KEY_COMBINATIONS.italic,
  },
  heading: {
    buttonTitle: "heading",
    icon: "heading",
    output: "## ",
    title: BUTTON_TITLE.heading,
    cursorIntON: 0,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.heading,
  },
  strikethrough: {
    buttonTitle: "strikethrough",
    icon: "strikethrough",
    output: "~~~~",
    title: BUTTON_TITLE.strikethrough,
    cursorIntON: 2,
    cursorIntOFF: 2,
    shortcut: KEY_COMBINATIONS.strikethrough,
  },
};

const undoRedo = {
  undo: {
    buttonTitle: "undo",
    icon: "undo",
    output: "",
    title: BUTTON_TITLE.undo,
    cursorIntON: 0,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.undo,
  },
  redo: {
    buttonTitle: "redo",
    icon: "redo",
    output: "",
    title: BUTTON_TITLE.redo,
    cursorIntON: 0,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.redo,
  },
};

const image = {
  image: {
    buttonTitle: "image",
    icon: "file image",
    output: "",
    title: BUTTON_TITLE.image,
    cursorIntON: 0,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.image,
  },
};

const preview = {
  preview: {
    buttonTitle: "preview",
    icon: "eye",
    output: "",
    title: BUTTON_TITLE.preview,
    cursorIntON: 0,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.preview,
  },
};

const lists = {
  listUl: {
    buttonTitle: "listUl",
    icon: "list ul",
    output: "- ",
    title: BUTTON_TITLE.listUl,
    cursorIntON: 2,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.listul,
  },
  listOl: {
    buttonTitle: "listOl",
    icon: "list ol",
    output: "1. ",
    title: BUTTON_TITLE.listOl,
    cursorIntON: 3,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.listol,
  },
  listCheck: {
    buttonTitle: "listCheck",
    icon: "tasks",
    output: "- [\u0020] ",
    title: BUTTON_TITLE.listCheck,
    cursorIntON: 6,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.listcheck,
  },
};

// !! buttonTitle - first chars must be "sec_" when in sections,
// if new buttons are added remember to update buttons-state in editor.js

const sections = {
  intro: {
    buttonTitle: "sec_intro",
    icon: "",
    output: "# " + SECTION_TEXT + " {.intro}\n",
    title: BUTTON_TITLE.intro,
    cursorIntON: 0,
    cursorIntOFF: 10,
    cancelInt: 2,
    shortcut: KEY_COMBINATIONS.intro,
  },
  activity: {
    buttonTitle: "sec_activity",
    icon: "",
    output: "# " + SECTION_TEXT + " {.activity}\n",
    title: BUTTON_TITLE.activity,
    cursorIntON: 0,
    cursorIntOFF: 13,
    cancelInt: 2,
    shortcut: KEY_COMBINATIONS.activity,
  },
  check: {
    buttonTitle: "sec_check",
    icon: "",
    output: "## " + SECTION_TEXT + " {.check}\n",
    title: BUTTON_TITLE.check,
    cursorIntON: 0,
    cursorIntOFF: 10,
    cancelInt: 3,
    shortcut: KEY_COMBINATIONS.check,
  },
  tip: {
    buttonTitle: "sec_tip",
    icon: "",
    output: "## {.tip}\n" + SECTION_TEXT,
    title: BUTTON_TITLE.tip,
    cursorIntON: 10,
    cursorIntOFF: 19,
    cancelInt: 10,
    shortcut: KEY_COMBINATIONS.tip,
  },
  protip: {
    buttonTitle: "sec_protip",
    icon: "",
    output: "## " + SECTION_TEXT + " {.protip}\n",
    title: BUTTON_TITLE.protip,
    cursorIntON: 0,
    cursorIntOFF: 11,
    cancelInt: 3,
    shortcut: KEY_COMBINATIONS.protip,
  },
  challenge: {
    buttonTitle: "sec_challenge",
    icon: "",
    output: "## " + SECTION_TEXT + " {.challenge}\n",
    title: BUTTON_TITLE.challenge,
    cursorIntON: 0,
    cursorIntOFF: 14,
    cancelInt: 3,
    shortcut: KEY_COMBINATIONS.challenge,
  },
  flag: {
    buttonTitle: "sec_flag",
    icon: "",
    output: "## " + SECTION_TEXT + " {.flag}\n",
    title: BUTTON_TITLE.flag,
    cursorIntON: 0,
    cursorIntOFF: 9,
    cancelInt: 3,
    shortcut: KEY_COMBINATIONS.flag,
  },
  try: {
    buttonTitle: "sec_try",
    icon: "",
    output: "# " + SECTION_TEXT + " {.try}\n",
    title: BUTTON_TITLE.try,
    cursorIntON: 0,
    cursorIntOFF: 8,
    cancelInt: 2,
    shortcut: KEY_COMBINATIONS.try,
  },
};

const codebutton = {
  inline: {
    buttonTitle: "inline",
    icon: "terminal",
    output: "``",
    title: BUTTON_TITLE.inline,
    cursorIntON: 1,
    cursorIntOFF: 1,
    shortcut: KEY_COMBINATIONS.inline,
  },
  codeblock: {
    buttonTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: BUTTON_TITLE.codeblock,
    cursorIntON: 4,
    cursorIntOFF: 5,
    shortcut: KEY_COMBINATIONS.codeblock,
  },
};

export {
  emphasis,
  undoRedo,
  image,
  lists,
  preview,
  sections,
  codebutton,
  KEY_COMBINATIONS,
  SHORTCUTKEY,
  SHORTCUTKEY2,
};
