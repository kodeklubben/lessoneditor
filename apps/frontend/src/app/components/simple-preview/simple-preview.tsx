import "./simple-preview.scss";
import MDPreview from "../editor/MDPreview";
import { useFileContext } from "../../contexts/FileContext";
import ShowSpinner from "../ShowSpinner";

const SimplePreview = () => {
  const { state } = useFileContext();

  return (
    <div className={"simple-preview"}>
      {typeof state.savedFileBody === "string" && state.savedFileBody !== "" ? (
        <MDPreview mdText={state.savedFileBody} course={"python"} language={"nb"} />
      ) : (
        <ShowSpinner />
      )}
    </div>
  );
};

export default SimplePreview;
