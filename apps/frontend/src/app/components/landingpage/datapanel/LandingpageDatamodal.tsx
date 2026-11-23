import "./ladingpagedatamodal.scss";
import { SyntheticEvent, useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import FieldError from "../../shared/FieldError";
import { Button, Modal, Popup } from "semantic-ui-react";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";

import Levels from "./Levels";
import License from "./License";
import { useLessonContext } from "../../../contexts/LessonContext";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { deepEqual } from "fast-equals";

const LandingpageDatamodal = () => {
  const lessonContext = useLessonContext();
  const { state, yml, setYml, updateYaml } = lessonContext;
  const [isEmptyDatapanelText, setIsEmptyDatapanelText] = useState<boolean>(false);
  const [checkBoxState, setCheckBoxState] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveError, setSaveError] = useState("");
  const { lessonId } = useParams() as any;

  const prevData = useRef<any>(null);

  const isEmptyDatapanel =
    JSON.stringify(yml) ===
    JSON.stringify({
      level: 1,
      license: "CC BY-SA 4.0",
      tags: { topic: [], subject: [], grade: [] },
    });

  useEffect(() => {
    prevData.current = { ...yml };
  }, [open]);

  // Opens by itself once for a lesson without data. «Senere» puts the data back (setYml), which
  // runs this effect again; without the ref the dialog opened again at once.
  const openedByItself = useRef(false);
  useEffect(() => {
    if (isEmptyDatapanel && !openedByItself.current) {
      openedByItself.current = true;
      setOpen(true);
    }
    const mapYamlTags = () => {
      let obj: Record<string, boolean> = {};

      obj = yml.tags.topic.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj },
      );
      obj = yml.tags.subject.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj },
      );
      obj = yml.tags.grade.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj },
      );
      // Replaced, not merged: after «Avbryt» a box ticked in the dialog must be unticked again.
      setCheckBoxState(obj);
    };
    if (yml.tags) {
      mapYamlTags();
    }
  }, [yml]);

  const onSubmit = async () => {
    if (isEmptyDatapanel) {
      setIsEmptyDatapanelText(true);
      return;
    }
    if (deepEqual(yml, prevData.current)) return setOpen(false);
    // A failed save used to close the dialog as if it had worked.
    setLoading(true);
    setSaveError("");
    const status = await updateYaml(lessonId, yml);
    setLoading(false);
    if (status === 200) {
      setOpen(false);
      setIsEmptyDatapanelText(false);
    } else {
      setSaveError("Kunne ikke lagre oppgavedataene. Prøv igjen.");
    }
  };

  /** «Avbryt» and Esc (5): back to what was saved, nothing is written. */
  const cancel = () => {
    if (prevData.current) setYml(prevData.current);
    setIsEmptyDatapanelText(false);
    setSaveError("");
    setOpen(false);
  };

  const dropdownHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    setYml((s: any) => {
      return {
        ...s,
        level: +data.value,
      };
    });
  };

  const checboxHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    const subtag: "grade" | "subject" | "topic" =
      data.subtag === "grade" || data.subtag === "subject" || data.subtag === "topic"
        ? data.subtag
        : "grade";
    const value: string = data.value;
    const isChecked: string = data.checked;
    setCheckBoxState((prevState) => ({
      ...prevState,
      [value]: isChecked,
    }));
    if (!state.yml.tags[subtag].includes(value)) {
      setYml((s) => {
        return {
          ...s,
          tags: {
            ...s.tags,
            [subtag]: [...s.tags[subtag], value],
          },
        };
      });
    } else {
      setYml((s) => {
        return {
          ...s,
          tags: {
            ...s.tags,
            [subtag]: s.tags[subtag].filter((e: string) => e !== value),
          },
        };
      });
    }
  };

  const changeHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    const name = data.name;
    const value = data.value;

    setYml((s: any) => ({
      ...s,
      [name]: value,
    }));
  };

  const isTouchDevice = () => {
    return "ontouchstart" in document.documentElement;
  };

  return (
    <>
      <Popup
        content={"Endre prosjektdata"}
        disabled={isTouchDevice()}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <div>
            <Button
              className="le-secondary"
              onClick={() => setOpen(true)}
              content="Oppgavedata"
              id="landingpage_datamodal_trigger__big"
              size="medium"
              icon="tags"
            />
            <Button
              className="le-secondary"
              onClick={() => setOpen(true)}
              id="landingpage_datamodal_trigger__small"
              size="medium"
              icon="tags"
              aria-label="Oppgavedata"
            />
          </div>
        }
      />
      <Modal
        closeOnDimmerClick={false}
        onClose={cancel}
        onOpen={() => setOpen(true)}
        open={open}
        size="large"
        dimmer="inverted"
        className="landingpage_modal"
      >
        <Modal.Header className="landingpage_modal__header">Oppgavedata</Modal.Header>
        <Modal.Content id="landingpage_modal__content">
          <CheckboxField
            labelTitle={YML_TEXT.topic}
            content={<TagsTopic data={checkBoxState} changeHandler={checboxHandler} />}
          />

          <CheckboxField
            labelTitle={YML_TEXT.subject}
            content={<TagsSubject data={checkBoxState} changeHandler={checboxHandler} />}
          />

          <CheckboxField
            labelTitle={YML_TEXT.grade}
            content={<TagsGrade data={checkBoxState} changeHandler={checboxHandler} />}
          />

          <div className="form_container">
            <Levels changeHandler={dropdownHandler} data={yml} />
            <License changeHandler={changeHandler} data={yml} />
          </div>
        </Modal.Content>

        <Modal.Actions
          className="landingpage_modal"
          style={{ display: "flex", alignItems: "center", gap: "0.5em" }}
        >
          <div style={{ textAlign: "left", flex: 1 }}>
            <FieldError>
              {saveError ||
                (isEmptyDatapanelText &&
                  "Velg minst ett tema, fag eller klassetrinn. Det hjelper lærere å finne oppgaven.")}
            </FieldError>
          </div>

          {/* «Senere» while nothing is filled in yet (M3); otherwise it discards the changes. */}
          <Button basic content={isEmptyDatapanel ? "Senere" : "Avbryt"} onClick={cancel} />
          <Button
            onClick={onSubmit}
            content="OK"
            labelPosition="right"
            icon="checkmark"
            positive
            loading={loading}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default LandingpageDatamodal;
