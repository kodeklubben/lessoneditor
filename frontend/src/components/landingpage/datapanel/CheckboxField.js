import React from "react";

const CheckboxField = ({ labelTitle, content }) => {
  return (
    <>
      <label>
        <h3>{labelTitle}</h3>
      </label>
      <div className="ui segment">
        <div className="ui grid">
          <div className="stackable two columnd row">{content}</div>
        </div>
      </div>
    </>
  );
};

export default CheckboxField;
