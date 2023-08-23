import { Loader, Dimmer } from "semantic-ui-react";

const languages = {
  nb: "Vennligst vent",
};

const ShowSpinner = () => {
  return (
    <Dimmer active inverted page>
      <Loader>{languages.nb}</Loader>
    </Dimmer>
  );
};

export default ShowSpinner;
