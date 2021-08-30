import "./landingpage.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import LandingageNavbar from "./landingpageNavbar/LandingpageNavbar";
import LessonTexts from "./LessonTexts";
import ShowSpinner from "../ShowSpinner";
import fetchMdText from "../../api/fetch-md-text";
import Navbar from "../navbar/Navbar";
import MDPreview from "../editor/MDPreview";
import { Button } from "semantic-ui-react";
import { useLessonContext } from "../../contexts/LessonContext";
import { useFileContext } from "../../contexts/FileContext";

const Landingpage = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [lessontext, setLessontext] = useState("");
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lessonData, saveLesson } = useLessonContext();

  const lessonList = lessonData.files;
  const lessonTitle = lessonData.lessonTitle;
  const courseTitle = lessonData.courseTitle;

  const onSubmit = async (lessonId: string) => {
    setShowSpinner(true);
    await saveLesson(lessonData);
  };

  useEffect(() => {
    async function fetchData() {
      const result = await fetchMdText(lessonId, lessonTitle);
      setLessontext(result);
    }
    fetchData();
  });

  if (showSpinner || !lessonData.lesson) {
    return <ShowSpinner />;
  } else {
    return (
      <>
        <Navbar />
        <div className="landingpage_container">
          <LandingageNavbar lessonTitle={lessonTitle} courseTitle={courseTitle} />
          <LessonTexts lessonId={lessonId} lessonList={lessonList} lessonTitle={lessonTitle} />

          <div
            style={{
              width: "500px",
              height: "500px",
              border: "solid black 2px",
              overflow: "hidden",
            }}
          >
            <MDPreview mdText={lessontext} language="nb" course="microbit" />
          </div>

          <div id="landingpageButtonContainer">
            <a href={"/"}>
              <Button content="Tilbake" color="black" />
            </a>

            <Button
              onClick={() => console.log("submit")}
              content="Sende inn"
              positive
              labelPosition="right"
              icon="arrow right"
            />
          </div>
        </div>
      </>
    );
  }
};

export default Landingpage;
