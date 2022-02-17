import { useLessonContext } from "../../contexts/LessonContext";
import ListFiles from "../shared/ListFiles";
import { Item, Container } from "semantic-ui-react";
import { FC, useState, useEffect } from "react";

type AllFilesProps = { lessonId: string };

const AllFiles: FC<AllFilesProps> = ({ lessonId }) => {
  const { fetchFileList, state } = useLessonContext();
  const [file, setFile] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await fetchFileList();
      setFile(files);
    };
    fetchFiles();
  }, [state.files]);

  const filterItems = ["preview.png", "lesson.yml", "data.json", "image.png"];

  return (
    <Container>
      <ul>
        <ListFiles
          list={
            file.length > 0
              ? file.filter((fileName: string) => !filterItems.includes(fileName))
              : ["No files found"]
          }
          lessonId={lessonId}
        />
      </ul>
    </Container>
  );
};

export default AllFiles;
