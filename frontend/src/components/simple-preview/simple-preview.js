import "./simple-preview.scss";
import React, { useContext } from "react";
import MDPreview from "../editor/MDPreview";
import { FileContext } from "../../contexts/FileContext";
import ShowSpinner from "../ShowSpinner";

const SimplePreview = () => {
  const { savedFileBody } = useContext(FileContext);
  return (
    <div className={"simple-preview"}>
      {savedFileBody !== "" ? (
        <MDPreview
          mdText={savedFileBody}
          course={"python"}
          language={"nb"}
          renderContent={true}
        />
      ) : (
        <ShowSpinner />
      )}
    </div>
  );
};

export default SimplePreview;
