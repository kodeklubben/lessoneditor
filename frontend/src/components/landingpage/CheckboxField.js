import React from "react";

const CheckboxField = ({ test1, test2 }) => {
  return (
    <>
      <div className="ui form">
        <div className="two fields">
          <div className="field">
            <div
              id="subjectCheckbox"
              style={{ marginTop: "0px" }}
              className="ui segment"
            >
              <div className="ui grid">
                <div className="stackable two column row">{test2}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckboxField;
