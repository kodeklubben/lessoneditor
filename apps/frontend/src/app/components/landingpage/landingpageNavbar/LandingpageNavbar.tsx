import { useNavigate, useParams } from "react-router";
import LandingpageDatamodal from "../datapanel/LandingpageDatamodal";
import { Dropdown, Popup } from "semantic-ui-react";
import { FC } from "react";

const LandingageNavbar: FC<any> = ({ lessonTitle, courseTitle }) => {
  const navigate = useNavigate();
  const { lessonId, mode } = useParams() as any;

  const options = [
    { key: 1, text: "Oppgaver", value: "lessontexts" },
    { key: 2, text: "Lærerveiledning", value: "teacherguides" },
    { key: 3, text: "Alle filer", value: "allfiles" },
  ];

  const handleChange = (e: any, data: any) => {
    const target = ["/landingpage", lessonId, data.value].join("/");
    navigate(target);
  };

  return (
    <>
      <div
        style={
          mode === "lessontexts"
            ? {
                backgroundColor: "#7cd3c31a",
                width: "100%",
              }
            : mode === "teacherguides"
            ? { backgroundColor: "#897cd31a" }
            : { backgroundColor: "#d37cb21a" }
        }
        className="landing_navbar"
      >
        <h2>
          {mode === "teacherguides" ? (
            <>
              <span style={{ color: "grey" }}>Prosjekttittel: </span>
              <span>{lessonTitle}</span> <span>{`(Lærerveiledning)`}</span>
              <span style={{ color: "grey", marginLeft: "1em" }}>Kurs: </span>
              <span>{courseTitle}</span>
            </>
          ) : (
            <>
              <span style={{ color: "grey" }}>Prosjekttittel: </span>
              <span>{lessonTitle}</span>
              <span style={{ color: "grey", marginLeft: "1em" }}>Kurs: </span>
              <span>{courseTitle}</span>
            </>
          )}
        </h2>
        <div>
          <Popup
            content={"Oversikt prosjektfiler"}
            mouseEnterDelay={250}
            mouseLeaveDelay={250}
            trigger={
              <Dropdown
                onChange={handleChange}
                options={options}
                placeholder="Choose an option"
                selection
                value={mode}
              />
            }
          />
          <LandingpageDatamodal />
        </div>
      </div>
    </>
  );
};

export default LandingageNavbar;
