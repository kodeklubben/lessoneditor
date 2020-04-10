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
<<<<<<< HEAD
    shortcut: "ctrl+b",
=======
    shortcut: "ctrl+b"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "italic",
    icon: "italic",
    output: "**",
    title: "Italic",
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: "",
<<<<<<< HEAD
    shortcut: "ctrl+i",
=======
    shortcut: "ctrl+i"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "heading",
    icon: "heading",
    output: "## ",
    title: "Heading",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
<<<<<<< HEAD
    shortcut: "ctrl+h",
=======
    shortcut: "ctrl+h"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "strikethrough",
    icon: "strikethrough",
    output: "~~~~",
    title: "Strikethrough",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: "",
<<<<<<< HEAD
    shortcut: "ctrl+s",
  },
=======
    shortcut: "ctrl+s"
  }
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
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
<<<<<<< HEAD
    shortcut: "ctrl+z",
=======
    shortcut: "ctrl+z"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "redo",
    icon: "redo",
    output: "",
    title: "Redo",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
<<<<<<< HEAD
    shortcut: "ctrl+shift+z",
  },
=======
    shortcut: "ctrl+shift+z"
  }
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
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
<<<<<<< HEAD
    shortcut: "ctrl+shift+backspace",
=======
    shortcut: "ctrl+shift+backspace"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "load",
    icon: "upload",
    output: "",
    title: "Load",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
<<<<<<< HEAD
    shortcut: "ctrl+shift+l",
=======
    shortcut: "ctrl+shift+l"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "save",
    icon: "save",
    output: "",
    title: "Save",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "",
<<<<<<< HEAD
    shortcut: "ctrl+shift+s",
  },
=======
    shortcut: "ctrl+shift+s"
  }
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
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
<<<<<<< HEAD
    shortcut: "ctrl+p",
  },
=======
    shortcut: "ctrl+p"
  }
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
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
<<<<<<< HEAD
    shortcut: "ctrl+u",
=======
    shortcut: "ctrl+u"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "listOl",
    icon: "list ol",
    output: "1. ",
    title: "Ordered List",
    cursorIntON: 3,
    cursorIntOFF: 0,
    endOutput: "",
<<<<<<< HEAD
    shortcut: "ctrl+shift+u",
=======
    shortcut: "ctrl+shift+u"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "listCheck",
    icon: "tasks",
    output: "- [ ] ",
    title: "Checklist",
    cursorIntON: 6,
    cursorIntOFF: 0,
    endOutput: "",
<<<<<<< HEAD
    shortcut: "ctrl+y",
  },
=======
    shortcut: "ctrl+y"
  }
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
];

const buttonConfig6 = [
  {
    bTitle: "activity",
    icon: "",
<<<<<<< HEAD
    output: "# Tekst her {.activity}",
    title: "{Steg}",
    cursorIntON: 11,
    cursorIntOFF: 11,
    endOutput: "",
    shortcut: "ctrl+shift+a",
=======
    output: "{.activity}",
    title: "{.Activity}",
    cursorIntON: 11,
    cursorIntOFF: 11,
    endOutput: "",
    shortcut: "ctrl+shift+a"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "intro",
    icon: "",
    output: "{.intro}",
<<<<<<< HEAD
    title: "{Intro}",
    cursorIntON: 8,
    cursorIntOFF: 8,
    endOutput: "",
    shortcut: "ctrl+shift+i",
=======
    title: "{.Intro}",
    cursorIntON: 8,
    cursorIntOFF: 8,
    endOutput: "",
    shortcut: "ctrl+shift+i"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "check",
    icon: "",
    output: "{.check}",
<<<<<<< HEAD
    title: "{Checklist}",
    cursorIntON: 8,
    cursorIntOFF: 8,
    endOutput: "",
    shortcut: "ctrl+shift+c",
=======
    title: "{.Check}",
    cursorIntON: 8,
    cursorIntOFF: 8,
    endOutput: "",
    shortcut: "ctrl+shift+c"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "protip",
    icon: "",
    output: "{.protip}",
<<<<<<< HEAD
    title: "{Tips}",
    cursorIntON: 9,
    cursorIntOFF: 9,
    endOutput: "",
    shortcut: "ctrl+shift+t",
=======
    title: "{.Protip}",
    cursorIntON: 9,
    cursorIntOFF: 9,
    endOutput: "",
    shortcut: "ctrl+shift+p"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "challenge",
    icon: "",
    output: "{.challenge}",
<<<<<<< HEAD
    title: "{Utfordring}",
    cursorIntON: 12,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+g",
  },
  {
    bTitle: "flag",
    icon: "",
    output: "{.flag}",
    title: "{Flag}",
    cursorIntON: 12,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+f",
  },
  {
    bTitle: "try",
    icon: "",
    output: "{.try}",
    title: "{Prøv Selv}",
    cursorIntON: 12,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+p",
  },
=======
    title: "{.Challenge}",
    cursorIntON: 12,
    cursorIntOFF: 12,
    endOutput: "",
    shortcut: "ctrl+shift+g"
  }
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
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
<<<<<<< HEAD
    shortcut: "ctrl+e",
=======
    shortcut: "ctrl+e"
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
  },
  {
    bTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: "Code Block",
    cursorIntON: 4,
    cursorIntOFF: 5,
    endOutput: "\n",
<<<<<<< HEAD
    shortcut: "ctrl+k",
  },
=======
    shortcut: "ctrl+k"
  }
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
];

export {
  buttonConfig,
  buttonConfig2,
  buttonConfig3,
  buttonConfig4,
  buttonConfig5,
  buttonConfig6,
<<<<<<< HEAD
  buttonConfig7,
=======
  buttonConfig7
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
};
