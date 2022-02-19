import { Grid, Header, Segment } from "semantic-ui-react";
import { FC, ReactChild } from "react";

interface CheckboxFieldProps {
  labelTitle: string;
  content: ReactChild;
}

const CheckboxField: FC<CheckboxFieldProps> = ({ labelTitle, content }) => {
  return (
    <label style={{ flex: "1", margin: "1vw" }}>
      <Header as="h3">{labelTitle}</Header>
      <div>{content}</div>
    </label>
  );
};

export default CheckboxField;
