import { BUTTON_TITLE, DEFAULT_TEXT } from "../../../settingsFiles/languages/editor_NO";

const backticks = "```";

// SHORTCUTKEY options: "ctrl", "shift", "alt", "option", "command"
const SHORTCUTKEY = "ctrl";
const SHORTCUTKEY2 = "shift";

// SHORTCUTKEYS config
const KEY_COMBINATIONS = {
  emphasis: {
    bold: [SHORTCUTKEY, "+", "b"].join(""),
    italic: [SHORTCUTKEY, "+", "i"].join(""),
    //heading: [SHORTCUTKEY, "+", "h"].join(""),
    strikethrough: [SHORTCUTKEY, "+", "s"].join(""),
  },
  undoRedo: {
    undo: [SHORTCUTKEY, "+", "z"].join(""),
    redo: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "z"].join(""),
  },
  hyperlink: { hyperlink: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "h"].join("") },
  media: {
    image: [SHORTCUTKEY, "+", "p"].join(""),
    video: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "u"].join(""),
  },
  lists: {
    listul: [SHORTCUTKEY, "+", "u"].join(""),
    listol: [SHORTCUTKEY, "+", "o"].join(""),
    listcheck: [SHORTCUTKEY, "+", "r"].join(""),
  },
  fileExplorer: { explorer: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "d"].join("") },
  sections: {
    activity: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "a"].join(""),
    intro: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "i"].join(""),
    check: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "c"].join(""),
    protip: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "p"].join(""),
    challenge: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "g"].join(""),
    flag: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "f"].join(""),
    try: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "t"].join(""),
    save: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "s"].join(""),
  },
  codebuttons: {
    inline: [SHORTCUTKEY, "+", "e"].join(""),
    codeblock: [SHORTCUTKEY, "+", "k"].join(""),
    preview: [SHORTCUTKEY, "+", SHORTCUTKEY2, "+", "y"].join(""),
  },
  preview: { preview: [SHORTCUTKEY, "+", SHORTCUTKEY2 + "o"].join("") },
};

const emphasis = {
  bold: {
    slug: "bold",
    icon: "bold",
    output: `**${DEFAULT_TEXT}**`,
    title: BUTTON_TITLE.bold,
    cursorIntON: 2,
    cursorIntOFF: 2,
    shortcut: KEY_COMBINATIONS.emphasis.bold,
  },
  italic: {
    slug: "italic",
    icon: "italic",
    output: "*" + DEFAULT_TEXT + "*",
    title: BUTTON_TITLE.italic,
    cursorIntON: 1,
    cursorIntOFF: 1,
    shortcut: KEY_COMBINATIONS.emphasis.italic,
  },
  // heading: {
  //   slug: "heading",
  //   icon: "heading",
  //   output: "## ",
  //   title: BUTTON_TITLE.heading,
  //   cursorIntON: 0,
  //   cursorIntOFF: 0,
  //   shortcut: KEY_COMBINATIONS.emphasis.heading,
  // },
  strikethrough: {
    slug: "strikethrough",
    icon: "strikethrough",
    output: "~~" + DEFAULT_TEXT + "~~",
    title: BUTTON_TITLE.strikethrough,
    cursorIntON: 2,
    cursorIntOFF: 2,
    shortcut: KEY_COMBINATIONS.emphasis.strikethrough,
  },
};

const undoRedo = {
  undo: {
    slug: "undo",
    icon: "undo",
    title: BUTTON_TITLE.undo,
    shortcut: KEY_COMBINATIONS.undoRedo.undo,
  },
  redo: {
    slug: "redo",
    icon: "redo",
    title: BUTTON_TITLE.redo,
    shortcut: KEY_COMBINATIONS.undoRedo.redo,
  },
};

const hyperlink = {
  hyperlink: {
    slug: "hyperlink",
    icon: "linkify",
    title: BUTTON_TITLE.hyperlink,
    shortcut: KEY_COMBINATIONS.hyperlink.hyperlink,
  },
};

const media = {
  image: {
    slug: "image",
    icon: "file image",
    output: "",
    title: BUTTON_TITLE.image,
    shortcut: KEY_COMBINATIONS.media.image,
  },
  video: {
    slug: "video",
    icon: "file video",
    output: "",
    title: BUTTON_TITLE.video,
    shortcut: KEY_COMBINATIONS.media.video,
  },
};

const preview = {
  preview: {
    slug: "preview",
    icon: "eye",
    output: "",
    title: BUTTON_TITLE.preview,
    cursorIntON: 0,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.preview.preview,
  },
};

const lists = {
  listUl: {
    slug: "listUl",
    icon: "list ul",
    output: `- ${DEFAULT_TEXT}`,
    outputOnEnter: "- ",
    title: BUTTON_TITLE.listUl,
    cursorIntON: 2,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.lists.listul,
  },
  listOl: {
    slug: "listOl",
    icon: "list ol",
    output: `1. ${DEFAULT_TEXT}`,
    outputOnEnter: "1. ",
    title: BUTTON_TITLE.listOl,
    cursorIntON: 3,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.lists.listol,
  },
  listCheck: {
    slug: "listCheck",
    icon: "tasks",
    output: `- [ ] ${DEFAULT_TEXT}`,
    outputOnEnter: `- [ ] `,
    title: BUTTON_TITLE.listCheck,
    cursorIntON: 6,
    cursorIntOFF: 0,
    shortcut: KEY_COMBINATIONS.lists.listcheck,
  },
};

const fileExplorer = {
  explorer: {
    slug: "explorer",
    icon: "folder open",
    output: "",
    title: BUTTON_TITLE.explorer,

    shortcut: KEY_COMBINATIONS.fileExplorer.explorer,
  },
};

const sections = {
  intro: {
    slug: "sec_intro",
    output: "# " + DEFAULT_TEXT + " {.intro}\n",
    title: BUTTON_TITLE.intro,
    cursorIntON: 2,
    cursorIntOFF: 10,
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
    slug: "sec_activity",
    output: "# " + DEFAULT_TEXT + " {.activity}\n",
    title: BUTTON_TITLE.activity,
    cursorIntON: 2,
    cursorIntOFF: 13,
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
    slug: "sec_check",
    output: "## " + DEFAULT_TEXT + " {.check}\n",
    title: BUTTON_TITLE.check,
    cursorIntON: 3,
    cursorIntOFF: 10,
    shortcut: KEY_COMBINATIONS.sections.check,
    style: {
      boxSizing: "border-box",
      background: "white",
      height: "2em",
      border: " 2px solid black",
      borderRadius: "10px",
      padding: "8px",
      whiteSpace: "nowrap",
    },
    imageurl: "assets/public/sectionSVG/check.svg",
  },
  protip: {
    slug: "sec_protip",
    output: "## " + DEFAULT_TEXT + " {.protip}\n",
    title: BUTTON_TITLE.protip,
    cursorIntON: 3,
    cursorIntOFF: 11,
    shortcut: KEY_COMBINATIONS.sections.protip,
    style: {
      boxSizing: "border-box",
      height: "2em",
      border: "3px solid #ff7f00",
      background: "#fff99d",
      borderRadius: "10px",
      padding: "7px",
      fontWeigth: "bold",
      whiteSpace: "nowrap",
    },
    imageurl: null,
  },
  flag: {
    slug: "sec_flag",
    output: "## " + DEFAULT_TEXT + " {.flag}\n",
    title: BUTTON_TITLE.flag,
    cursorIntON: 3,
    cursorIntOFF: 9,
    shortcut: KEY_COMBINATIONS.sections.flag,
    style: {
      boxSizing: "border-box",
      height: "2em",
      border: "3px dotted rgb(230, 134, 45)",
      borderRadius: "10px",
      color: "rgb(54, 161, 55)",
      background: "#fff",
      padding: "7px",
      whiteSpace: "nowrap",
    },
    imageurl: "assets/public/sectionSVG/flag.svg",
  },
  challenge: {
    slug: "sec_challenge",
    output: "## " + DEFAULT_TEXT + " {.challenge}\n",
    title: BUTTON_TITLE.challenge,
    cursorIntON: 3,
    cursorIntOFF: 14,
    shortcut: KEY_COMBINATIONS.sections.challenge,
    style: {
      boxSizing: "border-box",
      height: "2em",
      color: "#fff",
      background: "#00b1da",
      padding: "10px",
      borderRadius: "10px",
      whiteSpace: "nowrap",
    },
    imageurl: null,
  },

  try: {
    slug: "sec_try",
    output: "# " + DEFAULT_TEXT + " {.try}\n",
    title: BUTTON_TITLE.try,
    cursorIntON: 2,
    cursorIntOFF: 8,
    shortcut: KEY_COMBINATIONS.sections.try,
    style: {
      boxSizing: "border-box",
      height: "2em",
      background: "#abdbea",
      borderRadius: "10px",
      padding: "10px",
      whiteSpace: "nowrap",
    },
    imageurl: null,
  },
  save: {
    slug: "sec_save",
    output: "## " + DEFAULT_TEXT + " {.save}\n",
    title: BUTTON_TITLE.save,
    cursorIntON: 3,
    cursorIntOFF: 9,
    shortcut: KEY_COMBINATIONS.sections.save,
    style: {
      boxSizing: "border-box",
      height: "2em",
      color: "rgb(36, 90, 154)",
      background: "white",
      borderRadius: "10px",
      padding: "7px",
      border: "3px solid rgb(36, 90, 154)",
      whiteSpace: "nowrap",
    },
    imageurl: "assets/public/sectionSVG/save.svg",
  },
};

const codebuttons = {
  codeblock: {
    slug: "codeblock",
    output: `${backticks}\n${DEFAULT_TEXT}\n${backticks}`,
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
      whiteSpace: "nowrap",
    },
  },
  inline: {
    slug: "inline",
    output: "`" + DEFAULT_TEXT + "`",
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
      whiteSpace: "nowrap",
    },
  },
};

export {
  emphasis,
  undoRedo,
  hyperlink,
  media,
  lists,
  fileExplorer,
  sections,
  codebuttons,
  preview,
  KEY_COMBINATIONS,
  SHORTCUTKEY,
  SHORTCUTKEY2,
  DEFAULT_TEXT,
};
