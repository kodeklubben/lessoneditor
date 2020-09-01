import React from "react";
import { useHistory } from "react-router";

const languageOptions = {
  nb: {
    text: "Bokmål",
    value: "nb",
    image: { avatar: true, src: "/languagesFlag/flag_nb.svg" },
  },
  nn: {
    text: "Nynorsk",
    value: "nn",
    image: { avatar: true, src: "/languagesFlag/flag_nn.svg" },
  },
  en: {
    text: "Engelsk",
    value: "en",
    image: { avatar: true, src: "/languagesFlag/flag_en.svg" },
  },
  is: {
    text: "Islandsk",
    value: "is",
    image: { avatar: true, src: "/languagesFlag/flag_is.svg" },
  },
};

const LessonCard = ({
  title,
  lessonId,
  language,
  hasContent,
  thumbUrl,
  lessonTitle,
}) => {
  const history = useHistory();

  const navigateToEditor = (lessonId, file) => {
    const target = ["/editor", lessonId, file].join("/");
    history.push(target);
  };

  return (
    <div style={{ margin: "1em" }}>
      <div className="ui fluid card">
        <div style={{ width: "360px" }} className="image itemListImage">
          {hasContent ? (
            hasContent ? (
              <div
                style={{ width: "360px", padding: "10px" }}
                className="ui placeholder"
              >
                <div className="line"> </div>
                <div className="line"> </div>
                <div className="line"> </div>
                <div className="line"> </div>
                <div className="image header">
                  <div className="line"> </div>
                  <div className="line"> </div>
                  <div className="line"> </div>
                  <div className="line"> </div>
                </div>
              </div>
            ) : (
              <div style={{ width: "360px" }}></div>
            )
          ) : (
            <h2
              style={{
                position: "relative",
                left: "25%",
                width: "360px",
                marginTop: "2em",
                padding: "10px",
              }}
            >
              Ingen innhold
            </h2>
          )}
          {language ? (
            <img
              style={{
                width: "15%",
                position: "absolute",
                left: "85%",
                top: "79%",
              }}
              src={languageOptions[language].image.src}
              alt={""}
            />
          ) : (
            ""
          )}
        </div>
        <div className="content">
          <div className="header">
            {title + " (" + languageOptions[language].text + ")"}
          </div>
        </div>
        <div className="extra content">
          {hasContent ? (
            <button
              className="ui button"
              onClick={() =>
                navigateToEditor(
                  lessonId,
                  language !== "nb" ? lessonTitle + "_" + language : lessonTitle
                )
              }
            >
              Åpne
            </button>
          ) : (
            <button
              className="ui button"
              onClick={() =>
                navigateToEditor(
                  lessonId,
                  language !== "nb" ? lessonTitle + "_" + language : lessonTitle
                )
              }
            >
              Lag tekstfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
