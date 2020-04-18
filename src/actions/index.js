import { ADD_TEXT } from "./types";

export const addText = text => {
  return { type: ADD_TEXT, payload: text };
};
