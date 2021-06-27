import React from "react";
import { Segment, Grid, Header } from "semantic-ui-react";

const CheckboxField = ({ labelTitle, content }) => {
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
