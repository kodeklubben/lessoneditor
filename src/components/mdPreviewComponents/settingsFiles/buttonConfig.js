import * as GUI_TEXT from "./languages/editor_NO";

const temp = "```";

// SHORTCUTKEY options: "ctrl", "shift", "alt", "option", "command"
const SHORTCUTKEY = "ctrl";
const SHORTCUTKEY2 = "shift";
const pls = "+";

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
  z: "z"
};

// SHORTCUTKEYS config
const KEY_COMBINATIONS = {
  bold: [SHORTCUTKEY, pls, chars.b],
  italic: [SHORTCUTKEY, pls, chars.i],
  heading: [SHORTCUTKEY, pls, chars.h],
  strikethrough: [SHORTCUTKEY, pls, chars.s],
  undo: [SHORTCUTKEY, pls, chars.z],
  redo: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.z],
  new: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.n],
  load: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.l],
  save: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.s],
  image: [SHORTCUTKEY, pls, chars.p],
  listul: [SHORTCUTKEY, pls, chars.u],
  listol: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.u],
  listcheck: [SHORTCUTKEY, pls, chars.y],
  activity: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.a],
  intro: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.i],
  check: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.c],
  protip: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.p],
  challenge: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.g],
  flag: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.f],
  try: [SHORTCUTKEY, pls, SHORTCUTKEY2, pls, chars.p],
  inline: [SHORTCUTKEY, pls, chars.e],
  codeblock: [SHORTCUTKEY, pls, chars.k]
};

const emphasis = [
  {
    bTitle: "bold",
    icon: "bold",
    output: "****",
    title: GUI_TEXT.BUTTON_TITLE.bold,
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.bold.join("")
  },
  {
    bTitle: "italic",
    icon: "italic",
    output: "**",
    title: GUI_TEXT.BUTTON_TITLE.italic,
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.italic.join("")
  },
  {
    bTitle: "heading",
    icon: "heading",
    output: "## ",
    title: GUI_TEXT.BUTTON_TITLE.heading,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.heading.join("")
  },
  {
    bTitle: "strikethrough",
    icon: "strikethrough",
    output: "~~~~",
    title: GUI_TEXT.BUTTON_TITLE.strikethrough,
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.strikethrough.join("")
  }
];

const undoRedo = [
  {
    bTitle: "undo",
    icon: "undo",
    output: "",
    title: GUI_TEXT.BUTTON_TITLE.undo,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.undo.join("")
  },
  {
    bTitle: "redo",
    icon: "redo",
    output: "",
    title: GUI_TEXT.BUTTON_TITLE.redo,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.redo.join("")
  }
];

const saveLoadNew = [
  {
    bTitle: "new",
    icon: "file",
    output: "",
    title: GUI_TEXT.BUTTON_TITLE.new,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.new.join("")
  },
  {
    bTitle: "load",
    icon: "upload",
    output: "",
    title: GUI_TEXT.BUTTON_TITLE.load,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.load.join("")
  },
  {
    bTitle: "save",
    icon: "save",
    output: "",
    title: GUI_TEXT.BUTTON_TITLE.save,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.save.join("")
  }
];

const image = [
  {
    bTitle: "image",
    icon: "file image",
    output: "",
    title: GUI_TEXT.BUTTON_TITLE.image,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.image.join("")
  }
];

const lists = [
  {
    bTitle: "listUl",
    icon: "list ul",
    output: "- ",
    title: GUI_TEXT.BUTTON_TITLE.listUl,
    cursorIntON: 2,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.listul.join("")
  },
  {
    bTitle: "listOl",
    icon: "list ol",
    output: "1. ",
    title: GUI_TEXT.BUTTON_TITLE.listOl,
    cursorIntON: 3,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.listol.join("")
  },
  {
    bTitle: "listCheck",
    icon: "tasks",
    output: "- [ ] ",
    title: GUI_TEXT.BUTTON_TITLE.listCheck,
    cursorIntON: 6,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.listcheck.join("")
  }
];

// !! bTitle - first chars must be "sec_" when in sections!!
const sections = [
  {
    bTitle: "sec_activity",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.activity}\n",
    title: GUI_TEXT.BUTTON_TITLE.activity,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.activity.join("")
  },
  {
    bTitle: "sec_intro",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.intro}",
    title: GUI_TEXT.BUTTON_TITLE.intro,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.intro.join("")
  },
  {
    bTitle: "sec_check",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.check}",
    title: GUI_TEXT.BUTTON_TITLE.check,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.check.join("")
  },
  {
    bTitle: "sec_protip",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.protip}\n#",
    title: GUI_TEXT.BUTTON_TITLE.protip,
    cursorIntON: 0,
    cursorIntOFF: 13,
    endOutput: "#",
    shortcut: KEY_COMBINATIONS.protip.join("")
  },
  {
    bTitle: "sec_challenge",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.challenge}\n#",
    title: GUI_TEXT.BUTTON_TITLE.challenge,
    cursorIntON: 0,
    cursorIntOFF: 13,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.challenge.join("")
  },
  {
    bTitle: "sec_flag",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.flag}",
    title: GUI_TEXT.BUTTON_TITLE.flag,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.flag.join("")
  },
  {
    bTitle: "sec_try",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + "{.try}",
    title: GUI_TEXT.BUTTON_TITLE.try,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.try.join("")
  }
];

const code = [
  {
    bTitle: "inline",
    icon: "terminal",
    output: "``",
    title: GUI_TEXT.BUTTON_TITLE.inline,
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: KEY_COMBINATIONS.inline.join("")
  },
  {
    bTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: GUI_TEXT.BUTTON_TITLE.codeblock,
    cursorIntON: 4,
    cursorIntOFF: 5,
    endOutput: "\n",
    shortcut: KEY_COMBINATIONS.codeblock.join("")
  }
];

export {
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  lists,
  sections,
  code,
  KEY_COMBINATIONS,
  SHORTCUTKEY,
  SHORTCUTKEY2
};
