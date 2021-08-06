import { Button, Popup } from "semantic-ui-react";
import { FC } from "react";

const CodeButtons: FC<any> = ({
                                buttonValues,
                                title,
                                onButtonClick,
                                buttonTitle,
                                shortcutKey,
                                course,
                                courseTitle,
                                style
                              }) => {
  const responsiveCP = () => {
    return (
      <>
        <Popup
          content={title + " (" + shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          trigger={
            buttonTitle === "codeblock" ? (
              <Button
                style={
                  buttonValues[buttonTitle]
                    ? { ...style, backgroundColor: "#bbb" }
                    : style
                }
                className="CPButton"
                size="tiny"
                onClick={() => onButtonClick(buttonTitle)}
              >
                <div style={{ position: "relative", top: "-5px" }}>
                  {"```Kodeblokk"}
                  <span style={{ color: "#008000" }}>
                    {"(\"" + courseTitle + "\")"}
                  </span>
                </div>
              </Button>
            ) : (
              <Button
                style={
                  buttonValues[buttonTitle]
                    ? { ...style, backgroundColor: "#bbb" }
                    : style
                }
                className="CPButton"
                size="tiny"
                onClick={() => onButtonClick(buttonTitle)}
              >
                <div style={{ position: "relative", top: "-5px" }}>
                  {"`Inline-kode"}
                </div>
              </Button>
            )
          }
        />
      </>
    );
  };

  return responsiveCP();
};

export default CodeButtons;
