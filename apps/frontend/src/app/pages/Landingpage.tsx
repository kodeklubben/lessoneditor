import "./landingpage.scss";
import { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { useLessonPullRequests } from "../components/frontpage/LessonStatus";
import Navbar from "../components/navbar/Navbar";
import NewLessontext from "../components/landingpage/NewLessontext";
import SubmitLesson from "../components/landingpage/SubmitLesson";
import CourseInfo from "../components/landingpage/CourseInfo";
import Content from "../components/landingpage/Content";
import { useLessonContext } from "../contexts/LessonContext";
import LandingpageDatamodal from "../components/landingpage/datapanel/LandingpageDatamodal";

const Landingpage = () => {
  const { state } = useLessonContext();
  const { state: userState } = useUserContext();
  // Submitted in this visit: the lesson state from the server still says no until a reload.
  const [justSubmitted, setJustSubmitted] = useState(0);
  const lesson = justSubmitted ? { ...state.lesson, submitted: true } : state.lesson;
  const pullRequest = useLessonPullRequests(userState.user?.userId, [lesson], justSubmitted)[
    state.lesson.lessonId
  ];

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
              isSubmitted={submitted || justSubmitted > 0}
              lesson={lesson}
              pullRequest={pullRequest}
            />
            <div className="landingpage_actions">
              <NewLessontext />
              <SubmitLesson
                lesson={lesson}
                pullRequest={pullRequest}
                onSubmitted={() => setJustSubmitted((n) => n + 1)}
              />
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
