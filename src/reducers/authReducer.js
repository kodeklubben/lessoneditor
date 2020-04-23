import { SIGN_IN, SIGN_OUT } from "../actions/types";

const INITIAL_STATE = {
  isSignedIn: null,
  userId: null,
  firstName: "",
  lastName: "",
  imageUrl: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        userId: action.payload.userId,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        imageUrl: action.payload.imageUrl
      };
    case SIGN_OUT:
      return { ...state, isSignedIn: false, userId: null };
    default:
      return state;
  }
};
