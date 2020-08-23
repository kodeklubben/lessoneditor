import "./datapanel.scss";
import React, { useState, useContext } from "react";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";
import Levels from "./Levels";
import License from "./License";
import { LessonContext } from "contexts/LessonContext";

const Datapanel = () => {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(1);
  const [license, setLicense] = useState("CC BY-SA 4.0");
  const [tags, setTags] = useState({ topic: [], subject: [], grade: [] });

  const context = useContext(LessonContext);
  const { data, setData } = context;

  const onSubmit = () => {
    setOpen(false);
  };

  const checkboxHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    let i = tags;
    if (i[name].includes(value)) {
      i[name].splice(i[name].indexOf(value), 1);
    } else {
      i[name].push(value);
    }
    setTags((prevState) => ({ ...prevState, i }));
    setData((prevState) => ({
      ...prevState,
      yml: {
        ...prevState.yml,
        topic: i.topic,
        subject: i.subject,
        grade: i.grade,
      },
    }));
    console.log(data);
  };

  const changeHandler = (event, { value, name }) => {
    switch (name) {
      case "level":
        setLevel(value);
        break;
      case "license":
        setLicense(value);
        break;
      default:
        break;
    }
    setData((prevState) => ({
      ...prevState,
      yml: { ...prevState.yml, [name]: value },
    }));
    console.log(data);
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
                    content={<TagsTopic checkboxHandler={checkboxHandler} />}
                  />
                  <CheckboxField
                    labelTitle={YML_TEXT.grade}
                    content={<TagsGrade checkboxHandler={checkboxHandler} />}
                  />
                </div>
                <div className="field">
                  <CheckboxField
                    labelTitle={YML_TEXT.subject}
                    content={<TagsSubject checkboxHandler={checkboxHandler} />}
                  />
                  <div>
                    <Levels level={level} changeHandler={changeHandler} />
                    <License license={license} changeHandler={changeHandler} />
                  </div>
                </div>
              </div>
              <button className="ui button" onClick={onSubmit}>
                OK
              </button>
              <button className="ui button" onClick={() => setOpen(!open)}>
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
