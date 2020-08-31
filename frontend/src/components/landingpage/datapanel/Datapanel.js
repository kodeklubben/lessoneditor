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
  const context = useContext(LessonContext);
  const { ymlData, setYmlData, getLessonData, saveYml } = context;

  const onSubmit = async () => {
    await saveYml(ymlData);
    setOpen(false);
  };

  const onCancel = async () => {
    await getLessonData();
    setOpen(false);
  };

  const dropdownHandler = (event, { name, value }) => {
    setYmlData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const changeHandler = (event) => {
    console.log("ymlData : " + JSON.stringify(ymlData));
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
                      <TagsTopic data={ymlData} changeHandler={changeHandler} />
                    }
                  />
                  <CheckboxField
                    labelTitle={YML_TEXT.grade}
                    content={
                      <TagsGrade data={ymlData} changeHandler={changeHandler} />
                    }
                  />
                </div>
                <div className="field">
                  <CheckboxField
                    labelTitle={YML_TEXT.subject}
                    content={
                      <TagsSubject
                        data={ymlData}
                        changeHandler={changeHandler}
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
