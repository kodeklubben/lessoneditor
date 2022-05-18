import "./license.scss";
import { Header, Input } from "semantic-ui-react";
import { FORM_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { FC, SyntheticEvent } from "react";
import { YamlContent } from "@lessoneditor/contracts";

interface LicenseProps {
  changeHandler: (e: SyntheticEvent, data: Record<string, string>) => void;
  data: YamlContent;
}

const License: FC<LicenseProps> = ({ changeHandler, data }) => {
  return (
    <div className="license">
      <h3>{FORM_TEXT.LICENSE.heading} </h3>
      <Input
        autoComplete="off"
        type="text"
        name="license"
        placeholder={FORM_TEXT.LICENSE.placeholder}
        onChange={changeHandler}
        value={data.license === "CC BY-SA 4.0" ? "" : data.license}
        fluid
      />
    </div>
  );
};

export default License;
