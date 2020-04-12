const temp = "```";

const emphasis = [
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

const undoRedo = [
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

const saveLoadNew = [
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

const image = [
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

const lists = [
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

const sections = [
  {
    bTitle: "activity",
    icon: "",
    output: "# Tekst her {.activity}",
    title: "{Steg}",
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+a"
  },
  {
    bTitle: "intro",
    icon: "",
    output: "# Tekst her {.intro}",
    title: "{Intro}",
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+i"
  },
  {
    bTitle: "check",
    icon: "",
    output: "# Tekst her {.check}",
    title: "{Checklist}",
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+c"
  },
  {
    bTitle: "protip",
    icon: "",
    output: "# Tekst her {.protip}\n#",
    title: "{Tips}",
    cursorIntON: 0,
    cursorIntOFF: 13,
    endOutput: "#",
    shortcut: "ctrl+shift+t"
  },
  {
    bTitle: "challenge",
    icon: "",
    output: "# Tekst her {.challenge}\n#",
    title: "{Utfordring}",
    cursorIntON: 0,
    cursorIntOFF: 13,
    endOutput: "",
    shortcut: "ctrl+shift+g"
  },
  {
    bTitle: "flag",
    icon: "",
    output: "# Tekst her {.flag}",
    title: "{Flag}",
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+f"
  },
  {
    bTitle: "try",
    icon: "",
    output: "# Tekst her {.try}",
    title: "{Prøv Selv}",
    cursorIntON: 0,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+p"
  }
];

const code = [
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

export { emphasis, undoRedo, saveLoadNew, image, lists, sections, code };
