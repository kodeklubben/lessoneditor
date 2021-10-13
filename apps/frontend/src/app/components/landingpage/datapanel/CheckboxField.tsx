import { Grid, Header, Segment } from "semantic-ui-react";
import { FC, ReactChild } from "react";

interface CheckboxFieldProps {
  labelTitle: string;
  content: ReactChild;
}

const CheckboxField: FC<CheckboxFieldProps> = ({ labelTitle, content }) => {
  return (
    <>
      <Header as="h3">{labelTitle}</Header>
      <Segment>
        <Grid stackable columns={2}>
          <Grid.Row>{content}</Grid.Row>
        </Grid>
      </Segment>
    </>
  );
};

export default CheckboxField;
