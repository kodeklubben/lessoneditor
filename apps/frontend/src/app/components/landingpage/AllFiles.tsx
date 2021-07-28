import "./landingpage.scss";
import { useContext } from "react";
import {LessonContext} from "../../contexts/LessonContext";



const AllFiles = () => {
    const { lessonList } = useContext<any>(LessonContext);

  const filteredArray =
    lessonList.length > 0
      ? lessonList.filter(
          (filteredItem: { filename: string; }) =>
            filteredItem.filename !== "data.json" &&
            filteredItem.filename !== "preview.png"
        )
      : "";

    return (
    <>
      <div style={{ marginBottom: "5em" }}>
        <div style={{ marginLeft: "5em" }}>
          {filteredArray.length > 0
            ? filteredArray.map((element:any) => {
                return <h2>{element.filename}</h2>;
              })
            : ""}
        </div>
      </div>
    </>
  );
};

export default AllFiles;
