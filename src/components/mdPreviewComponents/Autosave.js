import React from "react";

// meldingen i autosave
var autoSaveMessage = <br />;

const Autosave = props => {
  // useEffect():  Koden kjører når komponenten oppdaterer, passer bra til å konfigurere nedtelling:
  React.useEffect(() => {
    setTimeout(props.counter++ => {
      props.setCounter();
      if (props.counter === 3) {
        props.autoSaveFn();
        autoSaveMessage = "dokument lagret";
      }
      if (props.counter < 2) {
        autoSaveMessage = "lagrer dokument...";
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
