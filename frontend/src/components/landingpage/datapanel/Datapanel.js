import "./datapanel.scss";
import React, { useState, useEffect, useContext } from "react";
import { Button, Icon, Popup } from "semantic-ui-react";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";
import Levels from "./Levels";
import License from "./License";
import { LessonContext } from "contexts/LessonContext";

const Datapanel = () => {
  const [open, setOpen] = useState(false);
  const [checkBoxState, setCheckBoxState] = useState({});
  const context = useContext(LessonContext);
  const { ymlData, setYmlData, saveYml } = context;

  useEffect(() => {
    if (!ymlData.tags) {
      return;
    }
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
  }, [ymlData.tags]);

  const onSubmit = async () => {
    await saveYml(ymlData).then(() => {
      setOpen(false);
    });
  };

  const onCancel = async () => {
    window.location.reload();
  };

  const dropdownHandler = (event, { name, value }) => {
    setYmlData((prevState) => ({
      ...prevState,
      [name]: value,
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
      setYmlData((prevState) => ({
        ...prevState,
        tags: {
          ...prevState?.tags,
          [subtag]: [...prevState?.tags[subtag], name],
        },
      }));
    } else {
      setYmlData((prevState) => ({
        ...prevState,
        tags: {
          ...prevState?.tags,
          [subtag]: prevState?.tags[subtag].filter((e) => e !== name),
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

    setYmlData((prevState) => ({
      ...prevState,
      [name]: value,
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
            onClick={() => setOpen(!open)}
          >
            <span>
              <Icon color={"gray"} name={"tags"} /> Oppgavedata
            </span>
          </Button>
        }
      />

      {open ? (
        <div
          style={open ? { display: "flex" } : { display: "none" }}
          className="datapanel_BG"
        >
          <div className="datapanel_container">
            <i
              onClick={() => setOpen(!open)}
              className="big grey x icon landingpage"
            />
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
                    <Levels changeHandler={dropdownHandler} data={ymlData} />
                    <License changeHandler={changeHandler} data={ymlData} />
                  </div>
                </div>
              </div>
              <button className="ui button" onClick={onSubmit}>
                OK
              </button>
              <button className="ui button" onClick={onCancel}>
                Avbryt
              </button>
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
