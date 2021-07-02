import React from "react";
import ButtonComponent from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import {
  KEY_COMBINATIONS as KEY,
  image as config,
} from "./settings/buttonConfig";

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
    <div>
      <ButtonComponent
        buttonValues={""}
        icon={config.image.icon}
        title={config.image.title}
        onButtonClick={handleButtonClick}
        buttonTitle={config.image.buttonTitle}
        shortcutKey={config.image.shortcut}
      />
    </div>
  );
};

export default Image;
