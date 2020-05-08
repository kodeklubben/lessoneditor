import { PARSE_MD } from "../actions/types";

const INITIAL_STATE = "";

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PARSE_MD:
      return action.payload;
    default:
      return state;
  }
};
