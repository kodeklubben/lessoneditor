import React from "react";
import ReactDOM from "react-dom";
import ToggleButton from "components/editor/ToggleButton";

export const renderToggleButtons = () => {
  const nodes = [...document.getElementsByTagName("toggle")];
  for (let node of nodes) {
    const strongNode = node.getElementsByTagName("strong")[0];
    const buttonText = strongNode ? strongNode.textContent : "Hint";
    const hiddenNode = node.getElementsByTagName("hide")[0];
    const hiddenHTML = hiddenNode ? hiddenNode.innerHTML : "";
    ReactDOM.render(<ToggleButton {...{ buttonText, hiddenHTML }} />, node);
    node.style.visibility = "visible";
  }
};
