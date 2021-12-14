import "./ladingpagedatamodal.scss";
import { SyntheticEvent, useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Button, Grid, Modal, Popup } from "semantic-ui-react";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";

import Levels from "./Levels";
import License from "./License";
import { useLessonContext } from "../../../contexts/LessonContext";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { deepEqual } from "fast-equals";

const LandingpageDatamodal = () => {
  const lessonContext = useLessonContext();
  const { state, yml, setYml, updateYaml, updateLesson } = lessonContext;
  const [checkBoxState, setCheckBoxState] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
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
    console.log("tittei");
    prevData.current = { ...yml };
  }, [open]);

  useEffect(() => {
    if (isEmptyDatapanel) {
      setOpen(true);
    }
    const mapYamlTags = () => {
      let obj: Record<string, boolean> = {};

      obj = yml.tags.topic.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      obj = yml.tags.subject.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      obj = yml.tags.grade.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      setCheckBoxState((prevState) => ({ ...prevState, ...obj }));
    };
    if (yml.tags) {
      mapYamlTags();
    }
  }, [yml]);

  const onSubmit = async () => {
    if (deepEqual(yml, prevData.current)) {
      updateYaml(lessonId, yml);
      return setOpen(false);
    }
    setLoading(true);
    const status = await updateYaml(lessonId, yml);
    if (status === 200) {
      setOpen(false);
      setLoading(false);
    }
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
        onClose={() => {
          onSubmit();
          loading ? setOpen(false) : "";
        }}
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
                <Levels changeHandler={dropdownHandler} data={yml} />
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <License changeHandler={changeHandler} data={yml} />
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
            disabled={isEmptyDatapanel}
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
