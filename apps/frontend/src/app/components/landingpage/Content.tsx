import "./content.scss";
import { useState } from "react";
import LessontextItems from "./LessonTextItems";
import TeacherguideItems from "./TeacherguideItems";
import AllFiles from "../landingpage/AllFiles";
import { Menu } from "semantic-ui-react";

const Content = () => {
  const [activeItem, setActiveItem] = useState("lessontext");

  return (
    <>
      <div className="lessons_menu">
        <Menu secondary className="lessons_menu__items">
          <Menu.Item
            name="lessontext"
            content="Oppgavetekst"
            active={activeItem === "lessontext"}
            onClick={() => setActiveItem("lessontext")}
            style={activeItem === "lessontext" ? { borderBottom: "4px solid var(--le-green)" } : {}}
          />
          <Menu.Item
            name="teacherguide"
            content="Lærerveiledning"
            active={activeItem === "teacherguide"}
            onClick={() => setActiveItem("teacherguide")}
            style={
              activeItem === "teacherguide" ? { borderBottom: "4px solid var(--le-green)" } : {}
            }
          />
          <Menu.Item
            name="allfiles"
            content="Alle filer"
            active={activeItem === "allfiles"}
            onClick={() => setActiveItem("allfiles")}
            style={activeItem === "allfiles" ? { borderBottom: "4px solid var(--le-green)" } : {}}
          />
        </Menu>

        {activeItem === "lessontext" && <LessontextItems />}
        {activeItem === "teacherguide" && <TeacherguideItems />}
        {activeItem === "allfiles" && <AllFiles />}
      </div>
    </>
  );
};

export default Content;
