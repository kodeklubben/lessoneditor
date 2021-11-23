import { FC } from "react";

type ListFilesProps = {
  list: string[];
};

const ListFiles: FC<ListFilesProps> = ({ list }) => {
  return (
    <>
      {list.map((item) => (
        <p>{item}</p>
      ))}
    </>
  );
};

export default ListFiles;
