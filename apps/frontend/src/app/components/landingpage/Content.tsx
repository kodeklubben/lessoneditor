import { SyntheticEvent, useState } from "react";
import LessontextItems from "./LessonTextItems";
import TeacherguideItems from "./TeacherguideItems";
import AllFiles from "../landingpage/AllFiles";
import { Menu, Segment } from "semantic-ui-react";
import { useParams } from "react-router";

const Content = () => {
  const { mode } = useParams() as any;
  const [activeItem, setActiveItem] = useState("lessontext");

  const handleItemClick = (e: SyntheticEvent) => {
    console.log(e);
  };

  return (
    <>
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        <Menu stackable secondary>
          <Menu.Item
            name="Oppgavetekst"
            active={activeItem === "lessontext"}
            onClick={() => setActiveItem("lessontext")}
            style={activeItem === "lessontext" ? { borderBottom: "5px solid green" } : {}}
          />
          <Menu.Item
            name="Veiledningtekst"
            active={activeItem === "teacherguide"}
            onClick={() => setActiveItem("teacherguide")}
            style={activeItem === "teacherguide" ? { borderBottom: "5px solid green" } : {}}
          />
          <Menu.Item
            name="Alle Filer"
            active={activeItem === "allfiles"}
            onClick={() => setActiveItem("allfiles")}
            style={activeItem === "allfiles" ? { borderBottom: "5px solid green" } : {}}
          />
          {/* <Menu.Menu position="right">
            <Menu.Item name="Sorter" active={activeItem === "sort"} onClick={handleItemClick} />
          </Menu.Menu> */}
        </Menu>

        {activeItem === "lessontext" && <LessontextItems />}
        {activeItem === "teacherguide" && <TeacherguideItems />}
        {activeItem === "allfiles" && <AllFiles />}
      </div>
    </>
  );
};

export default Content;
