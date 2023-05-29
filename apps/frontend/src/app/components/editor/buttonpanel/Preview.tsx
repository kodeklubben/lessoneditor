import { RenderButtons } from "./buttoncontroller/views/RenderButtons";

import { useHotkeys } from "react-hotkeys-hook";

import {
  KEY_COMBINATIONS as KEY,
  preview as config,
} from "./buttoncontroller/settings/buttonConfig";
import { Dispatch, FC, RefObject, SetStateAction } from "react";

interface PreviewProps {
  editorRef: RefObject<HTMLTextAreaElement>;
  setPreview: Dispatch<SetStateAction<boolean>>;
}

const Preview: FC<PreviewProps> = ({ editorRef, setPreview }) => {
  useHotkeys(
    KEY.media.image,
    (event) => {
      event.preventDefault();

      handleButtonClick();
    },
    {}
  );
  const handleButtonClick = () => {
    editorRef.current ? editorRef.current.focus() : "";
    setPreview((prevState) => !prevState);
    return;
  };
  return (
    <div className="preview_button_group">
      <RenderButtons
        isON={false}
        icon={config.preview.icon}
        title={config.preview.title}
        handleButtonClick={handleButtonClick}
        buttonSlug={config.preview.slug}
        shortcutKey={config.preview.shortcut}
      />
    </div>
  );
};

export default Preview;
