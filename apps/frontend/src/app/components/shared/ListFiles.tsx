import { FC } from "react";
import { Item, Button, Divider, Icon, Placeholder } from "semantic-ui-react";

type ListFilesProps = {
  list: string[];
};

const ListFiles: FC<ListFilesProps> = ({ list }) => {
  console.log({ list });
  const removeFile = () => {
    console.log("file soon removed");
  };
  return (
    <>
      {list.map((item) => (
        <>
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
              onClick={(item) => {
                removeFile();
              }}
            >
              <Icon name="delete" />
              Slett
            </Button>
          </div>
          <Divider />
        </>
      ))}
    </>
  );
};

export default ListFiles;
