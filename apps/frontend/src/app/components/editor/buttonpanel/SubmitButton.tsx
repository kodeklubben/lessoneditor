import { Button, Popup } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { FC } from "react";

interface SubmitButtonProps {
  mdText: string;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
  saveEditorText: () => void;
}

const SubmitButton: FC<SubmitButtonProps> = ({ mdText, setShowSpinner, saveEditorText }) => {
  const navigate = useNavigate();
  const { lessonId } = useParams<any>();

  const onSubmit = () => {
    setShowSpinner(true);
    navigateToHome();
    setShowSpinner(false);
  };

  const navigateToHome = () => {
    saveEditorText();
    const target = ["/landingpage", lessonId, "lessontexts"].join("/");
    navigate(target);
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
