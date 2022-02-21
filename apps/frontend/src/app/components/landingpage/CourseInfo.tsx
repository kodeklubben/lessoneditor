import "./courseinfo.scss";

type propTypes = {
  lessonTitle: string;
  courseTitle: string;
  isSubmitted: boolean;
};

const CourseInfo = ({ lessonTitle, courseTitle, isSubmitted }: propTypes) => {
  return (
    <section
      style={{
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <h1>Tittel : {lessonTitle}</h1>
      <div
        style={{
          marginTop: "1.2vh",
          borderTop: "3px solid green",
          width: "30px",
          borderRadius: "10px",
        }}
      />
      <h1 style={{ marginTop: "2.2vh" }}>Kurs: {courseTitle}</h1>
      {isSubmitted ? <h2>Oppgaven er sendt inn til KidsaKoder</h2> : ""}
    </section>
  );
};

export default CourseInfo;
