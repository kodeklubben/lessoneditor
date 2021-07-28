import { Button, Popup } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import { FC } from "react";

const SubmitButton: FC<any> = ({ mdText, setShowSpinner, saveEditorText }) => {
  const history = useHistory();
  const { lessonId, file } = useParams<any>();

  const onSubmit = async () => {
    setShowSpinner(true);
    await navigateToHome();
    setShowSpinner(false);
  };

  const navigateToHome = async () => {
    await saveEditorText();
    const slug =
      file.slice(0, 6) === "README" ? "teacherguides" : "lessontexts";
    const target = ["/landingpage", lessonId, slug].join("/");
    history.push({ pathname: target });
  };

  return (
    <div>
      <Popup
        content={"Til prosjektoversikt"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            style={{
              height: "2em",
              marginRight: "-0.5em",
              padding: "0 1em 0 1em",
            }}
            basic
            disabled={!mdText || mdText.length === 0}
            size="big"
            onClick={onSubmit}
            icon="arrow right"
          />
        }
      />
    </div>
  );
};

export default SubmitButton;
