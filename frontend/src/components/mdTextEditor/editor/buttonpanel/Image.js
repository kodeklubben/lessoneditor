import React from "react";
import CPButton from "./CPButton";

import { image as config } from "../../settingsFiles/buttonConfig";

const Image = ({ editorRef, uploadImageRef }) => {
  const handleButtonClick = (button) => {
    uploadImageRef.current.click();
    editorRef.current.focus();
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

export default Image;
