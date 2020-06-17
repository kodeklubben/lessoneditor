import { combineReducers } from "redux";
import mdTextReducer from "./mdTextReducer";
import parseMDReducer from "./parseMDReducer";
import authReducer from "./authReducer";

export default combineReducers({
  mdText: mdTextReducer,
  parseMD: parseMDReducer,
  auth: authReducer,
});
