import React from "react";

const CheckboxField = ({ labelTitle, content }) => {
  return (
    <>
      <label>
        <h3>{labelTitle}</h3>
      </label>
      <div>{content}</div>
    </>
  );
};

export default CheckboxField;
