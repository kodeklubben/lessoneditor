import {
  ADD_FORM_VALUES,
  ADD_TEXT,
  PARSE_MD,
  SIGN_IN,
  SIGN_OUT,
} from "./types";

export const addText = (text) => {
  return { type: ADD_TEXT, payload: text };
};

export const parseMD = (text) => {
  return { type: PARSE_MD, payload: text };
};

export const signIn = (userId, firstName, lastName, imageUrl, email) => {
  return {
    type: SIGN_IN,
    payload: { userId, firstName, lastName, imageUrl, email },
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

export const formValues = (values) => {
  return { type: ADD_FORM_VALUES, payload: values };
};
