import "./courseinfo.scss";

type propTypes = {
  lessonTitle: string;
  courseTitle: string;
  isSubmitted: boolean;
};

const CourseInfo = ({ lessonTitle, courseTitle, isSubmitted }: propTypes) => {
  return (
    <section>
      <h1>Tittel : {lessonTitle}</h1>

      <h1>Kurs: {courseTitle}</h1>
      {isSubmitted ? <h2>Oppgaven er sendt inn til KidsaKoder</h2> : ""}
    </section>
  );
};

export default CourseInfo;
