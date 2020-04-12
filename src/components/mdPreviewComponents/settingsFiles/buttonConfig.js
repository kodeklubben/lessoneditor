import * as GUI_TEXT from "./languages/editor_NO";

const temp = "```";

const SHORTCUTKEY = "ctrl";
const SHORTCUTKEY2 = "shift";
const KEY = {
  bold: `${SHORTCUTKEY}+b`,
  italic: `${SHORTCUTKEY}+i`,
  heading: `${SHORTCUTKEY}+h`,
  strikethrough: `${SHORTCUTKEY}+s`,
  undo: `${SHORTCUTKEY}+z`,
  redo: `${SHORTCUTKEY}+${SHORTCUTKEY2}+z`,
  new: `${SHORTCUTKEY}+${SHORTCUTKEY2}+backspace`,
  load: `${SHORTCUTKEY}+${SHORTCUTKEY2}+l`,
  save: `${SHORTCUTKEY}+${SHORTCUTKEY2}+s`,
  image: `${SHORTCUTKEY}+p`,
  listUl: `${SHORTCUTKEY}+u`,
  listOl: `${SHORTCUTKEY}+${SHORTCUTKEY2}+u`,
  listCheck: `${SHORTCUTKEY}+y`,
  activity: `${SHORTCUTKEY}+${SHORTCUTKEY2}+a`,
  intro: `${SHORTCUTKEY}+${SHORTCUTKEY2}+i`,
  check: `${SHORTCUTKEY}+${SHORTCUTKEY2}+c`,
  protip: `${SHORTCUTKEY}+${SHORTCUTKEY2}+t`,
  challenge: `${SHORTCUTKEY}+${SHORTCUTKEY2}+g`,
  flag: `${SHORTCUTKEY}+${SHORTCUTKEY2}+f`,
  try: `${SHORTCUTKEY}+${SHORTCUTKEY2}+p`,
  inLine: `${SHORTCUTKEY}+e`,
  codeBlock: `${SHORTCUTKEY}+k`
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
    shortcut: KEY.bold
  },
  {
    bTitle: "italic",
    icon: "italic",
    output: "**",
    title: GUI_TEXT.BUTTON_TITLE.italic,
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: KEY.italic
  },
  {
    bTitle: "heading",
    icon: "heading",
    output: "## ",
    title: GUI_TEXT.BUTTON_TITLE.heading,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY.heading
  },
  {
    bTitle: "strikethrough",
    icon: "strikethrough",
    output: "~~~~",
    title: GUI_TEXT.BUTTON_TITLE.strikethrough,
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: KEY.strikethrough
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
    shortcut: KEY.undo
  },
  {
    bTitle: "redo",
    icon: "redo",
    output: "",
    title: GUI_TEXT.BUTTON_TITLE.redo,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY.redo
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
    shortcut: KEY.new
  },
  {
    bTitle: "load",
    icon: "upload",
    output: "",
    title: GUI_TEXT.BUTTON_TITLE.load,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY.load
  },
  {
    bTitle: "save",
    icon: "save",
    output: "",
    title: GUI_TEXT.BUTTON_TITLE.save,
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY.save
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
    shortcut: KEY.image
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
    shortcut: KEY.listUl
  },
  {
    bTitle: "listOl",
    icon: "list ol",
    output: "1. ",
    title: GUI_TEXT.BUTTON_TITLE.listOl,
    cursorIntON: 3,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY.listOl
  },
  {
    bTitle: "listCheck",
    icon: "tasks",
    output: "- [ ] ",
    title: GUI_TEXT.BUTTON_TITLE.listCheck,
    cursorIntON: 6,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: KEY.listCheck
  }
];

const sections = [
  {
    bTitle: "sec_activity",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.activity}",
    title: GUI_TEXT.BUTTON_TITLE.activity,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY.activity
  },
  {
    bTitle: "sec_intro",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.intro}",
    title: GUI_TEXT.BUTTON_TITLE.intro,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY.intro
  },
  {
    bTitle: "sec_check",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.check}",
    title: GUI_TEXT.BUTTON_TITLE.check,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY.check
  },
  {
    bTitle: "sec_protip",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.protip}\n#",
    title: GUI_TEXT.BUTTON_TITLE.protip,
    cursorIntON: 0,
    cursorIntOFF: 13,
    endOutput: "#",
    shortcut: KEY.protip
  },
  {
    bTitle: "sec_challenge",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.challenge}\n#",
    title: GUI_TEXT.BUTTON_TITLE.challenge,
    cursorIntON: 0,
    cursorIntOFF: 13,
    endOutput: "",
    shortcut: KEY.challenge
  },
  {
    bTitle: "sec_flag",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + " {.flag}",
    title: GUI_TEXT.BUTTON_TITLE.flag,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY.flag
  },
  {
    bTitle: "sec_try",
    icon: "",
    output: "# " + GUI_TEXT.SEC_TEXT + "{.try}",
    title: GUI_TEXT.BUTTON_TITLE.try,
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: KEY.try
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
    shortcut: KEY.inLine
  },
  {
    bTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: GUI_TEXT.BUTTON_TITLE.codeblock,
    cursorIntON: 4,
    cursorIntOFF: 5,
    endOutput: "\n",
    shortcut: KEY.codeBlock
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
  KEY,
  SHORTCUTKEY,
  SHORTCUTKEY2
};
