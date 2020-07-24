import React from "react";
import CPButton from "./CPButton";

import { preview as config } from "../../settingsFiles/buttonConfig";
// import { topicSettings } from "components/lessonForm/settingsFiles/YMLTAGSSETTINGS";

const Preview = ({ handlePreview, testings }) => {
  const handleButtonClick = (button) => {
    handlePreview();
    testings();
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
