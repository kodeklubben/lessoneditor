import ButtonComponent from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import { image as config, KEY_COMBINATIONS as KEY } from "./settings/buttonConfig";
import { FC } from "react";

const Image: FC<any> = ({ editorRef, uploadImageRef }) => {
  useHotkeys(
    `${KEY.image}`,
    (event) => {
      event.preventDefault();

      handleButtonClick();

      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true }
  );
  const handleButtonClick = () => {
    uploadImageRef.current.click();
    editorRef.current.focus();
    return;
  };
  return (
    <div>
      <ButtonComponent
        buttonValues={{}}
        icon={config.image.icon}
        title={config.image.title}
        onButtonClick={handleButtonClick}
        buttonTitle={config.image.buttonTitle}
        shortcutKey={config.image.shortcut}
        style={{}}
        imageurl=""
      />
    </div>
  );
};

export default Image;
