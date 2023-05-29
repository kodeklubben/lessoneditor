import "./landingpage.scss";
import { Navbar } from "../components/navbar/Navbar";
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
        <section className="landingpage_actions">
          <div className="landingpage_actions__container">
            <div className="landingpage_datamodal_button">
              <LandingpageDatamodal />
            </div>
            <CourseInfo
              lessonTitle={lessonTitle}
              courseTitle={courseTitle}
              isSubmitted={submitted}
            />
            <div className="landingpage_actions">
              <NewLessontext />
              <SubmitLesson />
            </div>
          </div>
        </section>
        <section className="landingpage_lessons-menu">
          <Content />
        </section>
      </div>
    </>
  );
};

export default Landingpage;
