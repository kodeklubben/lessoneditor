import "./simple-preview.scss";
import MDPreview from "../editor/MDPreview";
import { useFileContext } from "../../contexts/FileContext";
import ShowSpinner from "../ShowSpinner";

const SimplePreview = () => {
  const { state } = useFileContext();

  return (
    <div className={"simple-preview"}>
      {typeof state.savedFileBody === "string" && (
        <MDPreview mdText={state.savedFileBody} course={"python"} language={"nb"} />
      )}
    </div>
  );
};

export default SimplePreview;
