import { useLessonContext } from "../../contexts/LessonContext";
import ListFiles from "../shared/ListFiles";
import { Item, Container } from "semantic-ui-react";
import { FC } from "react";

type AllFilesProps = { lessonId: string };

const AllFiles: FC<AllFilesProps> = ({ lessonId }) => {
  const { state } = useLessonContext();

  const filterItems = ["preview.png", "lesson.yml", "data.json", "image.png"];

  return (
    <Container>
      <ul>
        <ListFiles
          list={
            state.files?.length > 0
              ? state.files?.filter((fileName: string) => !filterItems.includes(fileName))
              : ["No files found"]
          }
          lessonId={lessonId}
        />
      </ul>
    </Container>
  );
};

export default AllFiles;
