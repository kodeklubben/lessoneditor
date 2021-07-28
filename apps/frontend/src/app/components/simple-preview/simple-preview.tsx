import "./simple-preview.scss";
import { useContext } from "react";
import MDPreview from "../editor/MDPreview";
import { FileContext } from "../../contexts/FileContext";
import ShowSpinner from "../ShowSpinner";

const SimplePreview = () => {
  const { savedFileBody } = useContext<any>(FileContext);
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
