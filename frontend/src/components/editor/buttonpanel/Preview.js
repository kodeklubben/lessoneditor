import React from "react";
import CPButton from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import {
  KEY_COMBINATIONS as KEY,
  preview as config,
} from "../settingsFiles/buttonConfig";

const Preview = ({ handlePreview }) => {
  useHotkeys(
    `${KEY.preview}`,
    (event) => {
      event.preventDefault();

      handlePreview();

      return false;
    },
    { enableOnTags: "TEXTAREA", keydown: true }
  );

  const handleButtonClick = () => {
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
