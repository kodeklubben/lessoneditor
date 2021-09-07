import "./ladingpagedatamodal.scss";
import { SyntheticEvent, useEffect, useState } from "react";
import { Button, Grid, Modal, Popup } from "semantic-ui-react";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";
import Levels from "./Levels";
import License from "./License";
import { useLessonContext } from "../../../contexts/LessonContext";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";

interface YmlData {
  level: number;
  license: string;
  tags: { grade: string[]; subject: string[]; topic: string[] };
}

const LandingpageDatamodal = () => {
  const lessonContext = useLessonContext();
  const { ymlData, setYmlData, saveYmlData } = lessonContext;
  const [checkBoxState, setCheckBoxState] = useState({});
  const [open, setOpen] = useState(false);

  const isEmptyDatapanel = false;

  useEffect(() => {
    if (isEmptyDatapanel) {
      setOpen(true);
    }
    const mapYamlTags = () => {
      let obj: Record<string, boolean> = {};

      obj = ymlData.tags.topic.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      obj = ymlData.tags.subject.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      obj = ymlData.tags.grade.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      setCheckBoxState((prevState) => ({ ...prevState, ...obj }));
    };
    if (ymlData) {
      mapYamlTags();
    }
  }, [ymlData]);

  const onSubmit = async () => {
    await saveYmlData(ymlData);
    setOpen(false);
  };

  const dropdownHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    setYmlData((prevState: YmlData) => ({
      ...prevState,
      [data.name]: data.value,
    }));
  };

  const checboxHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    const subtag: "grade" | "subject" | "topic" =
      data.subtag === "grade" || data.subtag === "subject" || data.subtag === "topic"
        ? data.subtag
        : "grade";

    const name: string = data.value;
    const value: string = data.checked;
    setCheckBoxState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (!ymlData.tags[subtag].includes(name)) {
      setYmlData((prevState: YmlData) => ({
        ...prevState,
        tags: {
          ...prevState.tags,
          [subtag]: [...prevState.tags[subtag], name],
        },
      }));
    } else {
      setYmlData((prevState: YmlData) => ({
        ...prevState,
        tags: {
          ...prevState.tags,
          [subtag]: prevState.tags[subtag].filter((e: string) => e !== name),
        },
      }));
    }
  };

  const changeHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    const name = data.name;
    const value = data.value;

    setYmlData((prevState: YmlData) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Popup
        content={"Endre prosjektdata"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            basic
            onClick={() => setOpen(true)}
            content="Oppgavedata"
            id="tagButton"
            size="medium"
            icon="tags"
          />
        }
      />
      <Modal
        closeOnDimmerClick={isEmptyDatapanel ? false : true}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="large"
        dimmer="inverted"
        className="landingpage_modal"
      >
        <Modal.Header className="landingpage_modal">Oppgavedata</Modal.Header>
        <Modal.Content className="landingpage_modal">
          <Grid divided="vertically">
            <Grid.Row columns={2}>
              <Grid.Column>
                <CheckboxField
                  labelTitle={YML_TEXT.topic}
                  content={<TagsTopic data={checkBoxState} changeHandler={checboxHandler} />}
                />
              </Grid.Column>
              <Grid.Column>
                <CheckboxField
                  labelTitle={YML_TEXT.subject}
                  content={<TagsSubject data={checkBoxState} changeHandler={checboxHandler} />}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid divided="vertically">
            <Grid.Row columns={2}>
              <Grid.Column>
                <CheckboxField
                  labelTitle={YML_TEXT.grade}
                  content={<TagsGrade data={checkBoxState} changeHandler={checboxHandler} />}
                />
              </Grid.Column>
              <Grid.Column>
                <Levels changeHandler={dropdownHandler} data={ymlData} />
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <License changeHandler={changeHandler} data={ymlData} />
        </Modal.Content>

        <Modal.Actions className="landingpage_modal">
          {isEmptyDatapanel ? (
            <p>
              <i style={{ color: "red" }}>
                Må inneholde minst ett valg i kategoriene Tema, Fag, eller Klassetrinn
              </i>
            </p>
          ) : (
            <p style={{ height: "1.3em" }} />
          )}

          <Button
            disabled={false}
            onClick={onSubmit}
            content="OK"
            labelPosition="right"
            icon="checkmark"
            positive
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default LandingpageDatamodal;
