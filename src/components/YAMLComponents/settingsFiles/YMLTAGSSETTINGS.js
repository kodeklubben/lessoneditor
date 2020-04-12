const GRADE_SUBTAG = "grade";
const SUBJECT_SUBTAG = "subject";
const TOPIC_SUBTAG = "topic";

const GRADE = {
  name: [
    "Barnehage",
    "1.-4. klasse",
    "5.-7. klasse",
    "8.-10. klasse",
    "Videregående Skole"
  ],
  value: ["preschool", "primary", "secondary", "junior", "senior"]
};

const SUBJECT = {
  name: [
    "Matematikk",
    "Naturfag",
    "Programmering",
    "Teknologi",
    "Musikk",
    "Norsk",
    "Engelsk",
    "Kunst og Håndverk",
    "Samfunnsfag"
  ],
  value: [
    "mathematics",
    "science",
    "programming",
    "technology",
    "music",
    "first_language",
    "english",
    "arts_and_crafts",
    "social_science"
  ]
};

const TOPIC = {
  name: [
    "Animasjon",
    "App",
    "Blokkbasert",
    "Elektronikk",
    "Kryptografi",
    "Lyd",
    "Minecraft",
    "Nettside",
    "Robot",
    "Spill",
    "Stegbasert",
    "Tekstbasert"
  ],
  value: [
    "animation",
    "app",
    "block_based",
    "electronics",
    "cryptography",
    "sound",
    "minecraft",
    "web",
    "robot",
    "game",
    "step_based",
    "text_based"
  ]
};

const gradeSettings = [];
const gradeLen = GRADE.name.length;

for (let i = 0; i < gradeLen; i++) {
  gradeSettings.push({
    name: GRADE.name[i],
    value: GRADE.value[i],
    subtag: GRADE_SUBTAG
  });
}

const subjectSettings = [];
const subjectLen = SUBJECT.name.length;

for (let i = 0; i < subjectLen; i++) {
  subjectSettings.push({
    name: SUBJECT.name[i],
    value: SUBJECT.value[i],
    subtag: SUBJECT_SUBTAG
  });
}

const topicSettings = [];
const topicLen = TOPIC.name.length;

for (let i = 0; i < topicLen; i++) {
  topicSettings.push({
    name: TOPIC.name[i],
    value: TOPIC.value[i],
    subtag: TOPIC_SUBTAG
  });
}

export { gradeSettings, subjectSettings, topicSettings };
