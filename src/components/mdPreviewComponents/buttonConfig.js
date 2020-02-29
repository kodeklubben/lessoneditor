const temp = "```";

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
    bTitle: "inline",
    icon: "",
    output: "``",
    title: "Inline Code",
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: ""
  },
  {
    bTitle: "codeblock",
    icon: "",
    output: `${temp}\n\n${temp}`,
    title: "Codeblock",
    cursorIntON: 4,
    endOutput: "\n"
  }
];

export default buttonConfig;
