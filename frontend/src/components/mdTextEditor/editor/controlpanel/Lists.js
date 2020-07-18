import React from "react";
import CPButton from "./CPButton";

import { lists as config } from "../../settingsFiles/buttonConfig";

const Lists = ({ editorRef, uploadImageRef }) => {
  const newHandleButtonClick = (button) => {
    switch (button) {
      case "listUl":
        alert("unordered lists");
        break;
      case "listOl":
        alert("ordered lists");
        break;
      case "listCheck":
        alert("check lists");
        break;
      default:
        alert("default");
        break;
    }
    return;
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {config.map((element, index) => (
          <CPButton
            key={"element" + index}
            buttonTitle={element.buttonTitle}
            icon={element.icon}
            title={element.title}
            onButtonClick={newHandleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
    </>
  );
};

export default Lists;
