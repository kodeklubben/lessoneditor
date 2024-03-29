const LANGUAGES = [
  {
    nb: "Bokmål",
  },
  {
    nn: "Nynorsk",
  },
  {
    en: "Engelsk",
  },
  {
    is: "Islandsk",
  },
];

// YML page text
const YML_TEXT = {
  topic: "Tema",
  subject: "Fag",
  grade: "Klassetrinn",
};

// FORM TEXT
const FORM_TEXT = {
  TITLE: { heading: "Tittel", placeholder: "Tittel" },
  AUTHOR: { heading: "Forfatter", placeholder: "Navn" },
  TRANSLATOR: {
    heading: "Oversatt av",
    placeholder: "Navn",
  },
  LICENSE: {
    heading: "Lisens",
    placeholder: "standard: CC BY-SA 4.0",
  },
  COURSE: { heading: "Kurs" },
  LANGUAGE: { heading: "Språk" },
  LEVEL: { heading: "Nivå" },
  LEVEL_VALUES: [
    { name: "Introduksjon", value: 1 },
    { name: "Nybegynner", value: 2 },
    { name: "Erfaren", value: 3 },
    { name: "Ekspert", value: 4 },
  ],
};

const levelOptions = [
  {
    key: 1,
    text: "Introduksjon",
    value: 1,
    image: { avatar: true, src: "assets/public/level1.png" },
  },
  {
    key: 2,
    text: "Nybegynner",
    value: 2,
    image: { avatar: true, src: "assets/public/level2.png" },
  },
  {
    key: 3,
    text: "Erfaren",
    value: 3,
    image: { avatar: true, src: "assets/public/level3.png" },
  },
  {
    key: 4,
    text: "Ekspert",
    value: 4,
    image: { avatar: true, src: "assets/public/level4.png" },
  },
];

// Grade titles
const GRADE = {
  preschool: "Barnehage",
  primary: "1.-4. klasse",
  secondary: "5.-7. klasse",
  junior: "8.-10. klasse",
  senior: "Videregående Skole",
};

// Subject titles
const SUBJECT = {
  mathematics: "Matematikk",
  science: "Naturfag",
  programming: "Programmering",
  technology: "Teknologi",
  music: "Musikk",
  first_language: "Norsk",
  english: "Engelsk",
  arts_and_crafts: "Kunst og Håndverk",
  social_science: "Samfunnsfag",
};

// Topic titles
const TOPIC = {
  animation: "Animasjon",
  app: "App",
  block_based: "Blokkbasert",
  electronics: "Elektronikk",
  cryptography: "Kryptografi",
  sound: "Lyd",
  minecraft: "Minecraft",
  web: "Nettside",
  robot: "Robot",
  game: "Spill",
  step_based: "Stegbasert",
  text_based: "Tekstbasert",
};

export { GRADE, SUBJECT, TOPIC, LANGUAGES, FORM_TEXT, YML_TEXT, levelOptions };
