import { Button, Popup } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { FC, useState } from "react";

interface SubmitButtonProps {
  mdText: string;
  flushAutosave: () => Promise<boolean>;
}

const SubmitButton: FC<SubmitButtonProps> = ({ mdText, flushAutosave }) => {
  const navigate = useNavigate();
  const { lessonId } = useParams<any>();
  const [saving, setSaving] = useState(false);

  // Saves what is not saved yet before leaving, instead of dropping the last seconds (K4).
  const navigateToHome = async () => {
    setSaving(true);
    const saved = await flushAutosave();
    setSaving(false);
    if (!saved && !window.confirm("Endringene er ikke lagret. Vil du gå til oversikten likevel?"))
      return;
    navigate(["/landingpage", lessonId].join("/"));
  };

  return (
    <div className="submit-button_button_group">
      <Popup
        content={"Til prosjektoversikt"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            style={{
              height: "3rem",
              marginRight: "0",
              padding: "0 1em 0 1em",
            }}
            basic
            aria-label="Til prosjektoversikt"
            disabled={!mdText || mdText.length === 0 || saving}
            loading={saving}
            size="big"
            onClick={navigateToHome}
            icon="home"
          />
        }
      />
    </div>
  );
};

export default SubmitButton;
