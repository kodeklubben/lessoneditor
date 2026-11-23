import "./tags.scss";
import { FC, SyntheticEvent } from "react";
import { Checkbox } from "semantic-ui-react";
import {
  gradeSettings as builtInGrades,
  subjectSettings as builtInSubjects,
  topicSettings as builtInTopics,
} from "../settingsFiles/LESSONTAGSSETTINGS";
import { useCatalog } from "../../../utils/useCatalog";

type Setting = { name: string; value: string; subtag: string };

/** The repo's tags (#335) when they are read, otherwise the editor's own list. */
function useTagSettings(subtag: "topic" | "subject" | "grade", builtIn: Setting[]): Setting[] {
  const catalog = useCatalog();
  const fromRepo = catalog?.[subtag];
  return fromRepo?.length ? fromRepo.map(({ name, value }) => ({ name, value, subtag })) : builtIn;
}

interface CheckboxWrapperProps {
  name: string;
  subtag: string;
  data: Record<string, boolean>;
  value: string;
  onCheck: (e: SyntheticEvent, data: Record<string, string>) => void;
}

interface Tags {
  changeHandler: (e: SyntheticEvent, data: Record<string, string>) => void;
  data: Record<string, boolean>;
}

const CheckboxWrapper: FC<CheckboxWrapperProps> = ({ value, onCheck, data, name, subtag }) => {
  return (
    <div className="checkbox_wrapper">
      <Checkbox
        label={name}
        type="checkbox"
        checked={data[value]}
        name={name}
        subtag={subtag}
        id={value}
        value={value}
        onChange={onCheck}
      />
    </div>
  );
};

const TagsGrade: FC<Tags> = ({ changeHandler, data }) => {
  const gradeSettings = useTagSettings("grade", builtInGrades);
  return (
    <div className="tags_container">
      <div>
        {gradeSettings.slice(0, gradeSettings.length / 2 + 1).map((element) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>

      <div>
        {gradeSettings.slice(gradeSettings.length / 2 + 1).map((element) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>
    </div>
  );
};

const TagsSubject: FC<Tags> = ({ changeHandler, data }) => {
  const subjectSettings = useTagSettings("subject", builtInSubjects);
  return (
    <div className="tags_container">
      <div>
        {subjectSettings.slice(0, subjectSettings.length / 2 + 1).map((element) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>

      <div>
        {subjectSettings.slice(subjectSettings.length / 2 + 1).map((element, index) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>
    </div>
  );
};

const TagsTopic: FC<Tags> = ({ changeHandler, data }) => {
  const topicSettings = useTagSettings("topic", builtInTopics);
  return (
    <div className="tags_container">
      <div>
        {topicSettings.slice(0, topicSettings.length / 2).map((element, index) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>

      <div>
        {topicSettings.slice(topicSettings.length / 2).map((element, index) => (
          <CheckboxWrapper
            key={element.value}
            name={element.name}
            subtag={element.subtag}
            data={data}
            value={element.value}
            onCheck={changeHandler}
          />
        ))}
      </div>
    </div>
  );
};

export { TagsGrade, TagsSubject, TagsTopic };
