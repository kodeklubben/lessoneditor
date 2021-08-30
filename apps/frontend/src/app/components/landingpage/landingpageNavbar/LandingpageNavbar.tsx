import { useHistory, useParams } from "react-router";
import LandingpageDatamodal from "../datapanel/LandingpageDatamodal";
import { Dropdown, Popup } from "semantic-ui-react";
import { FC } from "react";

interface LandingpageNavbarProps {
  lessonTitle: string;
  courseTitle: string;
}

const LandingageNavbar: FC<LandingpageNavbarProps> = ({ lessonTitle, courseTitle }) => {
  const history = useHistory();
  const { lessonId } = useParams<{ lessonId: string; mode: string }>();

  const handleChange = (e: any, value: string) => {
    const target = ["/landingpage", lessonId, value].join("/");
    history.push(target);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#7cd3c31a",
          width: "100%",
        }}
        className="landing_navbar"
      >
        <h2>
          <>
            <span style={{ color: "grey" }}>Prosjekttittel: </span>
            <span>{lessonTitle}</span>
            <span style={{ color: "grey", marginLeft: "1em" }}>Kurs: </span>
            <span>{courseTitle}</span>
          </>
        </h2>
        <div>
          <LandingpageDatamodal />
        </div>
      </div>
    </>
  );
};

export default LandingageNavbar;
