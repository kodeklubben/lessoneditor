import React, { useContext } from "react";
import { useParams, useHistory } from "react-router";
import { LessonContext } from "contexts/LessonContext";
import { Dropdown } from "semantic-ui-react";

const languageOptions = [
  {
    key: 1,
    text: "Bokmål",
    value: "nb",
    image: { avatar: true, src: "/languagesFlag/flag_nb.svg" },
  },
  {
    key: 2,
    text: "Nynorsk",
    value: "nn",
    image: { avatar: true, src: "/languagesFlag/flag_nn.svg" },
  },
  {
    key: 3,
    text: "Engelsk",
    value: "en",
    image: { avatar: true, src: "/languagesFlag/flag_en.svg" },
  },
  {
    key: 4,
    text: "Islandsk",
    value: "is",
    image: { avatar: true, src: "/languagesFlag/flag_is.svg" },
  },
];

const Languages = () => {
  const history = useHistory();
  const { lessonId, file } = useParams();
  const lessonContext = useContext(LessonContext);
  const { data } = lessonContext;
  const handleChange = (event, { name, value }) => {
    lessonContext.setLanguage(value);
    if (lessonId && file) {
      const target = ["/editor", lessonId, data.lesson + "_" + value].join("/");
      history.push(target);
    }
  };
  return (
    <div>
      <Dropdown
        style={{
          width: "13em",
          position: "relative",
          top: "-0.7em",
          left: "-2em",
        }}
        placeholder="Velg Språk"
        name="language"
        defaultValue={languageOptions[0].value}
        fluid
        selection
        onChange={handleChange}
        options={languageOptions}
      />
    </div>
  );
};

export default Languages;
