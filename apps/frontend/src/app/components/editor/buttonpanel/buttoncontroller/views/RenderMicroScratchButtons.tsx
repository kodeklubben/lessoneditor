import { FC } from "react";
import { Button, Popup } from "semantic-ui-react";
import { shortcutLabel } from "../utils/buttonMethods";

interface RenderMicroScratchButtonsProps {
  isON: boolean;
  title: string;
  handleButtonClick: (button: string) => void;
  buttonSlug: string;
  shortcutKey: string;
  color: string;
  disabled?: boolean;
}

export const RenderMicroScratchButtons: FC<RenderMicroScratchButtonsProps> = ({
  isON,
  title,
  handleButtonClick,
  buttonSlug,
  shortcutKey,
  color,
  disabled = false,
}) => {
  const isTouchDevice = () => {
    return "ontouchstart" in document.documentElement;
  };
  return (
    <>
      <Popup
        content={
          disabled
            ? `${title}: ikke inne i en kodeblokk`
            : title + " (" + shortcutLabel(shortcutKey) + ")"
        }
        disabled={isTouchDevice()}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            style={isON ? { backgroundColor: "#AAA" } : { backgroundColor: color }}
            className="MBButton"
            size="tiny"
            disabled={disabled}
            onClick={() => handleButtonClick(buttonSlug)}
          >
            {title}
          </Button>
        }
      />
    </>
  );
};
