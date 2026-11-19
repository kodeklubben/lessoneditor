import React from "react";
import { createRoot } from "react-dom/client";
import "semantic-ui-css/semantic.css";
import "./index.scss";
import App from "./app/App";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
