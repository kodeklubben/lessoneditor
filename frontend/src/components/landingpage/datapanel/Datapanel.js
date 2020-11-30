import "./datapanel.scss";
import React, { useContext, useState, useEffect } from "react";
import { Button, Icon, Popup } from "semantic-ui-react";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";
import Levels from "./Levels";
import License from "./License";
import { LessonContext } from "contexts/LessonContext";

const Datapanel = ({ openDataPopup, setOpenDataPopup, lessonId, mode }) => {
  const context = useContext(LessonContext);
  const { ymlData, setLessonData, saveYml } = context;
  const [checkBoxState, setCheckBoxState] = useState({});

  const isEmptyDatapanel =
    JSON.stringify(ymlData.tags) ===
    JSON.stringify({ topic: [], subject: [], grade: [] });

  if (isEmptyDatapanel) {
    setOpenDataPopup(true);
  }

  /*
   * Det ser ut som vi trenger denne useEffecten for å forhindre inifite loop
   */
  useEffect(() => {
    const mapYamlTags = () => {
      let obj;
      obj = ymlData.tags.topic.reduce(
        (accumulator, currentValue) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      obj = ymlData.tags.subject.reduce(
        (accumulator, currentValue) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      obj = ymlData.tags.grade.reduce(
        (accumulator, currentValue) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      setCheckBoxState((prevState) => ({ ...prevState, ...obj }));
    };
    if (ymlData.tags) {
      mapYamlTags();
    }
  }, [ymlData.tags]);

  const onSubmit = async () => {
    saveYml(ymlData).then(() => {
      setOpenDataPopup(false);
    });
  };

  const onCancel = async () => {
    //window.location.reload();
  };

  const dropdownHandler = (event, { name, value }) => {
    setLessonData((prevState) => ({
      ...prevState,
      yml: { ...prevState.yml, [name]: value },
    }));
  };

  const checboxHandler = (event) => {
    let subtag = event.target.getAttribute("subtag");
    let name = event.target.value;
    let value = event.target.checked;

    setCheckBoxState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!ymlData.tags[subtag].includes(name)) {
      setLessonData((prevState) => ({
        ...prevState,
        yml: {
          ...prevState.yml,
          tags: {
            ...prevState.yml.tags,
            [subtag]: [...prevState.yml.tags[subtag], name],
          },
        },
      }));
    } else {
      setLessonData((prevState) => ({
        ...prevState,
        yml: {
          ...prevState.yml,
          tags: {
            ...prevState.yml.tags,
            [subtag]: prevState.yml.tags[subtag].filter((e) => e !== name),
          },
        },
      }));
    }
  };

  const changeHandler = (event) => {
    let name =
      event.target.type === "checkbox" ? event.target.value : event.target.name;
    let value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setLessonData((prevState) => ({
      ...prevState,
      yml: { ...prevState.yml, [name]: value },
    }));
  };

  return (
    <>
      <Popup
        content={"Endre prosjektdata"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            style={{
              position: "relative",
              top: "-3.5em",
            }}
            className={`ui button`}
            id="tagButton"
            size="medium"
            onClick={() => setOpenDataPopup(!openDataPopup)}
          >
            <span>
              <Icon color={"grey"} name={"tags"} /> Oppgavedata
            </span>
          </Button>
        }
      />

      {openDataPopup ? (
        <div
          style={openDataPopup ? { display: "flex" } : { display: "none" }}
          className="datapanel_BG"
        >
          <div className="datapanel_container">
            {!isEmptyDatapanel ? (
              <i
                onClick={() => setOpenDataPopup(!openDataPopup)}
                className="big grey x icon landingpage"
              />
            ) : (
              ""
            )}
            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "-2em",
                marginLeft: "auto",
                marginBottom: "2em",
              }}
            >
              Oppgavedata
            </h2>
            <div className="ui form datapanel">
              <div id="bigScreen" className="two fields">
                <div className="field">
                  <CheckboxField
                    labelTitle={YML_TEXT.topic}
                    content={
                      <TagsTopic
                        data={checkBoxState}
                        changeHandler={checboxHandler}
                      />
                    }
                  />
                  <CheckboxField
                    labelTitle={YML_TEXT.grade}
                    content={
                      <TagsGrade
                        data={checkBoxState}
                        changeHandler={checboxHandler}
                      />
                    }
                  />
                </div>
                <div className="field">
                  <CheckboxField
                    labelTitle={YML_TEXT.subject}
                    content={
                      <TagsSubject
                        data={checkBoxState}
                        changeHandler={checboxHandler}
                      />
                    }
                  />
                  <div>
                    <div style={{ marginBottom: "2.3em" }} />
                    <Levels changeHandler={dropdownHandler} data={ymlData} />
                    <div style={{ marginBottom: "5em" }} />
                    <License changeHandler={changeHandler} data={ymlData} />
                  </div>
                </div>
              </div>
              <button
                className="ui button"
                disabled={
                  JSON.stringify(ymlData.tags) ===
                  JSON.stringify({ topic: [], subject: [], grade: [] })
                }
                onClick={onSubmit}
              >
                OK
              </button>
              {!isEmptyDatapanel ? (
                <button
                  className="ui button"
                  disabled={
                    JSON.stringify(ymlData.tags) ===
                    JSON.stringify({ topic: [], subject: [], grade: [] })
                  }
                  onClick={onCancel}
                >
                  Avbryt
                </button>
              ) : (
                ""
              )}
              {isEmptyDatapanel ? (
                <p style={{ color: "red" }}>
                  Må inneholde minst ett valg i kategoriene Tema, Fag, eller
                  Klassetrinn
                </p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default Datapanel;
