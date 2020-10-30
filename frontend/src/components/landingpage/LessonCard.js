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

const LessonCard = ({ title, lessonId, language, hasContent, lessonTitle }) => {
  const history = useHistory();

  const navigateToEditor = (lessonId, lessonTitle, language) => {
    const target = ["/editor", lessonId, lessonTitle, language].join("/");
    history.push(target);
  };

  return (
    <div style={{ margin: "1em" }}>
      <div className="ui fluid card">
        <div style={{ width: "360px" }} className="image itemListImage">
          {hasContent ? (
            hasContent ? (
              <>
                <img
                  style={{ opacity: "0.3" }}
                  src={`/api/display/${lessonId}/preview.png?${performance.now()}`}
                  alt="thumbUrl"
                />
                <div
                  style={{
                    position: "absolute",
                    top: "3.4em",
                    left: "2.5em",
                    backgroundColor: "rgba(256,256,256,0.75)",
                    padding: "0.7em",
                    borderRadius: "20px",
                  }}
                >
                  <h2>{title + " (" + languageOptions[language].text + ")"}</h2>
                </div>
              </>
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

        <div className="extra content">
          {hasContent ? (
            <button
              className="ui button"
              onClick={() => navigateToEditor(lessonId, lessonTitle, language)}
            >
              Åpne
            </button>
          ) : (
            <button
              className="ui button"
              onClick={() => navigateToEditor(lessonId, lessonTitle, language)}
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
