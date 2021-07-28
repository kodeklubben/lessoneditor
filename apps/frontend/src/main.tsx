import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import "./index.scss";
import "semantic-ui-css/semantic.min.css";
import App from "./app/components/App";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
