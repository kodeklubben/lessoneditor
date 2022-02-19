import { FC } from "react";
import { Item, Button, Divider, Icon, Placeholder } from "semantic-ui-react";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { useLessonContext } from "../../contexts/LessonContext";

type ListFilesProps = {
  item: string;
  lessonId: string;
};

const ListFiles: FC<ListFilesProps> = ({ item, lessonId }) => {
  const { fetchFileList, setFiles } = useLessonContext();

  const removeFile = async (item: string) => {
    const fileList = await fetchFileList();
    const filename = item.split(".").slice(0, -1).toString();
    const ext: string = item.split(".").pop() ?? "";
    try {
      const isDeleted = await axios.delete(
        paths.LESSON_FILE_DELETE.replace(":lessonId", lessonId.toString())
          .replace(":fileName", filename)
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
      <Item style={{ marginBottom: "1em", paddingTop: "2em" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Item.Content>
            <Placeholder>
              <Placeholder.Image style={{ width: "100px", height: "100px" }}></Placeholder.Image>
            </Placeholder>
          </Item.Content>
          <Item.Content
            style={{
              display: "flex",
              flexFlow: "column nowrap",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 1em",
            }}
          >
            <Item.Header>
              <h3>{item}</h3>
            </Item.Header>
            <Item.Meta></Item.Meta>
          </Item.Content>
        </div>
        <Item.Content
          style={{
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "flex-end",
            alignItems: "center",
            margin: "1em",
          }}
        >
          <Button style={{ background: "none" }} icon onClick={() => removeFile(item)}>
            <Icon name="delete" />
            Slett
          </Button>
        </Item.Content>
      </Item>
    </>
  );
};

export default ListFiles;
