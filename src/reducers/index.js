import { combineReducers } from "redux";
import mdTextReducer from "./mdTextReducer";
import parseMDReducer from "./parseMDReducer";

export default combineReducers({
  mdText: mdTextReducer,
  parseMD: parseMDReducer
});
