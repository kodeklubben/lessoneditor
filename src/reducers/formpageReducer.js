import { ADD_FORM_VALUES } from "../actions/types";
import COURSELIST from "../components/lessonForm/settingsFiles/COURSELIST";
import { LANGUAGES } from "../components/lessonForm/settingsFiles/languages/formpage_NO";

const INITIAL_STATE = {
  course: COURSELIST[0].courseTitle,
  title: "",
  titleErr: "",
  author: "",
  authorErr: "",
  translator: "",
  language: Object.keys(LANGUAGES[0]),
  level: 1,
  license: "CC BY-SA 4.0",
  tags: { topic: [], subject: [], grade: [] },
  redirect: null,
  pageNumber: 1
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_FORM_VALUES:
      return action.payload;
    default:
      return state;
  }
};
