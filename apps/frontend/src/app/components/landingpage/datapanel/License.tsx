import { Header, Input } from "semantic-ui-react";
import { FORM_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { FC, SyntheticEvent } from "react";
import { YamlContent } from "../../../../../../../libs/contracts/src/index";

interface LicenseProps {
  changeHandler: (e: SyntheticEvent, data: Record<string, string>) => void;
  data: YamlContent;
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
