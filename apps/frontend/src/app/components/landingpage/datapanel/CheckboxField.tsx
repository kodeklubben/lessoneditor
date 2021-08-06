import { Grid, Header, Segment } from "semantic-ui-react";
import { FC } from "react";

const CheckboxField: FC<any> = ({ labelTitle, content }) => {
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
