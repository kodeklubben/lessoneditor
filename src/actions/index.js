import { ADD_TEXT } from "./types";
import { PARSE_MD } from "./types";

export const addText = text => {
  return { type: ADD_TEXT, payload: text };
};

export const parseMD = text => {
  return { type: PARSE_MD, payload: text };
};
