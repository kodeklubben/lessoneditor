import React from "react";

// meldingen i autosave
var autoSaveMessage = <br />;

// autosave-lengde i sekunder, må være over 3 sek:
const autoSaveLength = 60;
const Autosave = props => {
  // useEffect():  Koden kjører når komponenten oppdaterer, passer bra til å konfigurere nedtelling:

  React.useEffect(() => {
    props.counter >= 0 &&
      setTimeout(() => {
        props.setCounter(props.counter - 1);
        if (props.counter === 3) {
          autoSaveMessage = "autosaving document...";
        }
        if (props.counter === 0) {
          props.autoSave();
          props.setCounter(autoSaveLength);
          autoSaveMessage = <br />;
        }
      }, 1000);
  });

  return (
    <div>
      <p>{autoSaveMessage}</p>
    </div>
  );
};

export default Autosave;
