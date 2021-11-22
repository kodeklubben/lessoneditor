import { Button } from "semantic-ui-react";
import { FC } from "react";

const ThankU: FC<any> = ({ setThankU }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0%",
        left: "0%",
        zIndex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(256,256,256,0.7)",
      }}
    >
      <div
        style={{
          borderRadius: "20px",
          boxShadow: "0px 0px  10px",
          zIndex: 2,
          margin: "auto",
          marginTop: "10%",
          padding: "5% 7% 0%",
          width: "50%",
          height: "40%",
          backgroundColor: "white",
          border: "5px solid red",
        }}
      >
        <h1>Takk for ditt birdrag til Lær Kidsa Koding!</h1>
        <div style={{ marginTop: "5em" }}>
          <div style={{ float: "left", marginRight: "auto" }}>
            <Button color="red" content="Tilbake" onClick={() => setThankU(false)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankU;
