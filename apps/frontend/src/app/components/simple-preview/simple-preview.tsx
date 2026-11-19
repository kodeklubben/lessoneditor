import "./simple-preview.scss";
import MDPreview from "../editor/MDPreviewArea";
import { useFileContext } from "../../contexts/FileContext";
import { useLessonContext } from "../../contexts/LessonContext";

/** The page the thumbnailer photographs: same course and language as the lesson itself (K18). */
const SimplePreview = () => {
  const { state } = useFileContext();
  const { state: lessonState } = useLessonContext();

  return (
    <div className={"simple-preview"}>
      {typeof state.savedFileBody === "string" && (
        <MDPreview
          mdText={state.savedFileBody}
          course={lessonState.lesson.courseSlug}
          language={state.headerData?.language || "nb"}
          preview={true}
        />
      )}
    </div>
  );
};

export default SimplePreview;
