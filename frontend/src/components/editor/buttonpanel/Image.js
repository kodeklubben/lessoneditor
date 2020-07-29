import React from "react";
import CPButton from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import {
  KEY_COMBINATIONS as KEY,
  image as config,
} from "../settingsFiles/buttonConfig";

const Image = ({ editorRef, uploadImageRef }) => {
  useHotkeys(
    `${KEY.image}`,
    (event) => {
      event.preventDefault();

      uploadImageRef.current.click();
      editorRef.current.focus();

      return false;
    },
    { enableOnTags: "TEXTAREA", keydown: true }
  );
  const handleButtonClick = () => {
    uploadImageRef.current.click();
    editorRef.current.focus();
    return;
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {Object.entries(config).map((element, index) => (
          <CPButton
            buttonValues={""}
            key={"element" + index}
            buttonTitle={element[1].buttonTitle}
            icon={element[1].icon}
            title={element[1].title}
            onButtonClick={handleButtonClick}
            shortcutKey={element[1].shortcut}
          />
        ))}
      </div>
    </>
  );
};

export default Image;
