import { Button, Popup } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { FC } from "react";
import { useFileContext } from "../../../contexts/FileContext";

interface SubmitButtonProps {
  mdText: string;
}

const SubmitButton: FC<SubmitButtonProps> = ({ mdText }) => {
  const navigate = useNavigate();
  const { lessonId } = useParams<any>();
  const { saveFileBody } = useFileContext();

  const onSubmit = () => {
    navigateToHome();
  };

  const navigateToHome = () => {
    saveFileBody(mdText);
    const target = ["/landingpage", lessonId].join("/");
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
