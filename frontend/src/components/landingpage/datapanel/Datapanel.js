import "./datapanel.scss";
import React, { useState, useContext, useEffect } from "react";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";
import Levels from "./Levels";
import License from "./License";
import { LessonContext } from "contexts/LessonContext";

const Datapanel = () => {
  const [open, setOpen] = useState(false);
  const context = useContext(LessonContext);
  const { data, setData, getLessonData, saveLesson } = context;

  const onSubmit = async () => {
    await saveLesson(data);
    setOpen(false);
  };

  const onCancel = async () => {
    await getLessonData();
    setOpen(false);
  };

  const dropdownHandler = (event, { name, value }) => {
    setData((prevState) => ({
      ...prevState,
      yml: { ...prevState.yml, [name]: value },
    }));
  };

  console.log(JSON.stringify(data));

  const changeHandler = (event) => {
    let name =
      event.target.type === "checkbox" ? event.target.value : event.target.name;
    let value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setData((prevState) => ({
      ...prevState,
      yml: { ...prevState.yml, [name]: value },
    }));
  };

  return (
    <>
      <button
        style={{ backgroundColor: "rgb(0,0,0,0)" }}
        className="ui button"
        onClick={() => setOpen(!open)}
      >
        <i
          style={{ cursor: "pointer" }}
          className="big grey cog icon landingpage"
        ></i>
      </button>
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
                      <TagsTopic data={data} changeHandler={changeHandler} />
                    }
                  />
                  <CheckboxField
                    labelTitle={YML_TEXT.grade}
                    content={
                      <TagsGrade data={data} changeHandler={changeHandler} />
                    }
                  />
                </div>
                <div className="field">
                  <CheckboxField
                    labelTitle={YML_TEXT.subject}
                    content={
                      <TagsSubject data={data} changeHandler={changeHandler} />
                    }
                  />
                  <div>
                    <Levels changeHandler={dropdownHandler} data={data} />
                    <License changeHandler={changeHandler} data={data} />
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
