import { Button, Popup } from "semantic-ui-react";
import { FC } from "react";

interface MicroScratchButtonComponentProps {
  buttonValues: Record<string, boolean>;
  title: string;
  onButtonClick: (button: string) => void;
  buttonTitle: string;
  shortcutKey: string;
  color: string;
}

const MicroScratchButtonComponent: FC<MicroScratchButtonComponentProps> = ({
  buttonValues,
  title,
  onButtonClick,
  buttonTitle,
  shortcutKey,
  color,
}) => {
  const responsiveCP = () => {
    return (
      <>
        <Popup
          content={title + " (" + shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          trigger={
            <Button
              style={
                buttonValues[buttonTitle] ? { backgroundColor: "#AAA" } : { backgroundColor: color }
              }
              className="MBButton"
              size="tiny"
              onClick={() => onButtonClick(buttonTitle)}
            >
              {title}
            </Button>
          }
        />
      </>
    );
  };

  return responsiveCP();
};

export default MicroScratchButtonComponent;
