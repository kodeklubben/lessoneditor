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
    <div style={{ margin: "1vw" }}>
      <Header as="h3" content={FORM_TEXT.LICENSE.heading} />
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
