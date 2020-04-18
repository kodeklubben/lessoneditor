import { combineReducers } from "redux";
import mdTextReducer from "./mdTextReducer";

export default combineReducers({
  mdText: mdTextReducer
});
