import { BUTTON_TITLE, SECTION_TEXT } from "../../../settingsFiles/languages/editor_NO";

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
  emphasis: {
    bold: [SHORTCUTKEY, plus, chars.b].join(""),
    italic: [SHORTCUTKEY, plus, chars.i].join(""),
    heading: [SHORTCUTKEY, plus, chars.h].join(""),
    strikethrough: [SHORTCUTKEY, plus, chars.s].join(""),
  },
  undoRedo: {
    undo: [SHORTCUTKEY, plus, chars.z].join(""),
    redo: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.z].join(""),
  },
  hyperlink: { hyperlink: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.h].join("") },
  media: {
    image: [SHORTCUTKEY, plus, chars.p].join(""),
    video: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.u].join(""),
  },
  lists: {
    listul: [SHORTCUTKEY, plus, chars.u].join(""),
    listol: [SHORTCUTKEY, plus, chars.o].join(""),
    listcheck: [SHORTCUTKEY, plus, chars.r].join(""),
  },
  sections: {
    activity: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.a].join(""),
    intro: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.i].join(""),
    check: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.c].join(""),
    protip: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.p].join(""),
    challenge: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.g].join(""),
    flag: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.f].join(""),
    try: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.t].join(""),
    save: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.s].join(""),
  },
  codebuttons: {
    inline: [SHORTCUTKEY, plus, chars.e].join(""),
    codeblock: [SHORTCUTKEY, plus, chars.k].join(""),
    preview: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.y].join(""),
  },
};

const emphasis = {
  bold: {
    buttonTitle: "bold",
    icon: "bold",
    output: "**" + SECTION_TEXT + "**",
    title: BUTTON_TITLE.bold,
    cursorIntON: 2,
    cursorIntOFF: 2,
    shortcut: KEY_COMBINATIONS.emphasis.bold,
  },
  italic: {
    buttonTitle: "italic",
    icon: "italic",
    output: "*" + SECTION_TEXT + "*",
    title: BUTTON_TITLE.italic,
    cursorIntON: 1,
    cursorIntOFF: 1,
    shortcut: KEY_COMBINATIONS.emphasis.italic,
  },
  heading: {
    buttonTitle: "heading",
    icon: "heading",
    output: "## ",
    title: BUTTON_TITLE.heading,
    cursorIntON: 0,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.emphasis.heading,
  },
  strikethrough: {
    buttonTitle: "strikethrough",
    icon: "strikethrough",
    output: "~~" + SECTION_TEXT + "~~",
    title: BUTTON_TITLE.strikethrough,
    cursorIntON: 2,
    cursorIntOFF: 2,
    shortcut: KEY_COMBINATIONS.emphasis.strikethrough,
  },
};

const undoRedo = {
  undo: {
    buttonTitle: "undo",
    icon: "undo",
    title: BUTTON_TITLE.undo,
    shortcut: KEY_COMBINATIONS.undoRedo.undo,
  },
  redo: {
    buttonTitle: "redo",
    icon: "redo",
    title: BUTTON_TITLE.redo,
    shortcut: KEY_COMBINATIONS.undoRedo.redo,
  },
};

const hyperlink = {
  hyperlink: {
    buttonTitle: "hyperlink",
    icon: "linkify",
    title: BUTTON_TITLE.hyperlink,
    shortcut: KEY_COMBINATIONS.hyperlink.hyperlink,
  },
};

const media = {
  image: {
    buttonTitle: "image",
    icon: "file image",
    output: "",
    title: BUTTON_TITLE.image,
    cursorIntON: 0,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.media.image,
  },
  video: {
    buttonTitle: "video",
    icon: "file video",
    output: "",
    title: BUTTON_TITLE.video,
    cursorIntON: 0,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.media.video,
  },
};

// const preview = {
//   preview: {
//     buttonTitle: "preview",
//     icon: "eye",
//     output: "",
//     title: BUTTON_TITLE.preview,
//     cursorIntON: 0,
//     cursorIntOFF: 0,
//     shortcut: KEY_COMBINATIONS.preview,
//   },
// };

const lists = {
  listUl: {
    buttonTitle: "listUl",
    icon: "list ul",
    output: `- ${SECTION_TEXT}`,
    outputOnEnter: "- ",
    title: BUTTON_TITLE.listUl,
    cursorIntON: 2,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.lists.listul,
  },
  listOl: {
    buttonTitle: "listOl",
    icon: "list ol",
    output: `1. ${SECTION_TEXT}`,
    outputOnEnter: "1. ",
    title: BUTTON_TITLE.listOl,
    cursorIntON: 3,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.lists.listol,
  },
  listCheck: {
    buttonTitle: "listCheck",
    icon: "tasks",
    output: `- [ ] ${SECTION_TEXT}`,
    outputOnEnter: `- [ ] `,
    title: BUTTON_TITLE.listCheck,
    cursorIntON: 6,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.lists.listcheck,
  },
};

const sections = {
  intro: {
    buttonTitle: "sec_intro",
    output: "# " + SECTION_TEXT + " {.intro}\n#",
    title: BUTTON_TITLE.intro,
    cursorIntON: 2,
    cursorIntOFF: 10,
    cancelInt: 2,
    shortcut: KEY_COMBINATIONS.sections.intro,
    style: {
      boxSizing: "border-box",
      height: "2em",
      border: " 2px solid black",
      padding: "8px",
      borderRadius: "10px",
      background: "#fff",
      fontWeigth: "bold",
    },
    imageurl: null,
  },
  activity: {
    buttonTitle: "sec_activity",
    output: "# " + SECTION_TEXT + " {.activity}\n#",
    title: BUTTON_TITLE.activity,
    cursorIntON: 2,
    cursorIntOFF: 14,
    cancelInt: 2,
    shortcut: KEY_COMBINATIONS.sections.activity,
    style: {
      boxSizing: "border-box",
      height: "2em",
      color: "#fff",
      background: "#349946",
      padding: "10px",
      borderRadius: "10px",
    },
    imageurl: null,
  },
  check: {
    buttonTitle: "sec_check",
    output: "## " + SECTION_TEXT + " {.check}\n#",
    title: BUTTON_TITLE.check,
    cursorIntON: 3,
    cursorIntOFF: 10,
    cancelInt: 3,
    shortcut: KEY_COMBINATIONS.sections.check,
    style: {
      boxSizing: "border-box",
      background: "white",
      height: "2em",
      border: " 2px solid black",
      borderRadius: "10px",
      padding: "8px",
    },
    imageurl: "assets/public/sectionSVG/check.svg",
  },
  protip: {
    buttonTitle: "sec_protip",
    output: "## " + SECTION_TEXT + " {.protip}\n#",
    title: BUTTON_TITLE.protip,
    cursorIntON: 3,
    cursorIntOFF: 11,
    cancelInt: 3,
    shortcut: KEY_COMBINATIONS.sections.protip,
    style: {
      boxSizing: "border-box",
      height: "2em",
      border: "3px solid #ff7f00",
      background: "#fff99d",
      borderRadius: "10px",
      padding: "7px",
      fontWeigth: "bold",
    },
    imageurl: null,
  },
  challenge: {
    buttonTitle: "sec_challenge",
    output: "## " + SECTION_TEXT + " {.challenge}\n#",
    title: BUTTON_TITLE.challenge,
    cursorIntON: 3,
    cursorIntOFF: 14,
    cancelInt: 3,
    shortcut: KEY_COMBINATIONS.sections.challenge,
    style: {
      boxSizing: "border-box",
      height: "2em",
      color: "#fff",
      background: "#00b1da",
      padding: "10px",
      borderRadius: "10px",
    },
    imageurl: null,
  },
  flag: {
    buttonTitle: "sec_flag",
    output: "## " + SECTION_TEXT + " {.flag}\n#",
    title: BUTTON_TITLE.flag,
    cursorIntON: 3,
    cursorIntOFF: 9,
    cancelInt: 3,
    shortcut: KEY_COMBINATIONS.sections.flag,
    style: {
      boxSizing: "border-box",
      height: "2em",
      border: "3px dotted rgb(230, 134, 45)",
      borderRadius: "10px",
      color: "rgb(54, 161, 55)",
      background: "#fff",
      padding: "7px",
    },
    imageurl: "assets/public/sectionSVG/flag.svg",
  },
  try: {
    buttonTitle: "sec_try",
    output: "# " + SECTION_TEXT + " {.try}\n#",
    title: BUTTON_TITLE.try,
    cursorIntON: 2,
    cursorIntOFF: 8,
    cancelInt: 2,
    shortcut: KEY_COMBINATIONS.sections.try,
    style: {
      boxSizing: "border-box",
      height: "2em",
      background: "#abdbea",
      borderRadius: "10px",
      padding: "10px",
    },
    imageurl: null,
  },
  save: {
    buttonTitle: "sec_save",
    output: "## " + SECTION_TEXT + " {.save}\n#",
    title: BUTTON_TITLE.save,
    cursorIntON: 3,
    cursorIntOFF: 8,
    cancelInt: 3,
    shortcut: KEY_COMBINATIONS.sections.save,
    style: {
      boxSizing: "border-box",
      height: "2em",
      color: "rgb(36, 90, 154)",
      background: "white",
      borderRadius: "10px",
      padding: "7px",
      border: "3px solid rgb(36, 90, 154)",
    },
    imageurl: "assets/public/sectionSVG/save.svg",
  },
};

const codebuttons = {
  inline: {
    buttonTitle: "inline",
    output: "`" + SECTION_TEXT + "`",
    title: BUTTON_TITLE.inline,
    cursorIntON: 1,
    cursorIntOFF: 1,
    shortcut: KEY_COMBINATIONS.codebuttons.inline,
    style: {
      boxSizing: "border-box",
      height: "2em",
      padding: "7px",
      color: "#c7254e",
      backgroundColor: "#f9f2f4",
      border: "3px solid #ccc",
      borderRadius: "10px",
      fontWeigth: "normal",
    },
  },
  codeblock: {
    buttonTitle: "codeblock",
    output: `${temp}\n${SECTION_TEXT}\n${temp}`,
    title: BUTTON_TITLE.codeblock,
    cursorIntON: 4,
    cursorIntOFF: 5,
    shortcut: KEY_COMBINATIONS.codebuttons.codeblock,
    style: {
      boxSizing: "border-box",
      height: "2em",
      padding: "7px",
      color: "inherit",
      backgroundColor: "#f5f5f5",
      border: "3px solid #ccc",
      borderRadius: "10px",
      fontWeigth: "normal",
    },
  },
};

export {
  emphasis,
  undoRedo,
  hyperlink,
  media,
  lists,
  sections,
  codebuttons,
  KEY_COMBINATIONS,
  SHORTCUTKEY,
  SHORTCUTKEY2,
  SECTION_TEXT,
};
