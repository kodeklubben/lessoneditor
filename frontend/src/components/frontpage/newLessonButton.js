import React from 'react';
import {Button, Icon} from 'semantic-ui-react';

const NewLessonButton = ({setShowPopup}) => {
  return (
      <Button icon labelPosition="left" positive onClick={setShowPopup}>
        <Icon name="plus"/>
        Ny oppgave
      </Button>
  );
};
export default NewLessonButton;
