/* eslint-env node */

import React, { useState } from "react";
import { Button } from "semantic-ui-react";

const ToggleButton = ({ buttonText, hiddenHTML }) => {
  const [open, setOpen] = useState(false);

  const containerStyle = {
    margin: "10px 0",
    padding: "10px",
    border: "1px solid black",
    borderRadius: "5px",
    backgroundColor: "#eee",
  };
  // const contentStyle = {
  //   paddingTop: "20px"
  // };
  return (
    <div style={containerStyle}>
      <Button onClick={() => setOpen(!open)}>{buttonText}</Button>
      {/* <Collapse in={open}>
        <div>
          <div style={contentStyle}>
            <div dangerouslySetInnerHTML={{ __html: hiddenHTML }} />
          </div>
        </div>
      </Collapse> */}
    </div>
  );
};

export default ToggleButton;
