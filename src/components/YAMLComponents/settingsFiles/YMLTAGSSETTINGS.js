import {
  GRADE as grades,
  SUBJECT as subjects,
  TOPIC as topics
} from "./languages/formpage_NO";

const GRADE_SUBTAG = "grade";
const SUBJECT_SUBTAG = "subject";
const TOPIC_SUBTAG = "topic";

const GRADE = {
  name: Object.values(grades),
  value: Object.keys(grades)
};

const SUBJECT = {
  name: Object.values(subjects),
  value: Object.keys(subjects)
};

const TOPIC = {
  name: Object.values(topics),
  value: Object.keys(topics)
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
