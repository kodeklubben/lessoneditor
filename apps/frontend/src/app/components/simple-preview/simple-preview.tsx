import "./simple-preview.scss";
import MDPreview from "../editor/MDPreviewArea";
import { useFileContext } from "../../contexts/FileContext";

const SimplePreview = () => {
  const { state } = useFileContext();

  return (
    <div className={"simple-preview"}>
      {typeof state.savedFileBody === "string" && (
        <MDPreview mdText={state.savedFileBody} course={"python"} language={"nb"} preview={true} />
      )}
    </div>
  );
};

export default SimplePreview;
