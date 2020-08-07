import "./datapanel.scss";
import React, { useState } from "react";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";
import Levels from "./Levels";
import License from "./License";

const checkboxHandler = () => {
  console.log("hello");
};

const Datapanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ padding: "1em 0 0 1em", display: "flex" }}>
        <div style={{ display: "flex" }} onClick={() => setOpen(!open)}>
          <i style={{ cursor: "pointer" }} className="big grey cog icon"></i>
        </div>
        {open ? (
          <div style={{ display: "flex" }} className="datapanel_container">
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
              <Levels />
              <License />
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
