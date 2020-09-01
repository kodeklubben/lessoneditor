import React from "react";

const ShowSpinner = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0%",
        left: "0%",
        zIndex: "5",
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(256,256,256,0.7)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20%",
          zIndex: "6",
        }}
      >
        <img style={{ width: "4em" }} src="/spinner.gif" alt="spinner" />
      </div>
    </div>
  );
};

export default ShowSpinner;
