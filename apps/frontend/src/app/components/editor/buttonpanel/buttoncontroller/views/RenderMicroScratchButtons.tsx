import { FC } from "react";
import { Button, Popup } from "semantic-ui-react";

interface RenderMicroScratchButtonsProps {
  isON: boolean;
  title: string;
  handleButtonClick: (button: string) => void;
  buttonSlug: string;
  shortcutKey: string;
  color: string;
}

export const RenderMicroScratchButtons: FC<RenderMicroScratchButtonsProps> = ({
  isON,
  title,
  handleButtonClick,
  buttonSlug,
  shortcutKey,
  color,
}) => {
  return (
    <>
      <Popup
        content={title + " (" + shortcutKey + ")"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            style={isON ? { backgroundColor: "#AAA" } : { backgroundColor: color }}
            className="MBButton"
            size="tiny"
            onClick={() => handleButtonClick(buttonSlug)}
          >
            {title}
          </Button>
        }
      />
    </>
  );
};
