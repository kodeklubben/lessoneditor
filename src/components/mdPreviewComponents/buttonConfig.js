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
    shortcut: "b"
  },
  {
    bTitle: "italic",
    icon: "italic",
    output: "__ ",
    title: "Italic",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: "i"
  },
  {
    bTitle: "heading",
    icon: "heading",
    output: "## ",
    title: "Heading",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: "h"
  },
  {
    bTitle: "undo",
    icon: "undo",
    output: "",
    title: "Undo",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "z"
  },
  {
    bTitle: "redo",
    icon: "redo",
    output: "",
    title: "Redo",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+z"
  },
  {
    bTitle: "new",
    icon: "file",
    output: "",
    title: "New",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+backspace"
  },
  {
    bTitle: "load",
    icon: "upload",
    output: "",
    title: "Load",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+l"
  },
  {
    bTitle: "save",
    icon: "save",
    output: "",
    title: "Save",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+s"
  },
  {
    bTitle: "image",
    icon: "file image",
    output: "",
    title: "Image",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "p"
  },
  {
    bTitle: "listUl",
    icon: "list ul",
    output: "- ",
    title: "List",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "u"
  },
  {
    bTitle: "listOl",
    icon: "list ol",
    output: "1. ",
    title: "Ordered List",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+u"
  },
  {
    bTitle: "checklist",
    icon: "tasks",
    output: "- [ ] ",
    title: "Checklist",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "y"
  },
  {
    bTitle: "activity",
    icon: "",
    output: "{.activity}\n\n",
    title: "{.Activity}",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+a"
  },
  {
    bTitle: "intro",
    icon: "",
    output: "{.intro}\n\n",
    title: "{.Intro}",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+i"
  },
  {
    bTitle: "inline",
    icon: "terminal",
    output: "``",
    title: "Inline Code",
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: "e"
  },
  {
    bTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: "Code Block",
    cursorIntON: 4,
    endOutput: "",
    shortcut: "k"
  }
];

export default buttonConfig;
