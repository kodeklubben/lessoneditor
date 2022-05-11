import "./landingpage.scss";
import { Header } from "semantic-ui-react";
import Navbar from "../components/navbar/Navbar";
import NewLessontext from "../components/landingpage/NewLessontext";
import SubmitLesson from "../components/landingpage/SubmitLesson";
import CourseInfo from "../components/landingpage/CourseInfo";
import Content from "../components/landingpage/Content";
import { useLessonContext } from "../contexts/LessonContext";
import LandingpageDatamodal from "../components/landingpage/datapanel/LandingpageDatamodal";

const Landingpage = () => {
  const { state } = useLessonContext();

  const { lessonTitle, courseTitle, submitted } = state.lesson;

  return (
    <>
      <Navbar />
      <div className="landingpage_container">
        <section className="landingpage_section1">
          <div className="landingpage_datamodal_button">
            <LandingpageDatamodal />
          </div>

          <div className="landingpage_section1_content">
            <CourseInfo
              lessonTitle={lessonTitle}
              courseTitle={courseTitle}
              isSubmitted={submitted}
            />
            <div className="landingpage_cardsection">
              <NewLessontext />
              <SubmitLesson />
            </div>
          </div>
        </section>
        <section className="landingpage_section2">
          <Content />
        </section>
      </div>
    </>
  );
};

export default Landingpage;
