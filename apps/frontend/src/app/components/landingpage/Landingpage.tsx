import "./landingpage.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import LandingageNavbar from "./landingpageNavbar/LandingpageNavbar";
import LandingpageDatamodal from "./datapanel/LandingpageDatamodal";
import LessonTexts from "./LessonTexts";
import ShowSpinner from "../ShowSpinner";
import fetchMdText from "../../api/fetch-md-text";
import Navbar from "../navbar/Navbar";
import MDPreview from "../editor/MDPreview";
import { Button } from "semantic-ui-react";
import { useLessonContext } from "../../contexts/LessonContext";

const Landingpage = () => {
  // const [showSpinner, setShowSpinner] = useState(false);
  // const [lessontext, setLessontext] = useState("");
  // const { lessonId } = useParams<{ lessonId: string }>();
  // const { lessonData, lessonFiles, saveLessonData } = useLessonContext();

  // const lessonList = lessonFiles ? lessonFiles : "";
  // const lessonTitle = lessonData ? lessonData.lessonTitle : "";
  // const courseTitle = lessonData ? lessonData.courseTitle : "";

  // const onSubmit = async (lessonId: string) => {
  //   setShowSpinner(true);
  //   await saveLessonData(lessonData);
  // };

  // useEffect(() => {
  //   async function fetchData() {
  //     const result = await fetchMdText(lessonId, lessonTitle);
  //     setLessontext(result);
  //   }
  //   fetchData();
  // });

  return (
    <>
      <Navbar />
      <LandingpageDatamodal />
    </>
  );
};

export default Landingpage;
