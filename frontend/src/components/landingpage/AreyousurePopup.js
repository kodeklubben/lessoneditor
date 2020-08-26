import React from "react";

const AreyousurePopup = ({ onSubmit, setAreYouSure, showSpinner }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0%",
        left: "0%",
        zIndex: "1",
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(256,256,256,0.7)",
      }}
    >
      {showSpinner ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20%",
          }}
        >
          <img style={{ width: "4em" }} src="/spinner.gif" alt="spinner" />
        </div>
      ) : (
        <div
          style={{
            borderRadius: "20px",
            boxShadow: "0px 0px  10px",
            zIndex: "2",
            margin: "auto",
            marginTop: "10%",
            padding: "5% 7% 0%",
            width: "50%",
            height: "40%",
            backgroundColor: "white",
            border: "5px solid red",
          }}
        >
          <h1>Alert(!):Vil du __virkelig__ sende inn oppgaven...?</h1>
          <div style={{ marginTop: "5em" }}>
            <div style={{ float: "left", marginRight: "auto" }}>
              <i className="big bomb icon"></i>
              <button
                style={{ backgroundColor: "red" }}
                className="ui button"
                onClick={onSubmit}
              >
                Sende inn
              </button>
              <i className="big bomb icon"></i>
            </div>
            <div style={{ float: "right", marginLeft: "auto" }}>
              <i className="big red heart icon"></i>
              <button
                style={{ backgroundColor: "green" }}
                className="ui button"
                onClick={() => setAreYouSure(false)}
              >
                Få meg tilbake til trygg grunn...
              </button>
              <i className="big birthday cake icon"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreyousurePopup;
