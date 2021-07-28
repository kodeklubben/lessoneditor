import ShowSpinner from "../ShowSpinner";
import { Button } from "semantic-ui-react";
import {FC} from "react";

const AreyousurePopup:FC<any> = ({
  onSubmit,
  setAreYouSure,
  showSpinner,
  lessonId,
}) => {
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
      {showSpinner ? (
        <ShowSpinner />
      ) : (
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
          <h1>Alert(!):Vil du __virkelig__ sende inn oppgaven...?</h1>
          <div style={{ marginTop: "5em" }}>
            <div style={{ float: "left", marginRight: "auto" }}>
              <Button
                icon="big bomb"
                color="red"
                onClick={() => onSubmit(lessonId)}
                content="Sende inn"
              />
            </div>
            <div style={{ float: "right", marginLeft: "auto" }}>
              <Button
                icon="big red heart"
                color="green"
                onClick={() => setAreYouSure(false)}
                content="Få meg tilbake til trygg grunn..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreyousurePopup;
