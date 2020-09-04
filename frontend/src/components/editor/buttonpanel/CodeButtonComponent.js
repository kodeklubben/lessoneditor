import React from "react";
import { Button, Popup } from "semantic-ui-react";
import COURSELIST from "components/editor/settingsFiles/COURSELIST";

const CodeButtons = ({
  icon,
  title,
  onButtonClick,
  buttonTitle,
  output,
  cursorIntON,
  cursorIntOFF,
  endOutput,
  shortcutKey,
  course,
  style,
}) => {
  const responsiveCP = () => {
    const courseNotSlug = COURSELIST.find(({ slug }) => slug === course);

    return (
      <>
        <Popup
          content={title + " (" + shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          trigger={
            icon === "code" ? (
              <Button
                style={style}
                className="CPButton"
                size="tiny"
                onClick={() =>
                  onButtonClick(
                    buttonTitle,
                    output,
                    cursorIntON,
                    cursorIntOFF,
                    endOutput
                  )
                }
              >
                <div style={{ position: "relative", top: "-5px" }}>
                  {"```Kodeblokk"}
                  <span style={{ color: "#008000" }}>
                    {'("' + courseNotSlug?.courseTitle + '")'}
                  </span>
                </div>
              </Button>
            ) : (
              <Button
                style={style}
                className="CPButton"
                size="tiny"
                onClick={() =>
                  onButtonClick(
                    buttonTitle,
                    output,
                    cursorIntON,
                    cursorIntOFF,
                    endOutput
                  )
                }
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
