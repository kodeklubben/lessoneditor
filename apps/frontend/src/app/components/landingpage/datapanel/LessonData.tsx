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
  const { ymlData, setYmlData, saveYmlData } = lessonContext;
  const [checkBoxState, setCheckBoxState] = useState({});

  useEffect(() => {
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

  useEffect(() => {
    return () => {
      saveYmlData(ymlData);
    };
  });

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
            <Levels changeHandler={dropdownHandler} data={ymlData} />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <License changeHandler={changeHandler} data={ymlData} />
    </Container>
  );
};

export default LandingpageDatamodal;
