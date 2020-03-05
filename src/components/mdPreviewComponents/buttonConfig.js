const temp = "```";

const buttonConfig = [
  {
    bTitle: "bold",
    icon: "bold",
    output: "****",
    title: "",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: "b"
  },
  {
    bTitle: "italic",
    icon: "italic",
    output: "__ ",
    title: "",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: "i"
  },
  {
    bTitle: "heading",
    icon: "heading",
    output: "## ",
    title: "",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: "h"
  },
  {
    bTitle: "undo",
    icon: "undo",
    output: "",
    title: "",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "z"
  },
  {
    bTitle: "redo",
    icon: "redo",
    output: "",
    title: "",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+z"
  },
  {
    bTitle: "new",
    icon: "file",
    output: "",
    title: "",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "n"
  },
  {
    bTitle: "load",
    icon: "upload",
    output: "",
    title: "",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "l"
  },
  {
    bTitle: "save",
    icon: "save",
    output: "",
    title: "",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "s"
  },
  {
    bTitle: "image",
    icon: "file image",
    output: "",
    title: "",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "p"
  },
  {
    bTitle: "listUl",
    icon: "list ul",
    output: "- ",
    title: "",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "u"
  },
  {
    bTitle: "listOl",
    icon: "list ol",
    output: "1. ",
    title: "",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "o"
  },
  {
    bTitle: "checklist",
    icon: "tasks",
    output: "- [ ] ",
    title: "",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "t"
  },
  {
    bTitle: "activity",
    icon: "",
    output: "{.activity}\n\n",
    title: "{.Activity}",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "a"
  },
  {
    bTitle: "intro",
    icon: "",
    output: "{.intro}\n\n",
    title: "{.Intro}",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "o"
  },
  {
    bTitle: "inline",
    icon: "terminal",
    output: "``",
    title: "",
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: "e"
  },
  {
    bTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: "",
    cursorIntON: 4,
    endOutput: "",
    shortcut: "k"
  }
];

export default buttonConfig;
