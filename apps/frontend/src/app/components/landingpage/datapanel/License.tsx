import { Header, Input } from "semantic-ui-react";
import { FORM_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { FC, SyntheticEvent } from "react";

interface Subtag {
  grade: string[];
  subject: string[];
  topic: string[];
}

interface YmlData {
  level: number;
  license: string;
  tags: Subtag;
}

interface LicenseProps {
  changeHandler: (e: SyntheticEvent, data: Record<string, string>) => void;
  data: YmlData;
}

const License: FC<LicenseProps> = ({ changeHandler, data }) => {
  return (
    <>
      <label>
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
      </label>
    </>
  );
};

export default License;
