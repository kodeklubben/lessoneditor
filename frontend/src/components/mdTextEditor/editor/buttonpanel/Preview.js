import React from "react";
import CPButton from "./CPButton";

import { preview as config } from "../../settingsFiles/buttonConfig";

const Preview = ({ handlePreview }) => {
  const handleButtonClick = (button) => {
    handlePreview();
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
            onButtonClick={handleButtonClick}
            shortcutKey={element.shortcut}
          />
        ))}
      </div>
    </>
  );
};

export default Preview;
