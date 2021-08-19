import "./simple-preview.scss";
import MDPreview from "../editor/MDPreview";
import { useFileContext } from "../../contexts/FileContext";
import ShowSpinner from "../ShowSpinner";

const SimplePreview = () => {
  const { savedFileBody } = useFileContext();

  return (
    <div className={"simple-preview"}>
      {typeof savedFileBody === "string" && savedFileBody !== "" ? (
        <MDPreview mdText={savedFileBody} course={"python"} language={"nb"} />
      ) : (
        <ShowSpinner />
      )}
    </div>
  );
};

export default SimplePreview;
