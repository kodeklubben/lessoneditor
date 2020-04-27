import React from "react";

import { YMLtagsSubject, YMLtagsTopic } from "./YMLtags";
import { YML_TEXT } from "./settingsFiles/languages/formpage_NO";

import { FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

import { Dropdown } from "semantic-ui-react";
import {
  SUBJECT as subjects,
  TOPIC as topics
} from "./settingsFiles/languages/formpage_NO";

const SUBJECT_SUBTAG = "subject";
const TOPIC_SUBTAG = "topic";

const SUBJECT = {
  name: Object.values(subjects),
  value: Object.keys(subjects)
};

const TOPIC = {
  name: Object.values(topics),
  value: Object.keys(topics)
};

const subjectSettings = [];
const subjectLen = SUBJECT.name.length;

for (let i = 0; i < subjectLen; i++) {
  subjectSettings.push({
    key: SUBJECT.value[i],
    text: SUBJECT.name[i],
    value: SUBJECT.value[i]
  });
}

const topicSettings = [];
const topicLen = TOPIC.name.length;

for (let i = 0; i < topicLen; i++) {
  topicSettings.push({
    key: TOPIC.value[i],
    text: TOPIC.name[i],
    value: TOPIC.value[i]
  });
}

const Page3 = props => {
  return (
    <React.Fragment>
      <div className="ui grid">
        <div className="sixteen wide column">
          <div className="field">
            <label>
              <h3 className="formLabel">
                {FORM_TEXT.TITLE.heading}
                <span className="requiredText"> (obligatorisk)</span>
              </h3>
            </label>
            <input
              autoFocus
              autoComplete="off"
              type="text"
              name="title"
              placeholder={FORM_TEXT.TITLE.placeholder}
              value={props.state.title}
              onChange={props.changeHandler}
            />
          </div>
        </div>
        <div className="validateError">{props.state.titleErr}</div>
      </div>

      <div id="bigScreen" className="ui grid">
        <div className="row">
          <div className="column">
            <label>
              <h3 className="formLabel">{YML_TEXT.subject}</h3>
            </label>
            <div className="ui segment">
              <div className="ui stackable two column grid">
                <YMLtagsSubject checkboxHandler={props.checkboxHandler} />
              </div>
            </div>
          </div>
        </div>
        <div className="eight wide column">
          <div className="field">
            <label>
              <h3 className="formLabel">{YML_TEXT.topic}</h3>
            </label>
            <div className="ui segment">
              <div className="ui stackable two column grid">
                <YMLtagsTopic checkboxHandler={props.checkboxHandler} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Only if smallScreen */}
      <div id="smallScreen" className="ui grid">
        <div className="row">
          <div className="eight wide column">
            <label>
              <h3 className="formLabel">{YML_TEXT.subject}</h3>
            </label>
            <div>
              <Dropdown
                placeholder="Velg fag"
                fluid
                multiple
                selection
                subtag={SUBJECT_SUBTAG}
                onChange={props.selectDropdownHandler}
                options={subjectSettings}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="eight wide column">
            <label>
              <h3 className="formLabel">{YML_TEXT.topic}</h3>
            </label>
            <div>
              <Dropdown
                placeholder="Velg tema"
                fluid
                multiple
                selection
                subtag={TOPIC_SUBTAG}
                onChange={props.selectDropdownHandler}
                options={topicSettings}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Page3;
