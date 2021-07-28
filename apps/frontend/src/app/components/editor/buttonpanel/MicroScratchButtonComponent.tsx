import { Button, Popup } from "semantic-ui-react";
import { FC } from "react";

const Buttons: FC<any> = ({
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
                buttonValues[buttonTitle]
                  ? { backgroundColor: "#AAA" }
                  : { backgroundColor: color }
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

export default Buttons;
