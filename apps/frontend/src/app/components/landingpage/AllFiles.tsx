import { useLessonContext } from "../../contexts/LessonContext";
import ListFiles from "./ListFiles";
import { Button, Card, Item, Image, Divider, Icon } from "semantic-ui-react";
import { FC, useState, useEffect } from "react";
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

  const filterItems = ["preview.png", "lesson.yml", "data.json", "image.png"];

  return (
    <Item.Group divided>
      {file
        .filter((item) => !filterItems.includes(item))
        .map((item) => (
          <ListFiles item={item} lessonId={lessonId} />
        ))}
    </Item.Group>
  );
};

export default AllFiles;
