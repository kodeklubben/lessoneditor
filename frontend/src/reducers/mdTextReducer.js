import { ADD_TEXT } from "../actions/types";

const INITIAL_STATE = "";

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TEXT:
      return action.payload;
    default:
      return state;
  }
};
