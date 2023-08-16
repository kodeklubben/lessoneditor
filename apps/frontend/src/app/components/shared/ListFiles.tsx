import { FC } from "react";
import { Item, Button, Divider, Icon, Placeholder } from "semantic-ui-react";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { useLessonContext } from "../../contexts/LessonContext";

type ListFilesProps = {
  list: string[];
  lessonId: string;
};

const ListFiles: FC<ListFilesProps> = ({ list, lessonId }) => {
  const { fetchFileList, setFiles } = useLessonContext();

  const removeFile = async (item: string) => {
    const fileList = await fetchFileList();
    const filename = item.split(".").slice(0, -1).toString();
    const ext: string = item.split(".").pop() ?? "";
    try {
      const isDeleted = await axios.delete(
        paths.LESSON_FILE_DELETE.replace(":lessonId", lessonId.toString())
          .replace(":filename", filename)
          .replace(":ext", ext)
      );
      if (isDeleted.data === 1) {
        const index = fileList.findIndex((item: string) => item === filename);
        const newList = fileList.splice(index, 1);
        setFiles(newList);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {list.map((item) => (
        <li key={item} style={{ listStyleType: "none" }}>
          <div style={{ display: "flex", flexFlow: "row", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexFlow: "row", alignContent: "center" }}>
              <Placeholder style={{ marginRight: "20px" }}>
                <Placeholder.Image style={{ width: "100px", height: "100px" }}></Placeholder.Image>
              </Placeholder>

              <div style={{ display: "flex", alignItems: "center" }}>
                <h3>{item}</h3>
              </div>
            </div>
            <Button
              style={{ background: "none" }}
              icon
              floated="right"
              onClick={() => removeFile(item)}
            >
              <Icon name="delete" />
              Slett
            </Button>
          </div>
          <Divider />
        </li>
      ))}
    </>
  );
};

export default ListFiles;
