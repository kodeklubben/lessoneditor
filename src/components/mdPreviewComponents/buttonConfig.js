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
    output: "**",
    title: "Italic",
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
    shortcut: "i"
  },
  {
    bTitle: "heading",
    icon: "heading",
    output: "## ",
    title: "Heading",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "h"
  },
  {
    bTitle: "strikethrough",
    icon: "strikethrough",
    output: "~~~~",
    title: "Strikethrough",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
    shortcut: "s"
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
    shortcut: "p"
  }
];

const buttonConfig5 = [
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
  }
];

const buttonConfig6 = [
  {
    bTitle: "activity",
    icon: "",
    output: "{.activity}",
    title: "{.Activity}",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+a"
  },
  {
    bTitle: "intro",
    icon: "",
    output: "{.intro}",
    title: "{.Intro}",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
    shortcut: "shift+i"
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
    shortcut: "e"
  },
  {
    bTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: "Code Block",
    cursorIntON: 4,
    cursorIntOFF: 5,
    endOutput: "\n",
    shortcut: "k"
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
