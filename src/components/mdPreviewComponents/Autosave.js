import React from "react";

// meldingen i autosave
var autoSaveMessage = <br />;

const Autosave = props => {
  // useEffect():  Koden kjører når komponenten oppdaterer, passer bra til å konfigurere nedtelling:
  React.useEffect(() => {
    setTimeout(() => {
      props.setCounter(props.counter + 1);
      if (props.counter === 2) {
        autoSaveMessage = "document saved";
      }
      if (props.counter === 0) {
        autoSaveMessage = "saving..";
        props.autoSaveFn();
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
