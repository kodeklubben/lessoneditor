import React from "react";

import { LANGUAGES, FORM_TEXT } from "./settingsFiles/languages/formpage_NO";

const Page1 = props => {
  const [inputvalue, setInputvalue] = React.useState(false);

  const license = !inputvalue ? (
    <div className="">
      <div className="field">
        <div className="test3">
          <h3>Lisens:</h3>
          <button
            className="ui mini button"
            onClick={() => setInputvalue(true)}
          >
            Endre?
          </button>
        </div>

        <p style={{ marginBottom: "1em" }}>Lisenstekst</p>
      </div>
    </div>
  ) : (
    <div className="field">
      <label>
        <h3>{FORM_TEXT.LICENSE.heading}</h3>
        <input
          autoComplete="off"
          type="text"
          name="license"
          placeholder={FORM_TEXT.LICENSE.placeholder}
          value={props.state.license}
          onChange={props.changeHandler}
        />
      </label>
    </div>
  );

  return (
    <div className="">
      <div className="field">
        <label>
          <h3>
            {FORM_TEXT.AUTHOR.heading}
            <inline className="test"> (nødvendig)</inline>
          </h3>
          <input
            autoComplete="off"
            type="text"
            name="author"
            placeholder={FORM_TEXT.AUTHOR.placeholder}
            value={props.state.author}
            onChange={props.changeHandler}
          />
        </label>
        <div className="validateError">{props.state.authorErr}</div>
      </div>
      <div className="field">
        <label>
          <h3>{FORM_TEXT.TRANSLATOR.heading}</h3>
          <input
            autoComplete="off"
            type="text"
            name="translator"
            placeholder={FORM_TEXT.TRANSLATOR.placeholder}
            value={props.state.translator}
            onChange={props.changeHandler}
          />
        </label>
      </div>
      <div className="field">
        <label>
          <h3>{FORM_TEXT.LANGUAGE.heading}</h3>
          <select
            name="language"
            onChange={props.changeHandler}
            className="ui dropdown"
          >
            {LANGUAGES.map(element => (
              <option key={Object.keys(element)} value={Object.keys(element)}>
                {Object.values(element)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {license}
    </div>
  );
};

export default Page1;
