import "./landingpage.scss";
import { useLessonContext } from "../../contexts/LessonContext";

const AllFiles = () => {
  const { state } = useLessonContext();

  const filteredArray =
    state.files!.length > 0
      ? state.files!.filter(
          (fileName: string) => fileName !== "data.json" && fileName !== "preview.png"
        )
      : ["No files found"];

  return (
    <>
      <div style={{ marginBottom: "5em" }}>
        <div style={{ marginLeft: "5em" }}>
          {filteredArray.map((element: any) => {
            return <h2>{element}</h2>;
          })}
        </div>
      </div>
    </>
  );
};

export default AllFiles;
