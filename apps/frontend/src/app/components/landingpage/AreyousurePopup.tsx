import { useState } from "react";
import { Button } from "semantic-ui-react";
import { FC } from "react";
import submitLesson from "../../api/submit-lesson";

const AreyousurePopup: FC<any> = ({ setAreYouSure, setThankU, lessonId }) => {
  const onSubmit = async (lessonId: string) => {
    await submitLesson(lessonId);

    setAreYouSure(false);
    setThankU(true);
  };

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
        }}
      >
        <h1>Vil du sende oppgavefiler til Github?</h1>

        <div style={{ marginTop: "5em" }}>
          <div style={{ float: "left", marginRight: "auto" }}>
            <Button onClick={() => onSubmit(lessonId)} content="Sende inn" />
          </div>
          <div style={{ float: "right", marginLeft: "auto" }}>
            <Button
              icon="x"
              style={{ background: "none" }}
              onClick={() => setAreYouSure(false)}
              content="Avbryt"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreyousurePopup;
