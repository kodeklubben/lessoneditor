const temp = "```";

const buttonConfig = [
  {
    bTitle: "bold",
    icon: "bold",
    output: "****",
    title: "Bold",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: "ctrl+b"
  },
  {
    bTitle: "italic",
    icon: "italic",
    output: "**",
    title: "Italic",
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: "ctrl+i"
  },
  {
    bTitle: "heading",
    icon: "heading",
    output: "## ",
    title: "Heading",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+h"
  },
  {
    bTitle: "strikethrough",
    icon: "strikethrough",
    output: "~~~~",
    title: "Strikethrough",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: "ctrl+s"
  }
];

const buttonConfig2 = [
  {
    bTitle: "undo",
    icon: "undo",
    output: "",
    title: "Undo",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+z"
  },
  {
    bTitle: "redo",
    icon: "redo",
    output: "",
    title: "Redo",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+shift+z"
  }
];

const buttonConfig3 = [
  {
    bTitle: "new",
    icon: "file",
    output: "",
    title: "New",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+shift+backspace"
  },
  {
    bTitle: "load",
    icon: "upload",
    output: "",
    title: "Load",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+shift+l"
  },
  {
    bTitle: "save",
    icon: "save",
    output: "",
    title: "Save",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+shift+s"
  }
];

const buttonConfig4 = [
  {
    bTitle: "image",
    icon: "file image",
    output: "",
    title: "Image",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+p"
  }
];

const buttonConfig5 = [
  {
    bTitle: "listUl",
    icon: "list ul",
    output: "- ",
    title: "List",
    cursorIntON: 2,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+u"
  },
  {
    bTitle: "listOl",
    icon: "list ol",
    output: "1. ",
    title: "Ordered List",
    cursorIntON: 3,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+shift+u"
  },
  {
    bTitle: "listCheck",
    icon: "tasks",
    output: "- [ ] ",
    title: "Checklist",
    cursorIntON: 6,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "ctrl+y"
  }
];

const buttonConfig6 = [
  {
    bTitle: "activity",
    icon: "",
    output: "# Tekst her {.activity}",
    title: "{Steg}",
    cursorIntON: 11,
    cursorIntOFF: 11,
    endOutput: "",
    shortcut: "ctrl+shift+a"
  },
  {
    bTitle: "intro",
    icon: "",
    output: "{.intro}",
    title: "{Intro}",
    cursorIntON: 8,
    cursorIntOFF: 8,
    endOutput: "",
    shortcut: "ctrl+shift+i"
  },
  {
    bTitle: "check",
    icon: "",
    output: "{.check}",
    title: "{Checklist}",
    cursorIntON: 8,
    cursorIntOFF: 8,
    endOutput: "",
    shortcut: "ctrl+shift+c"
  },
  {
    bTitle: "protip",
    icon: "",
    output: "{.protip}",
    title: "{Tips}",
    cursorIntON: 9,
    cursorIntOFF: 9,
    endOutput: "",
    shortcut: "ctrl+shift+t"
  },
  {
    bTitle: "challenge",
    icon: "",
    output: "{.challenge}",
    title: "{Utfordring}",
    cursorIntON: 12,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+g"
  },
  {
    bTitle: "flag",
    icon: "",
    output: "{.flag}",
    title: "{Flag}",
    cursorIntON: 12,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+f"
  },
  {
    bTitle: "try",
    icon: "",
    output: "{.try}",
    title: "{Prøv Selv}",
    cursorIntON: 12,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+p"
  }
];

const buttonConfig7 = [
  {
    bTitle: "inline",
    icon: "terminal",
    output: "``",
    title: "Inline Code",
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: "ctrl+e"
  },
  {
    bTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: "Code Block",
    cursorIntON: 4,
    cursorIntOFF: 5,
    endOutput: "\n",
    shortcut: "ctrl+k"
  }
];

export {
  buttonConfig,
  buttonConfig2,
  buttonConfig3,
  buttonConfig4,
  buttonConfig5,
  buttonConfig6,
  buttonConfig7
};
