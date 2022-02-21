import "./landingpage.scss";
import { Header } from "semantic-ui-react";
import Navbar from "../navbar/Navbar";
import NewLessontext from "./NewLessontext";
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
          {/* <div
            style={{
              maxWidth: "1200px",
              margin: "auto",
            }}
          >
            <div style={{ display: "flex", flexFlow: "column" }}>
              <Header as={"h1"}>Oppgave Oversikt</Header>
              <div
                style={{
                  borderBottom: "5px solid",
                  borderBottomColor: "green",
                  margin: "0 0 6vh 0vh",
                  width: "30%",
                }}
              />
            </div>
          </div> */}

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
