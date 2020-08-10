import "./datapanel.scss";
import React, { useState } from "react";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";
import Levels from "./Levels";
import License from "./License";

const Datapanel = () => {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(1);
  const [license, setLicense] = useState("CC BY-SA 4.0");
  const [tags, setTags] = useState({ topic: [], subject: [], grade: [] });

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
  };

  console.log(`level : ${level}, license : ${license}`);

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
  };

  return (
    <>
      <div style={{ padding: "1em 0 0 1em", display: "flex" }}>
        <div style={{ display: "flex" }} onClick={() => setOpen(!open)}>
          <i style={{ cursor: "pointer" }} className="big grey cog icon"></i>
        </div>
        {open ? (
          <div className="datapanel_BG">
            <div style={{ display: "flex" }} className="datapanel_container">
              <i
                onClick={() => setOpen(!open)}
                id="test"
                className="big grey x icon landingpage"
              />
              <div>
                <CheckboxField
                  test1={YML_TEXT.topic}
                  test2={<TagsTopic checkboxHandler={checkboxHandler} />}
                />
                <CheckboxField
                  test1={YML_TEXT.grade}
                  test2={<TagsGrade checkboxHandler={checkboxHandler} />}
                />
              </div>
              <div>
                <CheckboxField
                  test1={YML_TEXT.subject}
                  test2={<TagsSubject checkboxHandler={checkboxHandler} />}
                />
                <Levels level={level} changeHandler={changeHandler} />
                <License license={license} changeHandler={changeHandler} />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default Datapanel;
