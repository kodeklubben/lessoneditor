import "./landingpage.scss";
import Navbar from "../navbar/Navbar";
import NewLesson from "./NewLesson";
import SubmitLesson from "./SubmitLesson";
import CourseInfo from "./CourseInfo";
import Content from "./Content";
import { useLessonContext } from "../../contexts/LessonContext";
import LandingpageDatamodal from "./datapanel/LandingpageDatamodal";

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
              <NewLesson />
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
