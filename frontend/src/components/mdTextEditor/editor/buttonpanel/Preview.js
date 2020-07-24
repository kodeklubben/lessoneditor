import React from "react";
import CPButton from "./CPButton";

import { useHotkeys } from "react-hotkeys-hook";

import {
  KEY_COMBINATIONS as KEY,
  preview as config,
} from "../../settingsFiles/buttonConfig";

const Preview = ({ handlePreview }) => {
  useHotkeys(
    `${KEY.preview}`,
    (event, handler) => {
      switch (handler.key) {
        case KEY.preview:
          event.preventDefault();
          handlePreview();
          break;

        default:
          break;
      }
      return false;
    },
    { enableOnTags: "TEXTAREA", keydown: true }
  );

  const handleButtonClick = (button) => {
    handlePreview();
    return;
  };
  return (
    <>
      <div className="ui icon buttons emphasis">
        {Object.entries(config).map((element, index) => (
          <CPButton
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

export default Preview;
