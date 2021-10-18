import "./ladingpagedatamodal.scss";
import { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Button, Grid, Modal, Popup } from "semantic-ui-react";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";

import Levels from "./Levels";
import License from "./License";
import { useLessonContext } from "../../../contexts/LessonContext";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";

const LandingpageDatamodal = () => {
  const lessonContext = useLessonContext();
  const { state, setLessonContextState, updateYaml, updateLesson } = lessonContext;
  const [checkBoxState, setCheckBoxState] = useState({});
  const [open, setOpen] = useState(false);
  const { lessonId } = useParams<{ lessonId: string }>();

  const isEmptyDatapanel = false;

  useEffect(() => {
    if (isEmptyDatapanel) {
      setOpen(true);
    }
    const mapYamlTags = () => {
      let obj: Record<string, boolean> = {};

      obj = state.yml.tags.topic.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      obj = state.yml.tags.subject.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      obj = state.yml.tags.grade.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      setCheckBoxState((prevState) => ({ ...prevState, ...obj }));
    };
    if (state.yml.tags) {
      mapYamlTags();
    }
  }, [state.yml.tags]);

  const onSubmit = () => {
    updateYaml(lessonId, state.yml);
    setOpen(false);
  };

  const dropdownHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    setLessonContextState((s: any) => ({
      ...s,
      yml: { ...s.yml, level: data.value },
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
    if (!state.yml.tags[subtag].includes(name)) {
      setLessonContextState((prevState: any) => ({
        ...prevState,
        yml: {
          ...prevState.yml,
          tags: {
            ...prevState.yml.tags,
            [subtag]: [...prevState.yml.tags[subtag], name],
          },
        },
      }));
    } else {
      setLessonContextState((prevState: any) => ({
        ...prevState,
        yml: {
          ...prevState.yml,
          tags: {
            ...prevState.yml.tags,
            [subtag]: prevState.yml.tags[subtag].filter((e: string) => e !== name),
          },
        },
      }));
    }
  };

  const changeHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    const name = data.name;
    const value = data.value;

    setLessonContextState((prevState: any) => ({
      ...prevState,
      yml: { ...prevState.yml, [name]: value },
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
                <Levels changeHandler={dropdownHandler} data={state.yml} />
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <License changeHandler={changeHandler} data={state.yml} />
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
