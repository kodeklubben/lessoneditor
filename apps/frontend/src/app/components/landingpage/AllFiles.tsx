import { useLessonContext } from "../../contexts/LessonContext";
import ListFiles from "../shared/ListFiles";
import { Item, Container } from "semantic-ui-react";

const AllFiles = () => {
  const { state } = useLessonContext();

  const filterItems = ["preview.png", "lesson.yml", "data.json", "image.png"];

  return (
    <Container>
      <ListFiles
        list={
          state.files?.length > 0
            ? state.files?.filter((fileName: string) => !filterItems.includes(fileName))
            : ["No files found"]
        }
      />
    </Container>
  );
};

export default AllFiles;
