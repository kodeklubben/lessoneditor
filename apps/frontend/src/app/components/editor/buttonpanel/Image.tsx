import { RenderButton } from "./ButtonComponent";

import { useHotkeys } from "react-hotkeys-hook";

import { media as config, KEY_COMBINATIONS as KEY } from "./settings/buttonConfig";
import { FC, RefObject } from "react";

interface ImageProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  uploadImageRef: RefObject<HTMLInputElement>;
}

const Image: FC<ImageProps> = ({ editorRef, uploadImageRef }) => {
  useHotkeys(
    `${KEY.media.image}`,
    (event) => {
      event.preventDefault();

      handleButtonClick();

      return false;
    },
    { enableOnTags: ["TEXTAREA"], keydown: true }
  );
  const handleButtonClick = () => {
    uploadImageRef.current ? uploadImageRef.current.click() : "";
    editorRef.current ? editorRef.current.focus() : "";
    return;
  };
  return (
    <div>
      <RenderButton
        isON={false}
        icon={config.image.icon}
        title={config.image.title}
        handleButtonClick={handleButtonClick}
        buttonTitle={config.image.buttonTitle}
        shortcutKey={config.image.shortcut}
      />
    </div>
  );
};

export default Image;
