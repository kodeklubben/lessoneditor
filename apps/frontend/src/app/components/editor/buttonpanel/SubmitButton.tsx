import { Button, Popup } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import { FC } from "react";

interface SubmitButtonProps {
  mdText: string;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
  saveEditorText: () => void;
}

const SubmitButton: FC<SubmitButtonProps> = ({ mdText, setShowSpinner, saveEditorText }) => {
  const history = useHistory();
  const { lessonId } = useParams<{ lessonId: string }>();

  const onSubmit = () => {
    setShowSpinner(true);
    navigateToHome();
    setShowSpinner(false);
  };

  const navigateToHome = () => {
    saveEditorText();
    const target = ["/landingpage", lessonId, "lessontexts"].join("/");
    history.push(target);
  };

  return (
    <>
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
            icon="home"
          />
        }
      />
    </>
  );
};

export default SubmitButton;
