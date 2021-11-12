import { SyntheticEvent, useEffect, useState } from "react";
import { Container, Grid } from "semantic-ui-react";
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
  const { state, setYml } = lessonContext;
  const [checkBoxState, setCheckBoxState] = useState({});

  useEffect(() => {
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
    if (state.yml) {
      mapYamlTags();
    }
  }, [state.yml]);


  const dropdownHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    setYml((s) => ({
      ...s,
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
    if (!state.yml.tags[subtag].includes(name)) {
      setYml((s) => ({
        ...s,
        tags: {
          ...s.tags,
          [subtag]: [...s.tags[subtag], name],
        },
      }));
    } else {
      setYml((s) => ({
        ...s,
        tags: {
          ...s.tags,
          [subtag]: s.tags[subtag].filter((e: string) => e !== name),
        },
      }));
    }
  };

  const changeHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    const name = data.name;
    const value = data.value;

    setYml((s) => ({
      ...s,
      [name]: value,
    }));
  };

  return (
    <Container style={{ marginTop: "1em" }}>
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
    </Container>
  );
};

export default LandingpageDatamodal;
