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

/** White text on the block colours, dark on the very light ones (Hendelser, Styring, Lys grå). */
export function readableOn(hex: string): string {
  const full = hex.replace("#", "").replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Scratch's own blocks have white text; only on the very light ones (yellow, light grey)
  // it cannot be read.
  return luminance > 0.45 ? "#1b1c1d" : "#fff";
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
            style={
              isON
                ? { backgroundColor: "#AAA" }
                : { backgroundColor: color, color: readableOn(color) }
            }
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
