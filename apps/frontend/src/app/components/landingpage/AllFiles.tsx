import { useLessonContext } from "../../contexts/LessonContext";
import ListFiles from "./ListFiles";
import { Item, Message } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

const AllFiles = () => {
  const { lessonId } = useParams() as any;
  const { fetchFileList, state } = useLessonContext();
  const [file, setFile] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await fetchFileList();
      setFile(files);
    };
    fetchFiles();
  }, [state.files]);

  const filterItems = ["preview.png", "lesson.yml", "data.json", "image_rT34Yx.png"];

  return (
    <Item.Group divided>
      {file.filter((item) => !filterItems.includes(item)).length > 0 ? (
        file
          .filter((item) => !filterItems.includes(item))
          .map((item) => <ListFiles item={item} lessonId={lessonId} key={item} />)
      ) : (
        <Message>
          <Message.Header>Finner ingen filer</Message.Header>
          <p>Opprett ny tekst ved å trykke på knappen "Ny tekstfil"</p>
        </Message>
      )}
    </Item.Group>
  );
};

export default AllFiles;
