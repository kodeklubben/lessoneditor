import "./content.scss";
import { useState } from "react";
import LessontextItems from "./LessonTextItems";
import TeacherguideItems from "./TeacherguideItems";
import AllFiles from "../landingpage/AllFiles";
import { Menu } from "semantic-ui-react";
import { useViewMode } from "../../utils/useViewMode";
import ViewToggle from "../shared/ViewToggle";

const Content = () => {
  const [activeItem, setActiveItem] = useState("lessontext");
  // A list by default here: few texts, and the languages read best one under the other.
  const [viewMode, setViewMode] = useViewMode("landingpage", "list");

  return (
    <>
      <div className="lessons_menu">
        <div className="lessons_menu__bar">
          <Menu secondary className="lessons_menu__items">
            <Menu.Item
              name="lessontext"
              content="Oppgavetekst"
              active={activeItem === "lessontext"}
              onClick={() => setActiveItem("lessontext")}
              style={
                activeItem === "lessontext" ? { borderBottom: "4px solid var(--le-green)" } : {}
              }
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
          <ViewToggle mode={viewMode} onChange={setViewMode} />
        </div>

        <div className={`landingpage-texts landingpage-texts--${viewMode}`}>
          {activeItem === "lessontext" && <LessontextItems />}
          {activeItem === "teacherguide" && <TeacherguideItems />}
          {activeItem === "allfiles" && <AllFiles />}
        </div>
      </div>
    </>
  );
};

export default Content;
