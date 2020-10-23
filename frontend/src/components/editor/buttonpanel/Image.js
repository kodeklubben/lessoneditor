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

      handleButtonClick();

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
      {Object.entries(config).map((element, index) => (
        <CPButton
          key={"element" + index}
          buttonValues={""}
          icon={element[1].icon}
          title={element[1].title}
          onButtonClick={handleButtonClick}
          buttonTitle={element[1].buttonTitle}
          shortcutKey={element[1].shortcut}
        />
      ))}
    </>
  );
};

export default Image;
