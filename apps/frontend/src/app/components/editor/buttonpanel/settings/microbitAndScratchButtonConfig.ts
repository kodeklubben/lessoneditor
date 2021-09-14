import { SECTION_TEXT } from "../../settingsFiles/languages/editor_NO";

// SHORTCUTKEY options: "ctrl", "shift", "alt", "option", "command"
const SHORTCUTKEY = "ctrl";
const SHORTCUTKEY2 = "shift";
const plus = "+";

const chars = {
  en: "1",
  to: "2",
  tre: "3",
  fire: "4",
  fem: "5",
  seks: "6",
  syv: "7",
  atte: "8",
  ni: "9",
  null: "0",
  a: "a",
  b: "b",
  c: "c",
  d: "d",
  e: "e",
  f: "f",
  g: "g",
  h: "h",
  i: "i",
  j: "j",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  o: "o",
  p: "p",
  q: "q",
  r: "r",
  s: "s",
  t: "t",
  u: "u",
  v: "v",
  w: "w",
  x: "x",
  y: "y",
  z: "z",
};

// SHORTCUTKEYS config
const KEY_COMBINATIONS_MICROBIT = {
  basic: [SHORTCUTKEY, plus, chars.en].join(""),
  input: [SHORTCUTKEY, plus, chars.to].join(""),
  music: [SHORTCUTKEY, plus, chars.tre].join(""),
  led: [SHORTCUTKEY, plus, chars.fire].join(""),
  radio: [SHORTCUTKEY, plus, chars.fem].join(""),
  loops: [SHORTCUTKEY, plus, chars.seks].join(""),
  logic: [SHORTCUTKEY, plus, chars.syv].join(""),
  variables: [SHORTCUTKEY, plus, chars.atte].join(""),
  math: [SHORTCUTKEY, plus, chars.ni].join(""),
  functions: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.en].join(""),
  arrays: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.to].join(""),
  text: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.tre].join(""),
  game: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.fire].join(""),
  images: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.fem].join(""),
  pins: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.seks].join(""),
  serial: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.syv].join(""),
  control: [SHORTCUTKEY, plus, SHORTCUTKEY2, plus, chars.atte].join(""),
};

const KEY_COMBINATIONS_SCRATCH = {
  motion: [SHORTCUTKEY, plus, chars.en].join(""),
  looks: [SHORTCUTKEY, plus, chars.to].join(""),
  sound: [SHORTCUTKEY, plus, chars.tre].join(""),
  pen: [SHORTCUTKEY, plus, chars.fire].join(""),
  data: [SHORTCUTKEY, plus, chars.fem].join(""),
  events: [SHORTCUTKEY, plus, chars.seks].join(""),
  control: [SHORTCUTKEY, plus, chars.syv].join(""),
  sensing: [SHORTCUTKEY, plus, chars.atte].join(""),
  operators: [SHORTCUTKEY, plus, chars.ni].join(""),
  moreblocks: [SHORTCUTKEY, plus, chars.null].join(""),
};

const microbitbuttons = {
  basic: {
    buttonTitle: "basic",
    output: "`" + SECTION_TEXT + "`{.microbitbasic}",
    title: "Basis",
    cursorIntON: 1,
    cursorIntOFF: 17,
    shortcut: KEY_COMBINATIONS_MICROBIT.basic,
    color: "#1e90ff",
  },
  input: {
    buttonTitle: "input",
    output: "`" + SECTION_TEXT + "`{.microbitinput}",
    title: "Inndata",
    cursorIntON: 1,
    cursorIntOFF: 17,
    shortcut: KEY_COMBINATIONS_MICROBIT.input,
    color: "#d400d4",
  },
  music: {
    buttonTitle: "music",
    output: "`" + SECTION_TEXT + "`{.microbitmusic}",
    title: "Musikk",
    cursorIntON: 1,
    cursorIntOFF: 17,
    shortcut: KEY_COMBINATIONS_MICROBIT.music,
    color: "#e63022",
  },
  led: {
    buttonTitle: "led",
    output: "`" + SECTION_TEXT + "`{.microbitled}",
    title: "Skjerm",
    cursorIntON: 1,
    cursorIntOFF: 15,
    shortcut: KEY_COMBINATIONS_MICROBIT.led,
    color: "#5c2d91",
  },
  radio: {
    buttonTitle: "radio",
    output: "`" + SECTION_TEXT + "`{.microbitradio}",
    title: "Radio",
    cursorIntON: 1,
    cursorIntOFF: 17,
    shortcut: KEY_COMBINATIONS_MICROBIT.radio,
    color: "#e3008c",
  },
  loops: {
    buttonTitle: "loops",
    output: "`" + SECTION_TEXT + "`{.microbitloops}",
    title: "Løkker",
    cursorIntON: 1,
    cursorIntOFF: 17,
    shortcut: KEY_COMBINATIONS_MICROBIT.loops,
    color: "#0a0",
  },
  logic: {
    buttonTitle: "logic",
    output: "`" + SECTION_TEXT + "`{.microbitlogic}",
    title: "Logikk",
    cursorIntON: 1,
    cursorIntOFF: 17,
    shortcut: KEY_COMBINATIONS_MICROBIT.logic,
    color: "#00a4a6",
  },
  variables: {
    buttonTitle: "variables",
    output: "`" + SECTION_TEXT + "`{.microbitvariables}",
    title: "Variabler",
    cursorIntON: 1,
    cursorIntOFF: 21,
    shortcut: KEY_COMBINATIONS_MICROBIT.variables,
    color: "#dc143c",
  },
  math: {
    buttonTitle: "math",
    output: "`" + SECTION_TEXT + "`{.microbitmath}",
    title: "Matematikk",
    cursorIntON: 1,
    cursorIntOFF: 16,
    shortcut: KEY_COMBINATIONS_MICROBIT.math,
    color: "#9400d3",
  },
  functions: {
    buttonTitle: "functions",
    output: "`" + SECTION_TEXT + "`{.microbitfunctions}",
    title: "Funksjoner",
    cursorIntON: 1,
    cursorIntOFF: 21,
    shortcut: KEY_COMBINATIONS_MICROBIT.functions,
    color: "#3455db",
  },
  arrays: {
    buttonTitle: "arrays",
    output: "`" + SECTION_TEXT + "`{.microbitarrays}",
    title: "Tabeller",
    cursorIntON: 1,
    cursorIntOFF: 18,
    shortcut: KEY_COMBINATIONS_MICROBIT.arrays,
    color: "#e65722",
  },
  text: {
    buttonTitle: "text",
    output: "`" + SECTION_TEXT + "`{.microbittext}",
    title: "Tekst",
    cursorIntON: 1,
    cursorIntOFF: 16,
    shortcut: KEY_COMBINATIONS_MICROBIT.text,
    color: "#b8860b",
  },
  game: {
    buttonTitle: "game",
    output: "`" + SECTION_TEXT + "`{.microbitgame}",
    title: "Spill",
    cursorIntON: 1,
    cursorIntOFF: 16,
    shortcut: KEY_COMBINATIONS_MICROBIT.game,
    color: "#007a4b",
  },
  images: {
    buttonTitle: "images",
    output: "`" + SECTION_TEXT + "`{.microbitimages}",
    title: "Bilder",
    cursorIntON: 1,
    cursorIntOFF: 18,
    shortcut: KEY_COMBINATIONS_MICROBIT.images,
    color: "#7600a8",
  },
  pins: {
    buttonTitle: "pins",
    output: "`" + SECTION_TEXT + "`{.microbitpins}",
    title: "Tilkobling",
    cursorIntON: 1,
    cursorIntOFF: 16,
    shortcut: KEY_COMBINATIONS_MICROBIT.pins,
    color: "#b22222",
  },
  serial: {
    buttonTitle: "seial",
    output: "`" + SECTION_TEXT + "`{.microbitserial}",
    title: "Serieport",
    cursorIntON: 1,
    cursorIntOFF: 18,
    shortcut: KEY_COMBINATIONS_MICROBIT.serial,
    color: "#002050",
  },
  control: {
    buttonTitle: "control",
    output: "`" + SECTION_TEXT + "`{.microbitcontrol}",
    title: "Styring",
    cursorIntON: 1,
    cursorIntOFF: 19,
    shortcut: KEY_COMBINATIONS_MICROBIT.control,
    color: "#333",
  },
};

const scratchbuttons = {
  motion: {
    buttonTitle: "motion",
    output: "`" + SECTION_TEXT + "`{.blockmotion}",
    title: "Bevegelse",
    cursorIntON: 1,
    cursorIntOFF: 15,
    shortcut: KEY_COMBINATIONS_SCRATCH.motion,
    color: "#4c97ff",
  },
  looks: {
    buttonTitle: "looks",
    output: "`" + SECTION_TEXT + "`{.blocklooks}",
    title: "Utseende",
    cursorIntON: 1,
    cursorIntOFF: 14,
    shortcut: KEY_COMBINATIONS_SCRATCH.looks,
    color: "#96f",
  },
  sound: {
    buttonTitle: "sound",
    output: "`" + SECTION_TEXT + "`{.blocksound}",
    title: "Lyd",
    cursorIntON: 1,
    cursorIntOFF: 14,
    shortcut: KEY_COMBINATIONS_SCRATCH.sound,
    color: "#cf63cf",
  },
  pen: {
    buttonTitle: "pen",
    output: "`" + SECTION_TEXT + "`{.blockpen}",
    title: "Penn",
    cursorIntON: 1,
    cursorIntOFF: 12,
    shortcut: KEY_COMBINATIONS_SCRATCH.pen,
    color: "#0fbd8c",
  },
  data: {
    buttonTitle: "data",
    output: "`" + SECTION_TEXT + "`{.blockdata}",
    title: "Variabler",
    cursorIntON: 1,
    cursorIntOFF: 13,
    shortcut: KEY_COMBINATIONS_SCRATCH.data,
    color: "#ff8c1a",
  },
  events: {
    buttonTitle: "events",
    output: "`" + SECTION_TEXT + "`{.blockevents}",
    title: "Hendelser",
    cursorIntON: 1,
    cursorIntOFF: 15,
    shortcut: KEY_COMBINATIONS_SCRATCH.events,
    color: "#ffbf00",
  },
  control: {
    buttonTitle: "control",
    output: "`" + SECTION_TEXT + "`{.blockcontrol}",
    title: "Styring",
    cursorIntON: 1,
    cursorIntOFF: 16,
    shortcut: KEY_COMBINATIONS_SCRATCH.control,
    color: "#ffab19",
  },
  sensing: {
    buttonTitle: "sensing",
    output: "`" + SECTION_TEXT + "`{.blocksensing}",
    title: "Sansing",
    cursorIntON: 1,
    cursorIntOFF: 16,
    shortcut: KEY_COMBINATIONS_SCRATCH.sensing,
    color: "#5cb1d6",
  },
  operators: {
    buttonTitle: "operators",
    output: "`" + SECTION_TEXT + "`{.blockoperators}",
    title: "Operatorer",
    cursorIntON: 1,
    cursorIntOFF: 18,
    shortcut: KEY_COMBINATIONS_SCRATCH.operators,
    color: "#59c059",
  },
  moreblocks: {
    buttonTitle: "moreblocks",
    output: "`" + SECTION_TEXT + "`{.blockmoreblocks}",
    title: "Mine klosser",
    cursorIntON: 1,
    cursorIntOFF: 19,
    shortcut: KEY_COMBINATIONS_SCRATCH.moreblocks,
    color: "#ff6680",
  },
};

export { microbitbuttons, scratchbuttons, KEY_COMBINATIONS_MICROBIT, KEY_COMBINATIONS_SCRATCH };
