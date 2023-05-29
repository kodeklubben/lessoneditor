import { FC, useState } from "react";
import { useParams } from "react-router";
import { RenderButtons } from "./buttoncontroller/views/RenderButtons";
import { useHotkeys } from "react-hotkeys-hook";
import {
  fileExplorer as config,
  KEY_COMBINATIONS as KEY,
} from "./buttoncontroller/settings/buttonConfig";
import ListFiles from "../../shared/ListFiles";
import { useLessonContext } from "../../../contexts/LessonContext";

import { Container, Modal } from "semantic-ui-react";

const Explorer: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useLessonContext();
  const { lessonId } = useParams() as any;

  const filterItems = ["preview.png", "lesson.yml", "data.json", "image.png"];

  useHotkeys(
    KEY.hyperlink.hyperlink,
    (event) => {
      event.preventDefault();
      handleButtonClick();
    },
    {}
  );

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    return;
  };

  return (
    <>
      <RenderButtons
        isON={false}
        icon={config.explorer.icon}
        title={config.explorer.title}
        handleButtonClick={handleButtonClick}
        buttonSlug={config.explorer.slug}
        shortcutKey={config.explorer.shortcut}
      />

      <Modal
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        closeIcon
        open={isOpen}
        size="small"
        className="hyperlink_modal"
      >
        <Container style={{ padding: "2em" }}>
          <ListFiles
            list={
              state.files?.length > 0
                ? state.files?.filter((fileName: string) => !filterItems.includes(fileName))
                : ["No files found"]
            }
            lessonId={lessonId}
          />
        </Container>
      </Modal>
    </>
  );
};

export default Explorer;
