import { useLessonContext } from "../../contexts/LessonContext";
import ListFiles from "../shared/ListFiles";

const AllFiles = () => {
  const { state } = useLessonContext();

  console.log(state);

  const filterItems = ["preview.png", "lesson.yml", "data.json"];

  return (
    <>
      <ListFiles
        list={
          state.files?.length > 0
            ? state.files?.filter((fileName: string) => !filterItems.includes(fileName))
            : ["No files found"]
        }
      />
    </>
  );
};

export default AllFiles;
