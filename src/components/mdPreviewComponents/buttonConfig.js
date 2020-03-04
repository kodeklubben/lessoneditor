const temp = "```";

var listOL = 1;

const buttonConfig = [
  {
    bTitle: "bold",
    icon: "bold",
    output: "****",
    title: "",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: ""
  },
  {
    bTitle: "italic",
    icon: "italic",
    output: "__ ",
    title: "",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: ""
  },
  {
    bTitle: "heading",
    icon: "heading",
    output: "## ",
    title: "heading",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: ""
  },
  {
    bTitle: "undo",
    icon: "undo",
    output: "",
    title: "undo",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "redo",
    icon: "redo",
    output: "",
    title: "redo",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "new",
    icon: "file",
    output: "",
    title: "new",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "load",
    icon: "upload",
    output: "",
    title: "Load",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "save",
    icon: "save",
    output: "",
    title: "Save",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "image",
    icon: "file image",
    output: "",
    title: "image",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "listUl",
    icon: "list ul",
    output: "- ",
    title: "listUl",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "listOl",
    icon: "list ol",
    output: "1. ",
    title: "listOl",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "activity",
    icon: "",
    output: "{.activity}",
    title: "Steg",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "\n\n"
  },
  {
    bTitle: "intro",
    icon: "",
    output: "{.intro}",
    title: "Intro",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "\n\n"
  },
  {
    bTitle: "inline",
    icon: "terminal",
    output: "``",
    title: "Inline Code",
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: ""
  },
  {
    bTitle: "codeblock",
    icon: "code",
    output: `${temp}\n\n${temp}`,
    title: "Codeblock",
    cursorIntON: 4,
    endOutput: "\n"
  }
];

export default buttonConfig;
