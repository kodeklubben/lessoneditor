import "./ladingpagedatamodal.scss";
import { useEffect, useState } from "react";
import { Button, Grid, Modal, Popup } from "semantic-ui-react";
import { TagsGrade, TagsSubject, TagsTopic } from "./Tags";
import CheckboxField from "./CheckboxField";
import Levels from "./Levels";
import License from "./License";
import { useLessonContext } from "../../../contexts/LessonContext";
import { YML_TEXT } from "../settingsFiles/languages/landingpage_NO";
import { LessonContextState } from "../../../contexts/lessonContext.functions";

// TODO: FIKSE AVBRYTKNAPP

const LandingpageDatamodal = () => {
  const context = useLessonContext();
  const { state, setLessonContextState, updateYaml } = context;
  const [checkBoxState, setCheckBoxState] = useState({});
  const [open, setOpen] = useState(false);

  const ymlData = state.yml?.content

  const isEmptyDatapanel =
    JSON.stringify(ymlData?.tags) === JSON.stringify({ topic: [], subject: [], grade: [] });

  /*
   * Det ser ut som vi trenger denne useEffecten for å forhindre inifite loop
   */
  useEffect(() => {
    if (isEmptyDatapanel) {
      setOpen(true);
    }
    const mapYamlTags = () => {
      let obj: {};
      obj = ymlData?.tags.topic.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string | number) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        // @ts-ignore
        { ...obj }
      );
      obj = ymlData?.tags.subject.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string | number) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      obj = ymlData?.tags.grade.reduce(
        (accumulator: { [x: string]: boolean }, currentValue: string | number) => {
          accumulator[currentValue] = true;
          return accumulator;
        },
        { ...obj }
      );
      setCheckBoxState((prevState) => ({ ...prevState, ...obj }));
    };
    if (ymlData?.tags) {
      mapYamlTags();
    }
  }, [ymlData?.tags, isEmptyDatapanel]);

  const onSubmit = async () => {
    updateYaml(state.lesson!.lessonId ,ymlData!)
    setOpen(false);
  };

  const dropdownHandler = (event: any, { name, value }: any) => {
    setLessonContextState((s) =>
    {
      return{
        ...s,
        yml: {
          fileId: s.yml!.fileId,
          filename: s.yml!.filename,
          ext: s.yml!.ext,
          content: {
            ...s.yml!.content,
            level: value
          }
        }
      }
    })
  };

  const checboxHandler = (event: {
    target: { getAttribute: (arg0: string) => any; value: any; checked: any };
  }) => {
    const subtag = event.target.getAttribute("subtag");
    const name = event.target.value;
    const value = event.target.checked;

    setCheckBoxState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!ymlData?.tags[subtag].includes(name)) {
      setLessonContextState((s) =>
      {
        return{
          ...s,
          yml: {
            fileId: s.yml!.fileId,
            filename: s.yml!.filename,
            ext: s.yml!.ext,
            content: {
              ...s.yml!.content,
              tags: {
                ...s.yml!.content.tags,
                [subtag]: [...s.yml!.content.tags[subtag], name]
              }
            }
          }
        }
      })
    } else {
      setLessonContextState((s) =>
      {
        return{
          ...s,
          yml: {
            fileId: s.yml!.fileId,
            filename: s.yml!.filename,
            ext: s.yml!.ext,
            content: {
              ...s.yml!.content,
              tags: {
                ...s.yml!.content.tags,
                [subtag]: s.yml!.content.tags[subtag].filter((e: any) => e !== name)
              }
            }
          }
        }
      })
    }
  };

  const changeHandler = (event: { target: { name: any; value: any } }) => {
    const name = event.target.name;
    const value = event.target.value;

    setLessonContextState((s) =>
    {
      return {
        ...s,
        yml: {
          fileId: s.yml!.fileId,
          filename: s.yml!.filename,
          ext: s.yml!.ext,
          content: {
            ...s.yml!.content,
            license: value
          },
        }
      }
    })
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
            disabled={isEmptyDatapanel}
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
