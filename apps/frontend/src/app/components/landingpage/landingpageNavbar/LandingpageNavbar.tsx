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

  // const handleChange = (e: any, value: string) => {
  //   const target = ["/landingpage", lessonId, value].join("/");
  //   history.push(target);
  // };

  return (
    <>
      <LandingpageDatamodal />
    </>
  );
};

export default LandingageNavbar;
