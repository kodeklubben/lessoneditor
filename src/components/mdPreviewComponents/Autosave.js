import React from "react";

// meldingen i autosave
var autoSaveMessage = <br />;

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
          props.autoSaveFn();
          props.setCounter(props.autosaveLength);
          autoSaveMessage = <br />;
        }
      }, 1000);
  });

  return (
    <div className="autosave">
      <p style={{ color: "grey" }}>{autoSaveMessage}</p>
    </div>
  );
};

export default Autosave;
