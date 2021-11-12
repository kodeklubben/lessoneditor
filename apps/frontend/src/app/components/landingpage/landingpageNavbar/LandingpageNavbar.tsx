import { useHistory, useParams } from "react-router";
import LandingpageDatamodal from "../datapanel/LandingpageDatamodal";
import { Dropdown, Popup } from "semantic-ui-react";
import { FC } from "react";

const LandingageNavbar: FC<any> = ({ lessonTitle, courseTitle }) => {
  const history = useHistory();
  const { lessonId, mode } = useParams<any>();

  const options = [
    { key: 1, text: "Oppgaver", value: "lessontexts" },
    { key: 2, text: "Lærerveiledning", value: "teacherguides" },
    { key: 3, text: "Alle filer", value: "allfiles" },
  ];

  const handleChange = (e: any, data: any) => {
    const target = ["/landingpage", lessonId, data.value].join("/");
    history.push(target);
  };

  return (
    <>
      <LandingpageDatamodal />
    </>
  );
};

export default LandingageNavbar;
